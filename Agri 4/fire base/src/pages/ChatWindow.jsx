import { useEffect, useRef, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  collection, query, orderBy, onSnapshot, addDoc, serverTimestamp,
  doc, getDoc, updateDoc,
} from 'firebase/firestore'
import { db } from '../firebase.js'
import { useAuth } from '../context/AuthContext.jsx'
import { ChevronLeftIcon, SendIcon } from '../components/icons.jsx'

export default function ChatWindow() {
  const { chatId } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [messages, setMessages] = useState([])
  const [other, setOther] = useState(null)
  const [text, setText] = useState('')
  const bottomRef = useRef(null)

  useEffect(() => {
    async function loadOther() {
      const chatSnap = await getDoc(doc(db, 'chats', chatId))
      if (!chatSnap.exists()) return
      const otherId = chatSnap.data().participants.find((p) => p !== user.uid)
      const otherSnap = await getDoc(doc(db, 'users', otherId))
      setOther(otherSnap.exists() ? { id: otherId, ...otherSnap.data() } : { id: otherId, name: 'Unknown user' })
    }
    if (user) loadOther()
  }, [chatId, user])

  useEffect(() => {
    const q = query(collection(db, 'chats', chatId, 'messages'), orderBy('createdAt', 'asc'))
    const unsub = onSnapshot(q, (snap) => {
      setMessages(snap.docs.map((d) => ({ id: d.id, ...d.data() })))
    })
    return unsub
  }, [chatId])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  async function handleSend() {
    const trimmed = text.trim()
    if (!trimmed || !user) return
    setText('')
    await addDoc(collection(db, 'chats', chatId, 'messages'), {
      senderId: user.uid,
      text: trimmed,
      createdAt: serverTimestamp(),
    })
    await updateDoc(doc(db, 'chats', chatId), {
      lastMessage: trimmed,
      lastMessageAt: serverTimestamp(),
    })
  }

  return (
    <div className="chat-window">
      <div className="chat-header">
        <button className="back" onClick={() => navigate('/chats')}><ChevronLeftIcon /></button>
        <div className="avatar">
          {other?.photoURL ? <img src={other.photoURL} alt="" /> : (other?.initials || other?.name?.slice(0, 2).toUpperCase())}
        </div>
        <div className="name">{other?.name || 'Loading…'}</div>
      </div>

      <div className="chat-messages">
        {messages.map((m) => (
          <div key={m.id} className={`bubble ${m.senderId === user?.uid ? 'mine' : 'theirs'}`}>
            {m.text}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      <div className="chat-input-bar">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Type a message…"
        />
        <button onClick={handleSend} aria-label="Send"><SendIcon width={16} height={16} /></button>
      </div>
    </div>
  )
}
