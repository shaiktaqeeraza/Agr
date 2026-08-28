import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../api/axios';
import { useAuth } from './AuthContext';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [cart, setCart] = useState({ items: [] });
  const [loading, setLoading] = useState(false);

  const refreshCart = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const res = await api.get('/cart');
      setCart(res.data.cart);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user) refreshCart();
    else setCart({ items: [] });
  }, [user, refreshCart]);

  const addToCart = async (productId, quantity = 1) => {
    const res = await api.post('/cart', { productId, quantity });
    setCart(res.data.cart);
  };

  const updateQuantity = async (productId, quantity) => {
    const res = await api.put(`/cart/${productId}`, { quantity });
    setCart(res.data.cart);
  };

  const removeFromCart = async (productId) => {
    const res = await api.delete(`/cart/${productId}`);
    setCart(res.data.cart);
  };

  const clearCart = async () => {
    const res = await api.delete('/cart');
    setCart(res.data.cart);
  };

  const cartCount = cart.items?.reduce((sum, i) => sum + i.quantity, 0) || 0;
  const cartTotal = cart.items?.reduce((sum, i) => sum + (i.product?.price || 0) * i.quantity, 0) || 0;

  return (
    <CartContext.Provider value={{ cart, loading, addToCart, updateQuantity, removeFromCart, clearCart, cartCount, cartTotal, refreshCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
