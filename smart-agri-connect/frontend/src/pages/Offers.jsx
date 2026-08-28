import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import Loader from '../components/Loader';
import { useAuth } from '../context/AuthContext';

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-700',
  accepted: 'bg-primary-100 text-primary-700',
  rejected: 'bg-red-100 text-red-700',
  withdrawn: 'bg-gray-100 text-gray-700'
};

const Offers = ({ sentView = false }) => {
  const { user } = useAuth();
  const isBuyerView = sentView || user?.role === 'buyer';
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOffers = () => {
    const endpoint = isBuyerView ? '/offers/sent' : '/offers/received';
    api.get(endpoint).then((res) => setOffers(res.data.offers)).finally(() => setLoading(false));
  };

  useEffect(() => { fetchOffers(); }, []); // eslint-disable-line

  const respond = async (id, action) => {
    await api.put(`/offers/${id}/respond`, { action });
    fetchOffers();
  };

  if (loading) return <Loader label="Loading offers..." />;

  return (
    <div className="page-container">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">{isBuyerView ? 'My Sent Offers' : 'Offers Received'}</h1>

      <div className="space-y-3">
        {offers.map((o) => (
          <div key={o._id} className="card p-4 flex flex-wrap items-center gap-4">
            <div className="w-14 h-14 bg-primary-50 rounded-lg flex items-center justify-center text-xl">🌾</div>
            <div className="flex-1 min-w-[180px]">
              <p className="font-semibold text-gray-800">{o.crop?.cropName}</p>
              <p className="text-sm text-gray-500">
                {isBuyerView ? `To: ${o.farmer?.name}` : `From: ${o.buyer?.name}${o.buyer?.companyName ? ` (${o.buyer.companyName})` : ''}`}
              </p>
              {o.message && <p className="text-xs text-gray-400 italic mt-1">"{o.message}"</p>}
            </div>
            <div className="text-right">
              <p className="font-bold text-primary-700">₹{o.offeredPrice}/unit</p>
              <p className="text-xs text-gray-500">{o.offeredQuantity} units</p>
            </div>
            <span className={`badge ${statusColors[o.status]}`}>{o.status}</span>
            {!isBuyerView && o.status === 'pending' && (
              <div className="flex gap-2">
                <button onClick={() => respond(o._id, 'accept')} className="btn-primary !py-1.5 !px-3 text-xs">Accept</button>
                <button onClick={() => respond(o._id, 'reject')} className="border border-red-300 text-red-600 !py-1.5 !px-3 rounded-xl text-xs">Reject</button>
              </div>
            )}
          </div>
        ))}
        {offers.length === 0 && <p className="text-gray-400 text-center py-16">No offers found.</p>}
      </div>
    </div>
  );
};

export default Offers;
