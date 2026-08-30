import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { FiPlusCircle, FiList, FiInbox, FiClock } from 'react-icons/fi';

const FarmerDashboard = () => {
  const { user } = useAuth();
  const [crops, setCrops] = useState([]);
  const [offers, setOffers] = useState([]);

  useEffect(() => {
    api.get('/crops/mine').then((res) => setCrops(res.data.crops));
    api.get('/offers/received').then((res) => setOffers(res.data.offers));
  }, []);

  const activeCrops = crops.filter((c) => c.status === 'active').length;
  const pendingCrops = crops.filter((c) => c.status === 'pending-verification').length;
  const soldCrops = crops.filter((c) => c.status === 'sold').length;
  const pendingOffers = offers.filter((o) => o.status === 'pending').length;

  return (
    <div className="page-container">
      <h1 className="text-2xl font-bold text-gray-800">Welcome, {user?.name} 🌾</h1>
      <p className="text-gray-500 text-sm mb-6">Manage your crop listings, offers, and sales.</p>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        <div className="card p-5"><p className="text-3xl font-bold text-primary-700">{activeCrops}</p><p className="text-sm text-gray-500">Active Listings</p></div>
        <div className="card p-5"><p className="text-3xl font-bold text-yellow-600">{pendingCrops}</p><p className="text-sm text-gray-500">Pending Verification</p></div>
        <div className="card p-5"><p className="text-3xl font-bold text-primary-700">{soldCrops}</p><p className="text-sm text-gray-500">Crops Sold</p></div>
        <div className="card p-5"><p className="text-3xl font-bold text-orange-600">{pendingOffers}</p><p className="text-sm text-gray-500">Pending Offers</p></div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <Link to="/farmer/upload-crop" className="card p-6 text-center hover:-translate-y-1 transition">
          <FiPlusCircle className="text-3xl text-primary-600 mx-auto mb-2" />
          <p className="font-medium text-gray-800">Upload Crop</p>
        </Link>
        <Link to="/farmer/my-crops" className="card p-6 text-center hover:-translate-y-1 transition">
          <FiList className="text-3xl text-primary-600 mx-auto mb-2" />
          <p className="font-medium text-gray-800">My Crop Listings</p>
        </Link>
        <Link to="/farmer/offers" className="card p-6 text-center hover:-translate-y-1 transition">
          <FiInbox className="text-3xl text-primary-600 mx-auto mb-2" />
          <p className="font-medium text-gray-800">View Offers</p>
        </Link>
        <Link to="/orders" className="card p-6 text-center hover:-translate-y-1 transition">
          <FiClock className="text-3xl text-primary-600 mx-auto mb-2" />
          <p className="font-medium text-gray-800">Selling History</p>
        </Link>
      </div>
    </div>
  );
};

export default FarmerDashboard;
