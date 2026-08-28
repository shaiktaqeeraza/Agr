import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import BrowseCrops from './pages/BrowseCrops';
import CropDetail from './pages/CropDetail';
import Store from './pages/Store';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Advisory from './pages/Advisory';
import Chat from './pages/Chat';
import Notifications from './pages/Notifications';
import Profile from './pages/Profile';

import FarmerDashboard from './pages/FarmerDashboard';
import UploadCrop from './pages/UploadCrop';
import MyCrops from './pages/MyCrops';
import Offers from './pages/Offers';

import BuyerDashboard from './pages/BuyerDashboard';
import Orders from './pages/Orders';

import AdminDashboard from './pages/AdminDashboard';

function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/crops" element={<BrowseCrops />} />
          <Route path="/crops/:id" element={<CropDetail />} />
          <Route path="/store" element={<Store />} />
          <Route path="/store/:id" element={<ProductDetail />} />
          <Route path="/advisory" element={<Advisory />} />

          <Route path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
          <Route path="/chat" element={<ProtectedRoute><Chat /></ProtectedRoute>} />
          <Route path="/chat/:userId" element={<ProtectedRoute><Chat /></ProtectedRoute>} />
          <Route path="/notifications" element={<ProtectedRoute><Notifications /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/orders" element={<ProtectedRoute><Orders /></ProtectedRoute>} />

          {/* Farmer module */}
          <Route path="/farmer" element={<ProtectedRoute roles={['farmer']}><FarmerDashboard /></ProtectedRoute>} />
          <Route path="/farmer/upload-crop" element={<ProtectedRoute roles={['farmer']}><UploadCrop /></ProtectedRoute>} />
          <Route path="/farmer/my-crops" element={<ProtectedRoute roles={['farmer']}><MyCrops /></ProtectedRoute>} />
          <Route path="/farmer/offers" element={<ProtectedRoute roles={['farmer']}><Offers /></ProtectedRoute>} />

          {/* Buyer module */}
          <Route path="/buyer" element={<ProtectedRoute roles={['buyer']}><BuyerDashboard /></ProtectedRoute>} />
          <Route path="/buyer/orders" element={<ProtectedRoute roles={['buyer']}><Offers sentView /></ProtectedRoute>} />

          {/* Admin module */}
          <Route path="/admin" element={<ProtectedRoute roles={['admin']}><AdminDashboard /></ProtectedRoute>} />

          <Route path="*" element={<div className="page-container text-center py-24 text-gray-500">404 — Page not found</div>} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
