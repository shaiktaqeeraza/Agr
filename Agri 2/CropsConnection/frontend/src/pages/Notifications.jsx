import React, { useEffect, useState } from 'react';
import { UserPlus, MessageCircle, Bell } from 'lucide-react';
import api from '../services/api';

const iconFor = (type) => {
  if (type === 'follow') return <UserPlus size={18} className="text-crop-600" />;
  if (type === 'message') return <MessageCircle size={18} className="text-crop-600" />;
  return <Bell size={18} className="text-crop-600" />;
};

const timeAgo = (dateStr) => {
  const diffMs = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
};

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotifs = async () => {
      try {
        const { data } = await api.get('/notifications');
        setNotifications(data);
      } catch (e) {
        // ignore
      } finally {
        setLoading(false);
      }
    };
    fetchNotifs();
  }, []);

  return (
    <div className="max-w-xl mx-auto px-4 py-6">
      <h1 className="font-display font-semibold text-xl text-crop-800 mb-4">Notifications</h1>
      {loading && <p className="text-crop-400 text-center py-10">Loading...</p>}
      {!loading && notifications.length === 0 && (
        <p className="text-crop-400 text-center py-16">You're all caught up.</p>
      )}
      <div className="space-y-2">
        {notifications.map((n) => (
          <div key={n._id} className="card p-3.5 flex items-center gap-3">
            <div className="bg-crop-50 p-2 rounded-full">{iconFor(n.type)}</div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-crop-900">
                <span className="font-medium">{n.fromUserId?.name || 'Someone'}</span> {n.message}
              </p>
              <p className="text-xs text-crop-400">{timeAgo(n.createdAt)}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Notifications;
