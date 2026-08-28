import React, { createContext, useContext, useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import api from '../api/axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('sac_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [loading, setLoading] = useState(true);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('sac_token');
    if (token) {
      api
        .get('/auth/me')
        .then((res) => setUser(res.data.user))
        .catch(() => {
          localStorage.removeItem('sac_token');
          localStorage.removeItem('sac_user');
          setUser(null);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (user) {
      const s = io(import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000');
      s.emit('join', user.id || user._id);
      setSocket(s);
      return () => s.disconnect();
    }
  }, [user]);

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    localStorage.setItem('sac_token', res.data.token);
    localStorage.setItem('sac_user', JSON.stringify(res.data.user));
    setUser(res.data.user);
    return res.data.user;
  };

  const register = async (payload) => {
    const res = await api.post('/auth/register', payload);
    localStorage.setItem('sac_token', res.data.token);
    localStorage.setItem('sac_user', JSON.stringify(res.data.user));
    setUser(res.data.user);
    return res.data.user;
  };

  const logout = () => {
    localStorage.removeItem('sac_token');
    localStorage.removeItem('sac_user');
    setUser(null);
    if (socket) socket.disconnect();
  };

  return (
    <AuthContext.Provider value={{ user, setUser, loading, login, register, logout, socket }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
