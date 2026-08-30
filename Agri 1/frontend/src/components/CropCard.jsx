import React from 'react';
import { Link } from 'react-router-dom';
import { FiMapPin, FiCalendar } from 'react-icons/fi';

const categoryColors = {
  grain: 'bg-yellow-100 text-yellow-700',
  vegetable: 'bg-green-100 text-green-700',
  fruit: 'bg-orange-100 text-orange-700',
  pulses: 'bg-amber-100 text-amber-700',
  oilseed: 'bg-lime-100 text-lime-700',
  spice: 'bg-red-100 text-red-700',
  'cash-crop': 'bg-purple-100 text-purple-700',
  other: 'bg-gray-100 text-gray-700'
};

const CropCard = ({ crop }) => {
  const photo = crop.photos?.[0] ? `${import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000'}${crop.photos[0]}` : null;

  return (
    <Link to={`/crops/${crop._id}`} className="card block group">
      <div className="h-44 bg-primary-100 relative overflow-hidden">
        {photo ? (
          <img src={photo} alt={crop.cropName} className="w-full h-full object-cover group-hover:scale-105 transition duration-300" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-5xl">🌱</div>
        )}
        <span className={`badge absolute top-2 left-2 ${categoryColors[crop.category] || categoryColors.other}`}>
          {crop.category}
        </span>
        {crop.organicCertified && (
          <span className="badge absolute top-2 right-2 bg-primary-600 text-white">Organic</span>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-gray-800 truncate">{crop.cropName}</h3>
        <p className="text-primary-700 font-bold mt-1">₹{crop.expectedPrice} <span className="text-xs text-gray-500 font-normal">/ {crop.quantityUnit || 'quintal'}</span></p>
        <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
          <span className="flex items-center gap-1"><FiMapPin /> {crop.location?.district || 'N/A'}</span>
          <span>{crop.quantity} {crop.quantityUnit || 'qtl'} avail.</span>
        </div>
        {crop.harvestDate && (
          <div className="flex items-center gap-1 mt-1 text-xs text-gray-400">
            <FiCalendar /> Harvest: {new Date(crop.harvestDate).toLocaleDateString()}
          </div>
        )}
        {crop.farmer?.name && (
          <div className="mt-3 pt-3 border-t border-gray-100 text-xs text-gray-500">
            By <span className="font-medium text-gray-700">{crop.farmer.name}</span>
            {crop.farmer.rating > 0 && <span className="ml-2 text-yellow-500">★ {crop.farmer.rating}</span>}
          </div>
        )}
      </div>
    </Link>
  );
};

export default CropCard;
