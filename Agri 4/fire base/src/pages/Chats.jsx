import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { collection, query, where, onSnapshot, doc, getDoc, orderBy } from 'firebase/firestore'
import { db } from '../firebase.js'
import { useAuth } from '../context/AuthContext.jsx'
import { timeAgo } from '../utils/timeAgo.js'

export default function Chats() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [chats, setChats] = useState([])

  useEffect(() => {
    if (!user) return
    const q = query(
      collection(db, 'chats'),
      where('participants', 'array-contains', user.uid),
      orderBy('lastMessageAt', 'desc')
    )
    const unsub = onSnapshot(q, async (snap) => {
      const rows = await Promise.all(snap.docs.map(async (d) => {
        const chat = { id: d.id, ...d.data() }
        const otherId = chat.participants.find((p) => p !== user.uid)
        const otherSnap = await getDoc(doc(db, 'users', otherId))
        return { ...chat, other: otherSnap.exists() ? { id: otherId, ...otherSnap.data() } : { id: otherId, name: 'Unknown user' } }
      }))
      setChats(rows)
    })
    return unsub
  }, [user])

  return (
    <div className="scroll-area">
      {chats.length === 0 && (
        <div className="empty-state">
          <h3>No conversations yet</h3>
          <p>Message a farmer from the Feed to start chatting.</p>
        </div>
      )}
      {chats.map((chat) => (
        <div key={chat.id} className="chat-list-item" onClick={() => navigate(`/chats/${chat.id}`)} style={{ cursor: 'pointer' }}>
          <div className="avatar">
            {chat.other.photoURL ? <img src={chat.other.photoURL} alt="" /> : (chat.other.initials || chat.other.name?.slice(0, 2).toUpperCase())}
          </div>
          <div style={{ minWidth: 0 }}>
            <div className="name">{chat.other.name}</div>
            <div className="preview">{chat.lastMessage || 'Say hello 👋'}</div>
          </div>
          <div className="meta">{chat.lastMessageAt ? timeAgo(chat.lastMessageAt) : ''}</div>
        </div>
      ))}
    </div>
  )
}
