import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  doc, getDoc, updateDoc, collection, query, where, onSnapshot,
  setDoc, deleteDoc, increment, serverTimestamp,
} from 'firebase/firestore'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { db, storage } from '../firebase.js'
import { useAuth } from '../context/AuthContext.jsx'
import PostCard from '../components/PostCard.jsx'

export default function Profile() {
  const { userId } = useParams()
  const navigate = useNavigate()
  const { user, profile: myProfile, refreshProfile } = useAuth()
  const viewingId = userId || user?.uid
  const isOwn = viewingId === user?.uid

  const [profile, setProfile] = useState(null)
  const [posts, setPosts] = useState([])
  const [followingIds, setFollowingIds] = useState(new Set())
  const [savedIds, setSavedIds] = useState(new Set())
  const [editing, setEditing] = useState(false)
  const [name, setName] = useState('')
  const [bio, setBio] = useState('')
  const [location, setLocation] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    async function load() {
      if (isOwn) {
        setProfile(myProfile)
        setName(myProfile?.name || '')
        setBio(myProfile?.bio || '')
        setLocation(myProfile?.location || '')
      } else {
        const snap = await getDoc(doc(db, 'users', viewingId))
        if (snap.exists()) setProfile({ id: viewingId, ...snap.data() })
      }
    }
    if (viewingId) load()
  }, [viewingId, isOwn, myProfile])

  useEffect(() => {
    if (!viewingId) return
    const q = query(collection(db, 'posts'), where('userId', '==', viewingId))
    const unsub = onSnapshot(q, (snap) => {
      const rows = snap.docs.map((d) => ({ id: d.id, ...d.data() }))
      rows.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0))
      setPosts(rows)
    })
    return unsub
  }, [viewingId])

  useEffect(() => {
    if (!user) return
    const q = query(collection(db, 'follows'), where('followerId', '==', user.uid))
    const unsub = onSnapshot(q, (snap) => setFollowingIds(new Set(snap.docs.map((d) => d.data().followingId))))
    return unsub
  }, [user])

  useEffect(() => {
    if (!user) return
    const unsub = onSnapshot(collection(db, 'users', user.uid, 'saved'), (snap) => {
      setSavedIds(new Set(snap.docs.map((d) => d.id)))
    })
    return unsub
  }, [user])

  async function handleSaveEdit() {
    setSaving(true)
    try {
      await updateDoc(doc(db, 'users', user.uid), {
        name, bio, location, initials: name.slice(0, 2).toUpperCase() || 'GF',
      })
      await refreshProfile()
      setEditing(false)
    } finally {
      setSaving(false)
    }
  }

  async function handlePhotoUpload(e) {
    const file = e.target.files?.[0]
    if (!file || !user) return
    const storageRef = ref(storage, `avatars/${user.uid}`)
    await uploadBytes(storageRef, file)
    const url = await getDownloadURL(storageRef)
    await updateDoc(doc(db, 'users', user.uid), { photoURL: url })
    await refreshProfile()
  }

  async function handleFollowToggle(targetUserId) {
    if (!user || targetUserId === user.uid) return
    const followId = `${user.uid}_${targetUserId}`
    const followRef = doc(db, 'follows', followId)
    const existing = await getDoc(followRef)
    if (existing.exists()) {
      await deleteDoc(followRef)
      await updateDoc(doc(db, 'users', user.uid), { followingCount: increment(-1) })
      await updateDoc(doc(db, 'users', targetUserId), { followersCount: increment(-1) })
    } else {
      await setDoc(followRef, { followerId: user.uid, followingId: targetUserId, createdAt: serverTimestamp() })
      await updateDoc(doc(db, 'users', user.uid), { followingCount: increment(1) })
      await updateDoc(doc(db, 'users', targetUserId), { followersCount: increment(1) })
    }
  }

  async function handleSaveToggle(postId) {
    if (!user) return
    const savedRef = doc(db, 'users', user.uid, 'saved', postId)
    if (savedIds.has(postId)) await deleteDoc(savedRef)
    else await setDoc(savedRef, { postId, createdAt: serverTimestamp() })
  }

  async function handleSoldToggle(post) {
    const postRef = doc(db, 'posts', post.id)
    const currentlySold = post.status === 'sold' || post.availableQuantity <= 0
    if (currentlySold) await updateDoc(postRef, { status: 'available', availableQuantity: post.totalQuantity })
    else await updateDoc(postRef, { status: 'sold', availableQuantity: 0 })
  }

  async function handleMessage(targetUserId) {
    if (!user || targetUserId === user.uid) return
    const chatId = [user.uid, targetUserId].sort().join('_')
    const chatRef = doc(db, 'chats', chatId)
    const existing = await getDoc(chatRef)
    if (!existing.exists()) {
      await setDoc(chatRef, { participants: [user.uid, targetUserId], lastMessage: '', lastMessageAt: serverTimestamp() })
    }
    navigate(`/chats/${chatId}`)
  }

  if (!profile) return <div className="scroll-area"><div className="spinner" /></div>

  return (
    <div className="scroll-area" style={{ paddingTop: 0 }}>
      <div className="profile-header">
        <label className="profile-avatar" style={{ cursor: isOwn ? 'pointer' : 'default', position: 'relative' }}>
          {profile.photoURL ? <img src={profile.photoURL} alt="" /> : (profile.initials || profile.name?.slice(0, 2).toUpperCase())}
          {isOwn && <input type="file" accept="image/*" style={{ display: 'none' }} onChange={handlePhotoUpload} />}
        </label>

        {editing ? (
          <div style={{ textAlign: 'left', marginTop: 10 }}>
            <div className="field"><label>Name</label><input value={name} onChange={(e) => setName(e.target.value)} /></div>
            <div className="field"><label>Location</label><input value={location} onChange={(e) => setLocation(e.target.value)} /></div>
            <div className="field"><label>Bio</label><textarea rows={2} value={bio} onChange={(e) => setBio(e.target.value)} /></div>
            <button className="primary-btn" onClick={handleSaveEdit} disabled={saving}>{saving ? 'Saving…' : 'Save profile'}</button>
          </div>
        ) : (
          <>
            <div className="profile-name">{profile.name}</div>
            {profile.location && <div className="profile-loc">📍 {profile.location}</div>}
            {profile.bio && <div className="profile-loc" style={{ marginTop: 6 }}>{profile.bio}</div>}
            <div className="profile-stats">
              <div><div className="stat-num">{posts.length}</div><div className="stat-label">Posts</div></div>
              <div><div className="stat-num">{profile.followersCount || 0}</div><div className="stat-label">Followers</div></div>
              <div><div className="stat-num">{profile.followingCount || 0}</div><div className="stat-label">Following</div></div>
            </div>
            {isOwn ? (
              <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
                <button className="edit-profile-btn" onClick={() => setEditing(true)}>Edit profile</button>
                <button className="edit-profile-btn" onClick={() => navigate('/saved')}>Saved posts</button>
              </div>
            ) : (
              <button className={`follow-btn ${followingIds.has(viewingId) ? 'following' : ''}`} onClick={() => handleFollowToggle(viewingId)}>
                {followingIds.has(viewingId) ? 'Following' : 'Follow'}
              </button>
            )}
          </>
        )}
      </div>

      {posts.map((post) => (
        <PostCard
          key={post.id}
          post={post}
          isOwner={isOwn}
          isFollowing={followingIds.has(post.userId)}
          isSaved={savedIds.has(post.id)}
          onFollowToggle={handleFollowToggle}
          onSaveToggle={handleSaveToggle}
          onSoldToggle={handleSoldToggle}
          onMessage={handleMessage}
        />
      ))}
    </div>
  )
}
