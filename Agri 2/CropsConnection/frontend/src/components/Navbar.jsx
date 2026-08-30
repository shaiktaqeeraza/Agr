import React, { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Sprout, Bell, Home, MessageCircle, Users, User, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [unread, setUnread] = useState(0);

  useEffect(() => {
    if (!user) return;
    const fetchNotifs = async () => {
      try {
        const { data } = await api.get('/notifications');
        setUnread(data.filter(n => !n.read).length);
      } catch (e) {
        // ignore
      }
    };
    fetchNotifs();
  }, [user]);

  const navLinkClass = ({ isActive }) =>
    `flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-colors ${
      isActive ? 'text-crop-700 bg-crop-100' : 'text-crop-500 hover:text-crop-700'
    }`;

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-crop-100">
      <div className="max-w-5xl mx-auto flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
          <div className="bg-crop-600 text-white p-1.5 rounded-lg">
            <Sprout size={20} />
          </div>
          <span className="font-display font-semibold text-lg text-crop-800">CropsConnection</span>
        </div>

        {user && (
          <nav className="hidden md:flex items-center gap-1">
            <NavLink to="/" end className={navLinkClass}>
              <Home size={20} /> Feed
            </NavLink>
            <NavLink to="/chats" className={navLinkClass}>
              <MessageCircle size={20} /> Chats
            </NavLink>
            <NavLink to="/following" className={navLinkClass}>
              <Users size={20} /> Following
            </NavLink>
            <NavLink to="/profile" className={navLinkClass}>
              <User size={20} /> Profile
            </NavLink>
          </nav>
        )}

        <div className="flex items-center gap-3">
          {user && (
            <button
              onClick={() => navigate('/notifications')}
              className="relative p-2 rounded-full hover:bg-crop-50 text-crop-700"
              aria-label="Notifications"
            >
              <Bell size={22} />
              {unread > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center">
                  {unread}
                </span>
              )}
            </button>
          )}
          {user && (
            <button onClick={logout} className="p-2 rounded-full hover:bg-crop-50 text-crop-700" aria-label="Log out">
              <LogOut size={20} />
            </button>
          )}
        </div>
      </div>

      {user && (
        <nav className="md:hidden flex justify-around border-t border-crop-100 py-1">
          <NavLink to="/" end className={navLinkClass}><Home size={20} /> Feed</NavLink>
          <NavLink to="/chats" className={navLinkClass}><MessageCircle size={20} /> Chats</NavLink>
          <NavLink to="/following" className={navLinkClass}><Users size={20} /> Following</NavLink>
          <NavLink to="/profile" className={navLinkClass}><User size={20} /> Profile</NavLink>
        </nav>
      )}
    </header>
  );
};

export default Navbar;
