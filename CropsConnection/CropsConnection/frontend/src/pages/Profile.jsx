import React, { useEffect, useState } from 'react';
import { MapPin, Pencil } from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: '', location: '', bio: '' });
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState('');
  const [saving, setSaving] = useState(false);

  const fetchProfile = async () => {
    try {
      const { data } = await api.get('/profile');
      setProfile(data);
      setForm({ name: data.user.name, location: data.user.location, bio: data.user.bio || '' });
    } catch (e) {
      // ignore
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const formData = new FormData();
      formData.append('name', form.name);
      formData.append('location', form.location);
      formData.append('bio', form.bio);
      if (image) formData.append('profileImage', image);

      const { data } = await api.put('/profile', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      updateUser({ name: data.name, location: data.location, profileImage: data.profileImage });
      setEditing(false);
      fetchProfile();
    } catch (e) {
      // ignore
    } finally {
      setSaving(false);
    }
  };

  if (!profile) return <p className="text-center text-crop-400 py-16">Loading profile...</p>;

  const avatar = preview || profile.user.profileImage ||
    `https://ui-avatars.com/api/?background=3a9457&color=fff&size=128&name=${encodeURIComponent(profile.user.name)}`;

  return (
    <div className="max-w-xl mx-auto px-4 py-6 space-y-6">
      <div className="card p-6">
        {!editing ? (
          <div className="flex items-center gap-4">
            <img src={avatar} alt={profile.user.name} className="w-20 h-20 rounded-full object-cover border border-crop-100" />
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h1 className="font-display font-semibold text-xl text-crop-900">{profile.user.name}</h1>
                <button onClick={() => setEditing(true)} className="text-crop-500 hover:text-crop-700">
                  <Pencil size={16} />
                </button>
              </div>
              <p className="text-crop-500 text-sm flex items-center gap-1 mt-0.5">
                <MapPin size={14} /> {profile.user.location || 'No location set'}
              </p>
              <div className="flex gap-5 mt-3 text-sm">
                <p><span className="font-semibold text-crop-900">{profile.postsCount}</span> <span className="text-crop-500">Posts</span></p>
                <p><span className="font-semibold text-crop-900">{profile.followingCount}</span> <span className="text-crop-500">Following</span></p>
                <p><span className="font-semibold text-crop-900">{profile.followersCount}</span> <span className="text-crop-500">Followers</span></p>
              </div>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSave} className="space-y-3">
            <div className="flex items-center gap-4">
              <img src={avatar} alt="preview" className="w-16 h-16 rounded-full object-cover" />
              <input type="file" accept="image/*" onChange={handleImage} className="text-sm" />
            </div>
            <input
              className="input-field"
              placeholder="Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
            <input
              className="input-field"
              placeholder="Location"
              value={form.location}
              onChange={(e) => setForm({ ...form, location: e.target.value })}
            />
            <textarea
              className="input-field"
              placeholder="Short bio"
              rows={2}
              value={form.bio}
              onChange={(e) => setForm({ ...form, bio: e.target.value })}
            />
            <div className="flex gap-2">
              <button type="submit" disabled={saving} className="btn-primary">{saving ? 'Saving...' : 'Save changes'}</button>
              <button type="button" onClick={() => setEditing(false)} className="btn-outline">Cancel</button>
            </div>
          </form>
        )}
      </div>

      <div>
        <h2 className="font-display font-semibold text-lg text-crop-800 mb-3">Your posts</h2>
        {profile.posts.length === 0 && <p className="text-crop-400 text-sm">You haven't posted any crops yet.</p>}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {profile.posts.map((post) => (
            <div key={post._id} className="relative rounded-xl overflow-hidden aspect-square bg-crop-100">
              {post.cropImage ? (
                <img src={post.cropImage} alt={post.cropName} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-crop-400 text-xs">{post.cropName}</div>
              )}
              {post.sold && (
                <span className="absolute top-1.5 right-1.5 bg-red-500 text-white text-[10px] px-2 py-0.5 rounded-full">Sold</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Profile;
