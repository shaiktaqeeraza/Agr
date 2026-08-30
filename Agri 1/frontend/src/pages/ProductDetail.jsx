import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import Loader from '../components/Loader';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const BASE = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

const ProductDetail = () => {
  const { id } = useParams();
  const { addToCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    api.get(`/products/${id}`).then((res) => setProduct(res.data.product)).finally(() => setLoading(false));
  }, [id]);

  const handleAdd = async () => {
    if (!user) return navigate('/login');
    await addToCart(id, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  if (loading) return <Loader label="Loading product..." />;
  if (!product) return <p className="text-center py-16 text-gray-500">Product not found.</p>;

  return (
    <div className="page-container grid md:grid-cols-2 gap-10">
      <div className="rounded-2xl overflow-hidden bg-earth-50 h-80 flex items-center justify-center">
        {product.images?.[0] ? (
          <img src={`${BASE}${product.images[0]}`} alt={product.name} className="w-full h-full object-cover" />
        ) : <span className="text-7xl">🧪</span>}
      </div>

      <div>
        <span className="badge bg-earth-100 text-earth-700 capitalize">{product.category}</span>
        <h1 className="text-3xl font-bold text-gray-800 mt-2">{product.name}</h1>
        {product.brand && <p className="text-gray-500 text-sm">by {product.brand}</p>}
        <p className="text-2xl font-bold text-primary-700 mt-3">₹{product.price} <span className="text-sm text-gray-500 font-normal">/ {product.unit}</span></p>

        <p className="text-gray-600 mt-4 text-sm">{product.description}</p>

        <p className={`text-sm mt-2 ${product.stock > 0 ? 'text-green-600' : 'text-red-500'}`}>
          {product.stock > 0 ? `${product.stock} units in stock` : 'Out of stock'}
        </p>

        <div className="flex items-center gap-4 mt-6">
          <div className="flex items-center border border-gray-200 rounded-xl">
            <button onClick={() => setQty(Math.max(1, qty - 1))} className="px-4 py-2 text-lg">-</button>
            <span className="px-4">{qty}</span>
            <button onClick={() => setQty(qty + 1)} className="px-4 py-2 text-lg">+</button>
          </div>
          <button onClick={handleAdd} disabled={product.stock <= 0} className="btn-primary flex-1 disabled:opacity-40">
            {added ? 'Added!' : 'Add to Cart'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
