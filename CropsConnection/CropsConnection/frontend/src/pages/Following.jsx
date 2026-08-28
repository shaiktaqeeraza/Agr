import React, { useEffect, useState } from 'react';
import api from '../services/api';
import FarmerCard from '../components/FarmerCard';

const Following = () => {
  const [following, setFollowing] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFollowing = async () => {
      try {
        const { data } = await api.get('/following');
        setFollowing(data);
      } catch (e) {
        // ignore
      } finally {
        setLoading(false);
      }
    };
    fetchFollowing();
  }, []);

  return (
    <div className="max-w-xl mx-auto px-4 py-6 space-y-3">
      <h1 className="font-display font-semibold text-xl text-crop-800 mb-2">Farmers you follow</h1>
      {loading && <p className="text-crop-400 text-center py-10">Loading...</p>}
      {!loading && following.length === 0 && (
        <p className="text-crop-400 text-center py-16">You're not following any farmers yet.</p>
      )}
      {following.map((farmer) => (
        <FarmerCard key={farmer._id} farmer={farmer} initiallyFollowing={true} />
      ))}
    </div>
  );
};

export default Following;
