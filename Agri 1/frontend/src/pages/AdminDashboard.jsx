import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import Loader from '../components/Loader';

const tabs = ['Overview', 'Farmers', 'Buyers', 'Verify Crops', 'Products', 'Orders'];

const StatCard = ({ label, value, color = 'text-primary-700' }) => (
  <div className="card p-5"><p className={`text-3xl font-bold ${color}`}>{value}</p><p className="text-sm text-gray-500">{label}</p></div>
);

const AdminDashboard = () => {
  const [tab, setTab] = useState(0);
  const [stats, setStats] = useState(null);
  const [farmers, setFarmers] = useState([]);
  const [buyers, setBuyers] = useState([]);
  const [pendingCrops, setPendingCrops] = useState([]);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [productForm, setProductForm] = useState({ name: '', category: 'seed', brand: '', description: '', price: '', unit: '', stock: '' });
  const [showAddProduct, setShowAddProduct] = useState(false);

  const loadAll = async () => {
    setLoading(true);
    const [s, f, b, c, p, o] = await Promise.all([
      api.get('/admin/dashboard'),
      api.get('/admin/users', { params: { role: 'farmer' } }),
      api.get('/admin/users', { params: { role: 'buyer' } }),
      api.get('/admin/crops', { params: { status: 'pending-verification' } }),
      api.get('/products', { params: { limit: 50 } }),
      api.get('/admin/orders')
    ]);
    setStats(s.data.stats);
    setFarmers(f.data.users);
    setBuyers(b.data.users);
    setPendingCrops(c.data.crops);
    setProducts(p.data.products);
    setOrders(o.data.orders);
    setLoading(false);
  };

  useEffect(() => { loadAll(); }, []);

  const toggleBlock = async (user) => {
    await api.put(`/admin/users/${user._id}/${user.isBlocked ? 'unblock' : 'block'}`);
    loadAll();
  };

  const verifyCrop = async (id, action) => {
    const note = action === 'reject' ? prompt('Reason for rejection:') || '' : '';
    await api.put(`/admin/crops/${id}/verify`, { action, note });
    loadAll();
  };

  const addProduct = async (e) => {
    e.preventDefault();
    await api.post('/products', productForm);
    setShowAddProduct(false);
    setProductForm({ name: '', category: 'seed', brand: '', description: '', price: '', unit: '', stock: '' });
    loadAll();
  };

  const updateOrderStatus = async (id, orderStatus) => {
    await api.put(`/admin/orders/${id}/status`, { orderStatus });
    loadAll();
  };

  if (loading) return <Loader label="Loading admin dashboard..." />;

  return (
    <div className="page-container">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Admin Dashboard</h1>

      <div className="flex gap-2 mb-8 overflow-x-auto no-scrollbar">
        {tabs.map((t, i) => (
          <button key={t} onClick={() => setTab(i)} className={`px-4 py-2 rounded-full text-sm whitespace-nowrap ${tab === i ? 'bg-primary-600 text-white' : 'bg-white border border-gray-200'}`}>{t}</button>
        ))}
      </div>

      {tab === 0 && stats && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <StatCard label="Total Farmers" value={stats.farmerCount} />
          <StatCard label="Total Buyers" value={stats.buyerCount} />
          <StatCard label="Crop Listings" value={stats.cropCount} />
          <StatCard label="Pending Verification" value={stats.pendingCrops} color="text-yellow-600" />
          <StatCard label="Store Products" value={stats.productCount} />
          <StatCard label="Total Store Orders" value={stats.orderCount} />
          <StatCard label="Total Offers Made" value={stats.offerCount} />
          <StatCard label="Total Sales (Paid)" value={`₹${stats.totalSales}`} />
        </div>
      )}

      {tab === 1 && (
        <div className="space-y-3">
          {farmers.map((f) => (
            <div key={f._id} className="card p-4 flex flex-wrap items-center gap-4">
              <div className="flex-1 min-w-[150px]">
                <p className="font-semibold text-gray-800">{f.name}</p>
                <p className="text-xs text-gray-500">{f.phone} · {f.location?.district}, {f.location?.state}</p>
              </div>
              {f.isBlocked && <span className="badge bg-red-100 text-red-700">Blocked</span>}
              <button onClick={() => toggleBlock(f)} className={`btn-outline !py-1.5 !px-3 text-xs ${f.isBlocked ? '!border-primary-600 !text-primary-700' : '!border-red-300 !text-red-600'}`}>
                {f.isBlocked ? 'Unblock' : 'Block'}
              </button>
            </div>
          ))}
        </div>
      )}

      {tab === 2 && (
        <div className="space-y-3">
          {buyers.map((b) => (
            <div key={b._id} className="card p-4 flex flex-wrap items-center gap-4">
              <div className="flex-1 min-w-[150px]">
                <p className="font-semibold text-gray-800">{b.name} {b.companyName && `(${b.companyName})`}</p>
                <p className="text-xs text-gray-500">{b.phone} · {b.buyerType}</p>
              </div>
              {b.isBlocked && <span className="badge bg-red-100 text-red-700">Blocked</span>}
              <button onClick={() => toggleBlock(b)} className={`btn-outline !py-1.5 !px-3 text-xs ${b.isBlocked ? '!border-primary-600 !text-primary-700' : '!border-red-300 !text-red-600'}`}>
                {b.isBlocked ? 'Unblock' : 'Block'}
              </button>
            </div>
          ))}
        </div>
      )}

      {tab === 3 && (
        <div className="space-y-3">
          {pendingCrops.map((c) => (
            <div key={c._id} className="card p-4 flex flex-wrap items-center gap-4">
              <div className="flex-1 min-w-[180px]">
                <p className="font-semibold text-gray-800">{c.cropName} <span className="text-xs text-gray-400">by {c.farmer?.name}</span></p>
                <p className="text-sm text-gray-500">{c.quantity} {c.quantityUnit} @ ₹{c.expectedPrice} · {c.location?.district}</p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => verifyCrop(c._id, 'approve')} className="btn-primary !py-1.5 !px-3 text-xs">Approve</button>
                <button onClick={() => verifyCrop(c._id, 'reject')} className="border border-red-300 text-red-600 !py-1.5 !px-3 rounded-xl text-xs">Reject</button>
              </div>
            </div>
          ))}
          {pendingCrops.length === 0 && <p className="text-gray-400 text-center py-16">No crops pending verification.</p>}
        </div>
      )}

      {tab === 4 && (
        <div>
          <button onClick={() => setShowAddProduct(!showAddProduct)} className="btn-primary mb-5">
            {showAddProduct ? 'Cancel' : '+ Add New Product'}
          </button>

          {showAddProduct && (
            <form onSubmit={addProduct} className="card p-5 grid sm:grid-cols-2 gap-3 mb-6">
              <input required placeholder="Product Name" className="input-field" value={productForm.name} onChange={(e) => setProductForm({ ...productForm, name: e.target.value })} />
              <select className="input-field" value={productForm.category} onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}>
                {['seed', 'fertilizer', 'pesticide', 'tool', 'equipment', 'other'].map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
              <input placeholder="Brand" className="input-field" value={productForm.brand} onChange={(e) => setProductForm({ ...productForm, brand: e.target.value })} />
              <input placeholder="Unit (e.g. 1 litre, 50kg bag)" className="input-field" value={productForm.unit} onChange={(e) => setProductForm({ ...productForm, unit: e.target.value })} />
              <input required type="number" placeholder="Price" className="input-field" value={productForm.price} onChange={(e) => setProductForm({ ...productForm, price: e.target.value })} />
              <input required type="number" placeholder="Stock" className="input-field" value={productForm.stock} onChange={(e) => setProductForm({ ...productForm, stock: e.target.value })} />
              <textarea placeholder="Description" className="input-field sm:col-span-2" value={productForm.description} onChange={(e) => setProductForm({ ...productForm, description: e.target.value })} />
              <button className="btn-primary sm:col-span-2">Save Product</button>
            </form>
          )}

          <div className="space-y-3">
            {products.map((p) => (
              <div key={p._id} className="card p-4 flex flex-wrap items-center gap-4">
                <div className="flex-1 min-w-[150px]">
                  <p className="font-semibold text-gray-800">{p.name}</p>
                  <p className="text-xs text-gray-500 capitalize">{p.category} · ₹{p.price}/{p.unit} · Stock: {p.stock}</p>
                </div>
                <button onClick={async () => { await api.delete(`/products/${p._id}`); loadAll(); }} className="text-red-500 text-xs font-medium">Delete</button>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === 5 && (
        <div className="space-y-3">
          {orders.map((o) => (
            <div key={o._id} className="card p-4 flex flex-wrap items-center gap-4">
              <div className="flex-1 min-w-[180px]">
                <p className="font-semibold text-gray-800">#{o._id.slice(-8).toUpperCase()} · {o.user?.name}</p>
                <p className="text-xs text-gray-500">₹{o.totalAmount} · {o.paymentMethod}</p>
              </div>
              <select
                className="input-field !w-auto"
                value={o.orderStatus}
                onChange={(e) => updateOrderStatus(o._id, e.target.value)}
              >
                {['placed', 'confirmed', 'shipped', 'delivered', 'cancelled'].map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
