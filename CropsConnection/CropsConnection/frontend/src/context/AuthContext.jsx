import React, { createContext, useContext, useEffect, useState } from 'react';
import api from '../services/api';
import { socket } from '../services/socket';

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('user');
    if (stored) return JSON.parse(stored);
    // demo user for local preview
    return {
      id: 'demo-user',
      name: 'Demo Farmer',
      email: 'demo@farm.local',
      location: 'Demoville',
      profileImage: ''
    };
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      socket.connect();
      socket.emit('join', user.id);
    }
    return () => {
      socket.disconnect();
    };
  }, [user]);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const { data } = await api.post('/login', { email, password });
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      setUser(data.user);
      return { success: true };
    } catch (err) {
      return { success: false, message: err.response?.data?.message || 'Login failed' };
    } finally {
      setLoading(false);
    }
  };

  const register = async (name, email, password, location) => {
    setLoading(true);
    try {
      const { data } = await api.post('/register', { name, email, password, location });
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      setUser(data.user);
      return { success: true };
    } catch (err) {
      return { success: false, message: err.response?.data?.message || 'Registration failed' };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    socket.disconnect();
  };

  const updateUser = (updated) => {
    const merged = { ...user, ...updated };
    setUser(merged);
    localStorage.setItem('user', JSON.stringify(merged));
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, updateUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
