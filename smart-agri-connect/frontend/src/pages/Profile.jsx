import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

const Profile = () => {
  const { user, setUser } = useAuth();
  const [form, setForm] = useState({ name: '', location: {}, farmDetails: {}, companyName: '' });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    api.get('/users/profile').then((res) => setForm(res.data.user));
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    const res = await api.put('/users/profile', form);
    setUser(res.data.user);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="page-container max-w-2xl">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">My Profile</h1>
      <form onSubmit={handleSave} className="card p-6 space-y-4">
        {saved && <div className="bg-primary-50 text-primary-700 text-sm rounded-lg px-3 py-2">Profile updated!</div>}
        <div>
          <label className="text-sm font-medium text-gray-700">Name</label>
          <input className="input-field mt-1" value={form.name || ''} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-700">District</label>
            <input className="input-field mt-1" value={form.location?.district || ''} onChange={(e) => setForm({ ...form, location: { ...form.location, district: e.target.value } })} />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">State</label>
            <input className="input-field mt-1" value={form.location?.state || ''} onChange={(e) => setForm({ ...form, location: { ...form.location, state: e.target.value } })} />
          </div>
        </div>
        {user?.role === 'farmer' && (
          <div>
            <label className="text-sm font-medium text-gray-700">Farm Size (acres)</label>
            <input type="number" className="input-field mt-1" value={form.farmDetails?.farmSize || ''} onChange={(e) => setForm({ ...form, farmDetails: { ...form.farmDetails, farmSize: e.target.value } })} />
          </div>
        )}
        {user?.role === 'buyer' && (
          <div>
            <label className="text-sm font-medium text-gray-700">Company Name</label>
            <input className="input-field mt-1" value={form.companyName || ''} onChange={(e) => setForm({ ...form, companyName: e.target.value })} />
          </div>
        )}
        <button className="btn-primary">Save Changes</button>
      </form>
    </div>
  );
};

export default Profile;
