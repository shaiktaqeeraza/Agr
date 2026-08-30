import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  collection, query, orderBy, onSnapshot, doc, setDoc, deleteDoc,
  getDoc, getDocs, updateDoc, increment, serverTimestamp, where,
} from 'firebase/firestore'
import { db } from '../firebase.js'
import { useAuth } from '../context/AuthContext.jsx'
import SearchBar from '../components/SearchBar.jsx'
import PostCard from '../components/PostCard.jsx'
import CreatePostModal from '../components/CreatePostModal.jsx'
import { PlusIcon } from '../components/icons.jsx'

export default function Feed() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [posts, setPosts] = useState([])
  const [followingIds, setFollowingIds] = useState(new Set())
  const [savedIds, setSavedIds] = useState(new Set())
  const [search, setSearch] = useState('')
  const [showCreate, setShowCreate] = useState(false)

  useEffect(() => {
    const q = query(collection(db, 'posts'), orderBy('createdAt', 'desc'))
    const unsub = onSnapshot(q, (snap) => {
      setPosts(snap.docs.map((d) => ({ id: d.id, ...d.data() })))
    })
    return unsub
  }, [])

  useEffect(() => {
    if (!user) return
    const q = query(collection(db, 'follows'), where('followerId', '==', user.uid))
    const unsub = onSnapshot(q, (snap) => {
      setFollowingIds(new Set(snap.docs.map((d) => d.data().followingId)))
    })
    return unsub
  }, [user])

  useEffect(() => {
    if (!user) return
    const unsub = onSnapshot(collection(db, 'users', user.uid, 'saved'), (snap) => {
      setSavedIds(new Set(snap.docs.map((d) => d.id)))
    })
    return unsub
  }, [user])

  const filtered = useMemo(() => {
    if (!search.trim()) return posts
    const q = search.trim().toLowerCase()
    return posts.filter((p) =>
      p.cropName?.toLowerCase().includes(q) ||
      p.locationLabel?.toLowerCase().includes(q) ||
      p.userName?.toLowerCase().includes(q)
    )
  }, [posts, search])

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
    if (savedIds.has(postId)) {
      await deleteDoc(savedRef)
    } else {
      await setDoc(savedRef, { postId, createdAt: serverTimestamp() })
    }
  }

  async function handleSoldToggle(post) {
    const postRef = doc(db, 'posts', post.id)
    const currentlySold = post.status === 'sold' || post.availableQuantity <= 0
    if (currentlySold) {
      await updateDoc(postRef, { status: 'available', availableQuantity: post.totalQuantity })
    } else {
      await updateDoc(postRef, { status: 'sold', availableQuantity: 0 })
    }
  }

  async function handleMessage(targetUserId) {
    if (!user || targetUserId === user.uid) return
    const chatId = [user.uid, targetUserId].sort().join('_')
    const chatRef = doc(db, 'chats', chatId)
    const existing = await getDoc(chatRef)
    if (!existing.exists()) {
      await setDoc(chatRef, {
        participants: [user.uid, targetUserId],
        lastMessage: '',
        lastMessageAt: serverTimestamp(),
      })
    }
    navigate(`/chats/${chatId}`)
  }

  return (
    <>
      <SearchBar value={search} onChange={setSearch} />
      <div className="scroll-area">
        {filtered.length === 0 && (
          <div className="empty-state">
            <h3>No crops yet</h3>
            <p>{search ? 'Try a different search.' : 'Be the first to post a crop for sale.'}</p>
          </div>
        )}
        {filtered.map((post) => (
          <PostCard
            key={post.id}
            post={post}
            isOwner={post.userId === user?.uid}
            isFollowing={followingIds.has(post.userId)}
            isSaved={savedIds.has(post.id)}
            onFollowToggle={handleFollowToggle}
            onSaveToggle={handleSaveToggle}
            onSoldToggle={handleSoldToggle}
            onMessage={handleMessage}
          />
        ))}
      </div>

      <button className="fab" onClick={() => setShowCreate(true)} aria-label="Create post">
        <PlusIcon width={26} height={26} />
      </button>

      {showCreate && (
        <CreatePostModal onClose={() => setShowCreate(false)} onCreated={() => {}} />
      )}
    </>
  )
}
