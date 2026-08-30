import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import api from '../api/axios';

const BASE = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

const Cart = () => {
  const { cart, updateQuantity, removeFromCart, cartTotal, refreshCart } = useCart();
  const navigate = useNavigate();
  const [address, setAddress] = useState({ village: '', district: '', state: '', pincode: '', phone: '' });
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [placing, setPlacing] = useState(false);
  const [error, setError] = useState('');
  const [showCheckout, setShowCheckout] = useState(false);

  const placeOrder = async () => {
    setError('');
    setPlacing(true);
    try {
      await api.post('/orders', { shippingAddress: address, paymentMethod });
      await refreshCart();
      navigate('/orders');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to place order');
    } finally {
      setPlacing(false);
    }
  };

  if (!cart.items || cart.items.length === 0) {
    return <div className="page-container text-center py-24"><p className="text-gray-500 text-lg">Your cart is empty.</p></div>;
  }

  return (
    <div className="page-container grid md:grid-cols-3 gap-8">
      <div className="md:col-span-2 space-y-4">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Your Cart</h1>
        {cart.items.map((item) => (
          <div key={item.product._id} className="card p-4 flex items-center gap-4">
            <div className="w-16 h-16 bg-earth-50 rounded-lg flex items-center justify-center overflow-hidden">
              {item.product.images?.[0] ? (
                <img src={`${BASE}${item.product.images[0]}`} className="w-full h-full object-cover" />
              ) : <span className="text-2xl">🧪</span>}
            </div>
            <div className="flex-1">
              <p className="font-medium text-gray-800">{item.product.name}</p>
              <p className="text-primary-700 text-sm font-semibold">₹{item.product.price} / {item.product.unit}</p>
            </div>
            <div className="flex items-center border border-gray-200 rounded-lg">
              <button onClick={() => updateQuantity(item.product._id, Math.max(1, item.quantity - 1))} className="px-3 py-1">-</button>
              <span className="px-3">{item.quantity}</span>
              <button onClick={() => updateQuantity(item.product._id, item.quantity + 1)} className="px-3 py-1">+</button>
            </div>
            <button onClick={() => removeFromCart(item.product._id)} className="text-red-500 text-sm">Remove</button>
          </div>
        ))}
      </div>

      <div className="card p-5 h-fit sticky top-20">
        <h2 className="font-semibold text-gray-800 mb-3">Order Summary</h2>
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>Subtotal</span><span>₹{cartTotal}</span>
        </div>
        <div className="flex justify-between font-bold text-gray-800 border-t border-gray-100 pt-3">
          <span>Total</span><span>₹{cartTotal}</span>
        </div>

        {!showCheckout ? (
          <button onClick={() => setShowCheckout(true)} className="btn-primary w-full mt-5">Proceed to Checkout</button>
        ) : (
          <div className="mt-5 space-y-3">
            {error && <div className="bg-red-50 text-red-600 text-sm rounded-lg px-3 py-2">{error}</div>}
            <input placeholder="Village" className="input-field" value={address.village} onChange={(e) => setAddress({ ...address, village: e.target.value })} />
            <input placeholder="District" className="input-field" value={address.district} onChange={(e) => setAddress({ ...address, district: e.target.value })} />
            <input placeholder="State" className="input-field" value={address.state} onChange={(e) => setAddress({ ...address, state: e.target.value })} />
            <input placeholder="Pincode" className="input-field" value={address.pincode} onChange={(e) => setAddress({ ...address, pincode: e.target.value })} />
            <input placeholder="Phone" className="input-field" value={address.phone} onChange={(e) => setAddress({ ...address, phone: e.target.value })} />
            <select className="input-field" value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
              <option value="cod">Cash on Delivery</option>
              <option value="online">Online Payment</option>
            </select>
            <button onClick={placeOrder} disabled={placing} className="btn-primary w-full">{placing ? 'Placing order...' : 'Place Order'}</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
