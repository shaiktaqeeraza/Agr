import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import Loader from '../components/Loader';

const statusColors = {
  placed: 'bg-yellow-100 text-yellow-700',
  confirmed: 'bg-blue-100 text-blue-700',
  shipped: 'bg-purple-100 text-purple-700',
  delivered: 'bg-primary-100 text-primary-700',
  cancelled: 'bg-red-100 text-red-700'
};

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = () => {
    api.get('/orders/mine').then((res) => setOrders(res.data.orders)).finally(() => setLoading(false));
  };

  useEffect(() => { fetchOrders(); }, []);

  const cancelOrder = async (id) => {
    if (!confirm('Cancel this order?')) return;
    await api.put(`/orders/${id}/cancel`);
    fetchOrders();
  };

  if (loading) return <Loader label="Loading your orders..." />;

  return (
    <div className="page-container">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">My Store Orders</h1>

      <div className="space-y-4">
        {orders.map((o) => (
          <div key={o._id} className="card p-5">
            <div className="flex flex-wrap justify-between items-center gap-2">
              <div>
                <p className="font-semibold text-gray-800">Order #{o._id.slice(-8).toUpperCase()}</p>
                <p className="text-xs text-gray-500">{new Date(o.createdAt).toLocaleString()}</p>
              </div>
              <span className={`badge ${statusColors[o.orderStatus]}`}>{o.orderStatus}</span>
            </div>

            <div className="mt-3 divide-y divide-gray-100">
              {o.items.map((item, i) => (
                <div key={i} className="flex justify-between py-2 text-sm">
                  <span>{item.name} × {item.quantity}</span>
                  <span className="font-medium">₹{item.price * item.quantity}</span>
                </div>
              ))}
            </div>

            <div className="flex justify-between items-center mt-3 pt-3 border-t border-gray-100">
              <p className="font-bold text-gray-800">Total: ₹{o.totalAmount}</p>
              <p className="text-xs text-gray-500 capitalize">{o.paymentMethod} · {o.paymentStatus}</p>
            </div>

            {!['shipped', 'delivered', 'cancelled'].includes(o.orderStatus) && (
              <button onClick={() => cancelOrder(o._id)} className="text-red-500 text-xs font-medium mt-2">Cancel Order</button>
            )}
          </div>
        ))}
        {orders.length === 0 && <p className="text-gray-400 text-center py-16">You haven't placed any orders yet.</p>}
      </div>
    </div>
  );
};

export default Orders;
