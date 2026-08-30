import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import Loader from '../components/Loader';
import { Link } from 'react-router-dom';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/notifications').then((res) => setNotifications(res.data.notifications)).finally(() => setLoading(false));
  }, []);

  const markAllRead = async () => {
    await api.put('/notifications/read-all');
    setNotifications(notifications.map((n) => ({ ...n, isRead: true })));
  };

  if (loading) return <Loader label="Loading notifications..." />;

  return (
    <div className="page-container max-w-2xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Notifications</h1>
        <button onClick={markAllRead} className="text-sm text-primary-700 font-medium">Mark all as read</button>
      </div>
      <div className="space-y-3">
        {notifications.map((n) => (
          <Link key={n._id} to={n.link || '#'} className={`card p-4 block ${!n.isRead ? 'border-l-4 border-primary-600' : ''}`}>
            <p className="font-medium text-gray-800">{n.title}</p>
            <p className="text-sm text-gray-500">{n.message}</p>
            <p className="text-xs text-gray-400 mt-1">{new Date(n.createdAt).toLocaleString()}</p>
          </Link>
        ))}
        {notifications.length === 0 && <p className="text-gray-400 text-center py-16">No notifications yet.</p>}
      </div>
    </div>
  );
};

export default Notifications;
