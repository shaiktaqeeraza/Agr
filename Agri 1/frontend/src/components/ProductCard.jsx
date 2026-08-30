import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const image = product.images?.[0] ? `${import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000'}${product.images[0]}` : null;

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!user) return navigate('/login');
    await addToCart(product._id, 1);
  };

  return (
    <Link to={`/store/${product._id}`} className="card block group">
      <div className="h-40 bg-earth-50 relative overflow-hidden">
        {image ? (
          <img src={image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition duration-300" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-5xl">🧪</div>
        )}
        <span className="badge absolute top-2 left-2 bg-earth-500 text-white capitalize">{product.category}</span>
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-gray-800 truncate">{product.name}</h3>
        {product.brand && <p className="text-xs text-gray-500">{product.brand}</p>}
        <div className="flex items-center justify-between mt-2">
          <p className="text-primary-700 font-bold">₹{product.price}<span className="text-xs text-gray-500 font-normal"> / {product.unit}</span></p>
          {product.stock > 0 ? (
            <span className="text-xs text-green-600">In stock</span>
          ) : (
            <span className="text-xs text-red-500">Out of stock</span>
          )}
        </div>
        <button
          onClick={handleAdd}
          disabled={product.stock <= 0}
          className="btn-primary w-full mt-3 !py-2 text-sm disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Add to Cart
        </button>
      </div>
    </Link>
  );
};

export default ProductCard;
