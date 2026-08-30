import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import Loader from '../components/Loader';

const statusColors = {
  'pending-verification': 'bg-yellow-100 text-yellow-700',
  active: 'bg-primary-100 text-primary-700',
  sold: 'bg-blue-100 text-blue-700',
  expired: 'bg-gray-100 text-gray-700',
  rejected: 'bg-red-100 text-red-700'
};

const MyCrops = () => {
  const [crops, setCrops] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCrops = () => {
    api.get('/crops/mine').then((res) => setCrops(res.data.crops)).finally(() => setLoading(false));
  };

  useEffect(() => { fetchCrops(); }, []);

  const handleDelete = async (id) => {
    if (!confirm('Delete this crop listing?')) return;
    await api.delete(`/crops/${id}`);
    fetchCrops();
  };

  if (loading) return <Loader label="Loading your crops..." />;

  return (
    <div className="page-container">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">My Crop Listings</h1>
        <Link to="/farmer/upload-crop" className="btn-primary">+ Upload Crop</Link>
      </div>

      <div className="space-y-3">
        {crops.map((c) => (
          <div key={c._id} className="card p-4 flex flex-wrap items-center gap-4">
            <div className="w-16 h-16 bg-primary-50 rounded-lg flex items-center justify-center text-2xl">🌱</div>
            <div className="flex-1 min-w-[150px]">
              <p className="font-semibold text-gray-800">{c.cropName}</p>
              <p className="text-sm text-gray-500">{c.quantity} {c.quantityUnit} @ ₹{c.expectedPrice}</p>
            </div>
            <span className={`badge ${statusColors[c.status]}`}>{c.status}</span>
            {c.adminNote && c.status === 'rejected' && <p className="text-xs text-red-500">Reason: {c.adminNote}</p>}
            <div className="flex gap-2">
              <Link to={`/crops/${c._id}`} className="btn-outline !py-1.5 !px-3 text-xs">View</Link>
              {c.status !== 'sold' && (
                <button onClick={() => handleDelete(c._id)} className="text-red-500 text-xs font-medium">Delete</button>
              )}
            </div>
          </div>
        ))}
        {crops.length === 0 && <p className="text-gray-400 text-center py-16">You haven't listed any crops yet.</p>}
      </div>
    </div>
  );
};

export default MyCrops;
