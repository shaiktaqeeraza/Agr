import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { collection, query, where, onSnapshot, doc, getDoc } from 'firebase/firestore'
import { db } from '../firebase.js'
import { useAuth } from '../context/AuthContext.jsx'

export default function Following() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [farmers, setFarmers] = useState([])

  useEffect(() => {
    if (!user) return
    const q = query(collection(db, 'follows'), where('followerId', '==', user.uid))
    const unsub = onSnapshot(q, async (snap) => {
      const rows = await Promise.all(snap.docs.map(async (d) => {
        const id = d.data().followingId
        const userSnap = await getDoc(doc(db, 'users', id))
        return userSnap.exists() ? { id, ...userSnap.data() } : null
      }))
      setFarmers(rows.filter(Boolean))
    })
    return unsub
  }, [user])

  return (
    <div className="scroll-area">
      {farmers.length === 0 && (
        <div className="empty-state">
          <h3>Not following anyone yet</h3>
          <p>Follow farmers from the Feed to see them here.</p>
        </div>
      )}
      {farmers.map((f) => (
        <div key={f.id} className="chat-list-item" onClick={() => navigate(`/profile/${f.id}`)} style={{ cursor: 'pointer' }}>
          <div className="avatar">
            {f.photoURL ? <img src={f.photoURL} alt="" /> : (f.initials || f.name?.slice(0, 2).toUpperCase())}
          </div>
          <div style={{ minWidth: 0 }}>
            <div className="name">{f.name}</div>
            <div className="preview">{f.location || 'Location not set'}</div>
          </div>
        </div>
      ))}
    </div>
  )
}
