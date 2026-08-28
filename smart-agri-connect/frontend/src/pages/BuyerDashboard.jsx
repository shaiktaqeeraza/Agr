import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { FiSearch, FiShoppingBag, FiInbox, FiPackage } from 'react-icons/fi';

const BuyerDashboard = () => {
  const { user } = useAuth();
  const [offers, setOffers] = useState([]);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    api.get('/offers/sent').then((res) => setOffers(res.data.offers));
    api.get('/orders/mine').then((res) => setOrders(res.data.orders));
  }, []);

  const pendingOffers = offers.filter((o) => o.status === 'pending').length;
  const acceptedOffers = offers.filter((o) => o.status === 'accepted').length;
  const activeOrders = orders.filter((o) => !['delivered', 'cancelled'].includes(o.orderStatus)).length;

  return (
    <div className="page-container">
      <h1 className="text-2xl font-bold text-gray-800">Welcome, {user?.name} 🧑‍💼</h1>
      <p className="text-gray-500 text-sm mb-6">Browse crops, track your offers, and manage your store orders.</p>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        <div className="card p-5"><p className="text-3xl font-bold text-primary-700">{offers.length}</p><p className="text-sm text-gray-500">Offers Sent</p></div>
        <div className="card p-5"><p className="text-3xl font-bold text-yellow-600">{pendingOffers}</p><p className="text-sm text-gray-500">Pending Offers</p></div>
        <div className="card p-5"><p className="text-3xl font-bold text-primary-700">{acceptedOffers}</p><p className="text-sm text-gray-500">Deals Closed</p></div>
        <div className="card p-5"><p className="text-3xl font-bold text-orange-600">{activeOrders}</p><p className="text-sm text-gray-500">Active Store Orders</p></div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <Link to="/crops" className="card p-6 text-center hover:-translate-y-1 transition">
          <FiSearch className="text-3xl text-primary-600 mx-auto mb-2" />
          <p className="font-medium text-gray-800">Browse Crops</p>
        </Link>
        <Link to="/store" className="card p-6 text-center hover:-translate-y-1 transition">
          <FiShoppingBag className="text-3xl text-primary-600 mx-auto mb-2" />
          <p className="font-medium text-gray-800">Agri Store</p>
        </Link>
        <Link to="/buyer/orders" className="card p-6 text-center hover:-translate-y-1 transition">
          <FiInbox className="text-3xl text-primary-600 mx-auto mb-2" />
          <p className="font-medium text-gray-800">My Crop Offers</p>
        </Link>
        <Link to="/orders" className="card p-6 text-center hover:-translate-y-1 transition">
          <FiPackage className="text-3xl text-primary-600 mx-auto mb-2" />
          <p className="font-medium text-gray-800">My Store Orders</p>
        </Link>
      </div>
    </div>
  );
};

export default BuyerDashboard;
