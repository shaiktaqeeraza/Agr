import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import ProductCard from '../components/ProductCard';
import Loader from '../components/Loader';

const categories = ['seed', 'fertilizer', 'pesticide', 'tool', 'equipment', 'other'];

const Store = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ search: '', category: '' });

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = { ...filters };
      Object.keys(params).forEach((k) => !params[k] && delete params[k]);
      const res = await api.get('/products', { params });
      setProducts(res.data.products);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProducts(); }, []); // eslint-disable-line

  return (
    <div className="page-container">
      <h1 className="text-2xl font-bold text-gray-800 mb-1">Agriculture Store</h1>
      <p className="text-gray-500 text-sm mb-6">Seeds, fertilizers, pesticides & farming tools — delivered to your farm.</p>

      <div className="flex gap-2 mb-6 overflow-x-auto no-scrollbar pb-1">
        <button onClick={() => setFilters({ ...filters, category: '' })} className={`px-4 py-2 rounded-full text-sm whitespace-nowrap ${!filters.category ? 'bg-primary-600 text-white' : 'bg-white border border-gray-200'}`}>All</button>
        {categories.map((c) => (
          <button key={c} onClick={() => setFilters({ ...filters, category: c })} className={`px-4 py-2 rounded-full text-sm capitalize whitespace-nowrap ${filters.category === c ? 'bg-primary-600 text-white' : 'bg-white border border-gray-200'}`}>{c}</button>
        ))}
      </div>

      <form onSubmit={(e) => { e.preventDefault(); fetchProducts(); }} className="flex gap-3 mb-8">
        <input placeholder="Search products..." className="input-field" value={filters.search} onChange={(e) => setFilters({ ...filters, search: e.target.value })} />
        <button className="btn-primary whitespace-nowrap">Search</button>
      </form>

      {loading ? (
        <Loader label="Loading products..." />
      ) : products.length === 0 ? (
        <p className="text-center text-gray-500 py-16">No products found.</p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((p) => <ProductCard key={p._id} product={p} />)}
        </div>
      )}
    </div>
  );
};

export default Store;
