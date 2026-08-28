import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const CreatePost = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ cropName: '', pricePerKg: '', quantity: '', location: '', negotiable: true });
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const formData = new FormData();
      Object.entries(form).forEach(([k, v]) => formData.append(k, v));
      if (image) formData.append('cropImage', image);

      await api.post('/posts', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create post');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto px-4 py-6">
      <div className="card p-6">
        <h1 className="font-display font-semibold text-xl text-crop-800 mb-4">Post your crop</h1>
        {error && <p className="bg-red-50 text-red-600 text-sm rounded-lg px-3 py-2 mb-4">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-crop-600 mb-1">Crop photo</label>
            {preview && <img src={preview} alt="preview" className="w-full h-48 object-cover rounded-xl mb-2" />}
            <input type="file" accept="image/*" onChange={handleImage} className="text-sm" />
          </div>

          <input
            required
            placeholder="Crop name (e.g. Tomatoes)"
            className="input-field"
            value={form.cropName}
            onChange={(e) => setForm({ ...form, cropName: e.target.value })}
          />

          <div className="grid grid-cols-2 gap-3">
            <input
              required
              type="number"
              min="0"
              step="0.01"
              placeholder="Price per kg (₹)"
              className="input-field"
              value={form.pricePerKg}
              onChange={(e) => setForm({ ...form, pricePerKg: e.target.value })}
            />
            <input
              required
              type="number"
              min="0"
              placeholder="Quantity (kg)"
              className="input-field"
              value={form.quantity}
              onChange={(e) => setForm({ ...form, quantity: e.target.value })}
            />
          </div>

          <input
            placeholder="Location"
            className="input-field"
            value={form.location}
            onChange={(e) => setForm({ ...form, location: e.target.value })}
          />

          <label className="flex items-center gap-2 text-sm text-crop-700">
            <input
              type="checkbox"
              checked={form.negotiable}
              onChange={(e) => setForm({ ...form, negotiable: e.target.checked })}
            />
            Price is negotiable
          </label>

          <button type="submit" disabled={submitting} className="btn-primary w-full">
            {submitting ? 'Posting...' : 'Post Crop'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreatePost;
