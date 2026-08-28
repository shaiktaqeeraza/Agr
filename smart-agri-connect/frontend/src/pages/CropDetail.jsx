import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import Loader from '../components/Loader';
import { useAuth } from '../context/AuthContext';
import { FiMapPin, FiCalendar, FiPhone, FiMessageCircle } from 'react-icons/fi';

const BASE = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

const CropDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [crop, setCrop] = useState(null);
  const [loading, setLoading] = useState(true);
  const [offerForm, setOfferForm] = useState({ offeredPrice: '', offeredQuantity: '', message: '' });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    api.get(`/crops/${id}`).then((res) => setCrop(res.data.crop)).finally(() => setLoading(false));
  }, [id]);

  const sendOffer = async (e) => {
    e.preventDefault();
    setError(''); setSuccess('');
    if (!user) return navigate('/login');
    setSubmitting(true);
    try {
      await api.post('/offers', { cropId: id, ...offerForm });
      setSuccess('Offer sent to the farmer successfully!');
      setOfferForm({ offeredPrice: '', offeredQuantity: '', message: '' });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send offer');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Loader label="Loading crop details..." />;
  if (!crop) return <p className="text-center py-16 text-gray-500">Crop not found.</p>;

  return (
    <div className="page-container grid md:grid-cols-2 gap-10">
      <div>
        <div className="rounded-2xl overflow-hidden bg-primary-100 h-80 flex items-center justify-center">
          {crop.photos?.[0] ? (
            <img src={`${BASE}${crop.photos[0]}`} alt={crop.cropName} className="w-full h-full object-cover" />
          ) : <span className="text-7xl">🌱</span>}
        </div>
        {crop.photos?.length > 1 && (
          <div className="grid grid-cols-4 gap-2 mt-2">
            {crop.photos.slice(1).map((p, i) => (
              <img key={i} src={`${BASE}${p}`} className="h-20 w-full object-cover rounded-lg" />
            ))}
          </div>
        )}
      </div>

      <div>
        <span className="badge bg-primary-100 text-primary-700 capitalize">{crop.category}</span>
        <h1 className="text-3xl font-bold text-gray-800 mt-2">{crop.cropName}</h1>
        <p className="text-2xl font-bold text-primary-700 mt-2">₹{crop.expectedPrice} <span className="text-sm text-gray-500 font-normal">/ {crop.quantityUnit}</span></p>

        <div className="grid grid-cols-2 gap-4 mt-5 text-sm">
          <div className="card p-3"><p className="text-gray-500">Quantity Available</p><p className="font-semibold">{crop.quantity} {crop.quantityUnit}</p></div>
          <div className="card p-3"><p className="text-gray-500">Quality</p><p className="font-semibold">{crop.quality}</p></div>
          <div className="card p-3"><p className="text-gray-500 flex items-center gap-1"><FiCalendar /> Harvest Date</p><p className="font-semibold">{new Date(crop.harvestDate).toLocaleDateString()}</p></div>
          <div className="card p-3"><p className="text-gray-500 flex items-center gap-1"><FiMapPin /> Location</p><p className="font-semibold">{crop.location?.district}, {crop.location?.state}</p></div>
        </div>

        {crop.description && <p className="text-gray-600 mt-4 text-sm">{crop.description}</p>}

        <div className="card p-4 mt-6 flex items-center justify-between">
          <div>
            <p className="font-semibold text-gray-800">{crop.farmer?.name}</p>
            <p className="text-xs text-gray-500">{crop.farmer?.rating > 0 ? `★ ${crop.farmer.rating} rating` : 'New farmer'}</p>
          </div>
          {user && (
            <div className="flex gap-2">
              <a href={`tel:${crop.farmer?.phone}`} className="btn-outline !p-2.5"><FiPhone /></a>
              <Link to={`/chat/${crop.farmer?._id}`} className="btn-outline !p-2.5"><FiMessageCircle /></Link>
            </div>
          )}
        </div>

        {user?.role === 'buyer' && crop.status === 'active' && (
          <form onSubmit={sendOffer} className="card p-5 mt-6 space-y-3">
            <h3 className="font-semibold text-gray-800">Send a Purchase Offer</h3>
            {error && <div className="bg-red-50 text-red-600 text-sm rounded-lg px-3 py-2">{error}</div>}
            {success && <div className="bg-primary-50 text-primary-700 text-sm rounded-lg px-3 py-2">{success}</div>}
            <div className="grid grid-cols-2 gap-3">
              <input required type="number" placeholder="Your offered price / unit" className="input-field" value={offerForm.offeredPrice} onChange={(e) => setOfferForm({ ...offerForm, offeredPrice: e.target.value })} />
              <input required type="number" placeholder="Quantity you want" className="input-field" value={offerForm.offeredQuantity} onChange={(e) => setOfferForm({ ...offerForm, offeredQuantity: e.target.value })} />
            </div>
            <textarea placeholder="Message to farmer (optional)" className="input-field" rows={2} value={offerForm.message} onChange={(e) => setOfferForm({ ...offerForm, message: e.target.value })} />
            <button disabled={submitting} className="btn-primary w-full">{submitting ? 'Sending...' : 'Send Offer'}</button>
          </form>
        )}
      </div>
    </div>
  );
};

export default CropDetail;
