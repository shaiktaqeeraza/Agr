import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => (
  <footer className="bg-primary-900 text-primary-50 mt-16">
    <div className="page-container grid grid-cols-1 md:grid-cols-4 gap-8 py-10 text-sm">
      <div>
        <h3 className="text-lg font-bold mb-2 flex items-center gap-2">🌾 Smart Agri Connect</h3>
        <p className="text-primary-200">Connecting farmers directly with buyers, traders, and companies across India.</p>
      </div>
      <div>
        <h4 className="font-semibold mb-2">Farmers</h4>
        <ul className="space-y-1 text-primary-200">
          <li><Link to="/register" className="hover:text-white">Sell Your Crop</Link></li>
          <li><Link to="/advisory" className="hover:text-white">Crop Advisory</Link></li>
          <li><Link to="/farmer" className="hover:text-white">Farmer Dashboard</Link></li>
        </ul>
      </div>
      <div>
        <h4 className="font-semibold mb-2">Buyers</h4>
        <ul className="space-y-1 text-primary-200">
          <li><Link to="/crops" className="hover:text-white">Browse Crops</Link></li>
          <li><Link to="/store" className="hover:text-white">Agri Store</Link></li>
          <li><Link to="/buyer" className="hover:text-white">Buyer Dashboard</Link></li>
        </ul>
      </div>
      <div>
        <h4 className="font-semibold mb-2">Company</h4>
        <ul className="space-y-1 text-primary-200">
          <li>About Us</li>
          <li>Contact</li>
          <li>Privacy Policy</li>
        </ul>
      </div>
    </div>
    <div className="text-center text-xs text-primary-300 border-t border-primary-800 py-4">
      © {new Date().getFullYear()} Smart Agri Connect. All rights reserved.
    </div>
  </footer>
);

export default Footer;
