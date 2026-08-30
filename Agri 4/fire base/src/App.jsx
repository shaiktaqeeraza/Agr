import { Routes, Route, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext.jsx'
import Feed from './pages/Feed.jsx'
import Chats from './pages/Chats.jsx'
import ChatWindow from './pages/ChatWindow.jsx'
import Following from './pages/Following.jsx'
import Profile from './pages/Profile.jsx'
import Saved from './pages/Saved.jsx'
import {
  LeafIcon, BellIcon, HomeIcon, ChatIcon, UsersIcon, UserIcon,
} from './components/icons.jsx'

export default function App() {
  const { loading } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()

  if (loading) {
    return (
      <div className="full-loading">
        <div className="spinner" />
      </div>
    )
  }

  const inChatWindow = location.pathname.startsWith('/chats/')

  return (
    <div className="app-shell">
      {!inChatWindow && (
        <>
          <div className="topbar">
            <div className="brand"><LeafIcon /> CropsConnection</div>
            <button className="bell-btn" aria-label="Notifications">
              <BellIcon />
              <span className="bell-dot" />
            </button>
          </div>
        </>
      )}

      <Routes>
        <Route path="/" element={<Feed />} />
        <Route path="/chats" element={<Chats />} />
        <Route path="/chats/:chatId" element={<ChatWindow />} />
        <Route path="/following" element={<Following />} />
        <Route path="/saved" element={<Saved />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/profile/:userId" element={<Profile />} />
      </Routes>

      {!inChatWindow && (
        <nav className="bottom-nav">
          <button className={location.pathname === '/' ? 'active' : ''} onClick={() => navigate('/')}>
            <HomeIcon /> Feed
          </button>
          <button className={location.pathname === '/chats' ? 'active' : ''} onClick={() => navigate('/chats')}>
            <ChatIcon /> Chats
          </button>
          <button className={location.pathname === '/following' ? 'active' : ''} onClick={() => navigate('/following')}>
            <UsersIcon /> Following
          </button>
          <button className={location.pathname.startsWith('/profile') ? 'active' : ''} onClick={() => navigate('/profile')}>
            <UserIcon /> Profile
          </button>
        </nav>
      )}
    </div>
  )
}
