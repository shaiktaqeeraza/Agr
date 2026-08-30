// Signs everyone in anonymously the moment the app loads — no signup form,
// no typed-in name required. A friendly guest name/avatar is generated and
// stored in Firestore; people can personalize it any time from Profile.
import { createContext, useContext, useEffect, useState } from 'react'
import { onAuthStateChanged, signInAnonymously } from 'firebase/auth'
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore'
import { auth, db } from '../firebase'

const AuthContext = createContext(null)

const ADJECTIVES = ['Sunny', 'Green', 'Golden', 'Fresh', 'Rustic', 'Ripe', 'Fertile', 'Amber']
const NOUNS = ['Farmer', 'Grower', 'Harvester', 'Planter', 'Field']

function randomGuestName() {
  const a = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)]
  const n = NOUNS[Math.floor(Math.random() * NOUNS.length)]
  const num = Math.floor(1000 + Math.random() * 9000)
  return `${a}${n}${num}`
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      if (!firebaseUser) {
        try {
          await signInAnonymously(auth)
        } catch (err) {
          console.error('Anonymous sign-in failed:', err)
          setLoading(false)
        }
        return
      }

      setUser(firebaseUser)

      const userRef = doc(db, 'users', firebaseUser.uid)
      const snap = await getDoc(userRef)

      if (!snap.exists()) {
        const name = randomGuestName()
        const newProfile = {
          name,
          initials: name.slice(0, 2).toUpperCase(),
          photoURL: '',
          location: '',
          bio: '',
          followersCount: 0,
          followingCount: 0,
          createdAt: serverTimestamp(),
        }
        await setDoc(userRef, newProfile)
        setProfile({ id: firebaseUser.uid, ...newProfile })
      } else {
        setProfile({ id: firebaseUser.uid, ...snap.data() })
      }
      setLoading(false)
    })
    return unsub
  }, [])

  async function refreshProfile() {
    if (!user) return
    const snap = await getDoc(doc(db, 'users', user.uid))
    if (snap.exists()) setProfile({ id: user.uid, ...snap.data() })
  }

  return (
    <AuthContext.Provider value={{ user, profile, loading, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
