import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin } from 'lucide-react';
import api from '../services/api';

const FarmerCard = ({ farmer, initiallyFollowing = true }) => {
  const [following, setFollowing] = useState(initiallyFollowing);
  const navigate = useNavigate();

  const toggleFollow = async () => {
    try {
      const { data } = await api.post(`/follow/${farmer._id}`);
      setFollowing(data.following);
    } catch (e) {
      // ignore
    }
  };

  const imgSrc = farmer.profileImage
    ? farmer.profileImage
    : `https://ui-avatars.com/api/?background=3a9457&color=fff&name=${encodeURIComponent(farmer.name)}`;

  return (
    <div className="card p-4 flex items-center justify-between gap-3">
      <div className="flex items-center gap-3 min-w-0">
        <img src={imgSrc} alt={farmer.name} className="w-12 h-12 rounded-full object-cover border border-crop-100" />
        <div className="min-w-0">
          <p className="font-medium text-crop-900 truncate">{farmer.name}</p>
          <p className="text-sm text-crop-500 flex items-center gap-1 truncate">
            <MapPin size={13} /> {farmer.location || 'Unknown location'}
          </p>
        </div>
      </div>
      <button
        onClick={toggleFollow}
        className={following ? 'btn-outline whitespace-nowrap' : 'btn-primary whitespace-nowrap'}
      >
        {following ? 'Following' : 'Follow'}
      </button>
    </div>
  );
};

export default FarmerCard;
