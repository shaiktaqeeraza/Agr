import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

const UploadCrop = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    cropName: '', category: 'grain', quantity: '', expectedPrice: '',
    harvestDate: '', description: '', quality: 'A-grade', organicCertified: false
  });
  const [photos, setPhotos] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const data = new FormData();
      Object.entries(form).forEach(([k, v]) => data.append(k, v));
      photos.forEach((p) => data.append('photos', p));

      await api.post('/crops', data, { headers: { 'Content-Type': 'multipart/form-data' } });
      navigate('/farmer/my-crops');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to upload crop listing');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="page-container max-w-2xl">
      <h1 className="text-2xl font-bold text-gray-800 mb-1">Upload a Crop for Sale</h1>
      <p className="text-gray-500 text-sm mb-6">Your listing will be reviewed by our admin team before it goes live.</p>

      {error && <div className="bg-red-50 text-red-600 text-sm rounded-lg px-4 py-2 mb-4">{error}</div>}

      <form onSubmit={handleSubmit} className="card p-6 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <input required placeholder="Crop Name (e.g. Wheat)" className="input-field" value={form.cropName} onChange={(e) => setForm({ ...form, cropName: e.target.value })} />
          <select className="input-field" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
            {['grain', 'vegetable', 'fruit', 'pulses', 'oilseed', 'spice', 'cash-crop', 'other'].map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <input required type="number" placeholder="Quantity (quintals)" className="input-field" value={form.quantity} onChange={(e) => setForm({ ...form, quantity: e.target.value })} />
          <input required type="number" placeholder="Expected Price (per quintal)" className="input-field" value={form.expectedPrice} onChange={(e) => setForm({ ...form, expectedPrice: e.target.value })} />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-gray-500">Harvest Date</label>
            <input required type="date" className="input-field mt-1" value={form.harvestDate} onChange={(e) => setForm({ ...form, harvestDate: e.target.value })} />
          </div>
          <select className="input-field self-end" value={form.quality} onChange={(e) => setForm({ ...form, quality: e.target.value })}>
            <option value="A-grade">A-grade</option>
            <option value="B-grade">B-grade</option>
            <option value="C-grade">C-grade</option>
          </select>
        </div>

        <textarea placeholder="Description (optional)" rows={3} className="input-field" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />

        <label className="flex items-center gap-2 text-sm text-gray-600">
          <input type="checkbox" checked={form.organicCertified} onChange={(e) => setForm({ ...form, organicCertified: e.target.checked })} />
          This crop is organically certified
        </label>

        <div>
          <label className="text-xs text-gray-500">Crop Photos (up to 5)</label>
          <input type="file" multiple accept="image/*" className="input-field mt-1" onChange={(e) => setPhotos(Array.from(e.target.files))} />
        </div>

        <button disabled={submitting} className="btn-primary w-full">{submitting ? 'Uploading...' : 'Submit Crop Listing'}</button>
      </form>
    </div>
  );
};

export default UploadCrop;
