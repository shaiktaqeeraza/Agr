import { useEffect, useState } from 'react'
import { collection, onSnapshot, doc, getDoc, deleteDoc, setDoc, updateDoc, increment, serverTimestamp, query, where } from 'firebase/firestore'
import { db } from '../firebase.js'
import { useAuth } from '../context/AuthContext.jsx'
import { useNavigate } from 'react-router-dom'
import PostCard from '../components/PostCard.jsx'

export default function Saved() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [posts, setPosts] = useState([])
  const [followingIds, setFollowingIds] = useState(new Set())
  const [savedIds, setSavedIds] = useState(new Set())

  useEffect(() => {
    if (!user) return
    const unsub = onSnapshot(collection(db, 'users', user.uid, 'saved'), async (snap) => {
      const ids = snap.docs.map((d) => d.id)
      setSavedIds(new Set(ids))
      const rows = await Promise.all(ids.map(async (id) => {
        const postSnap = await getDoc(doc(db, 'posts', id))
        return postSnap.exists() ? { id, ...postSnap.data() } : null
      }))
      setPosts(rows.filter(Boolean))
    })
    return unsub
  }, [user])

  useEffect(() => {
    if (!user) return
    const q = query(collection(db, 'follows'), where('followerId', '==', user.uid))
    const unsub = onSnapshot(q, (snap) => setFollowingIds(new Set(snap.docs.map((d) => d.data().followingId))))
    return unsub
  }, [user])

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
    await deleteDoc(doc(db, 'users', user.uid, 'saved', postId))
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

  return (
    <div className="scroll-area">
      {posts.length === 0 && (
        <div className="empty-state">
          <h3>No saved posts</h3>
          <p>Tap the bookmark icon on any post to save it for later.</p>
        </div>
      )}
      {posts.map((post) => (
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
  )
}
