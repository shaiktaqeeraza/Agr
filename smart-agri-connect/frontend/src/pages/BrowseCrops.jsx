import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import CropCard from '../components/CropCard';
import Loader from '../components/Loader';

const categories = ['grain', 'vegetable', 'fruit', 'pulses', 'oilseed', 'spice', 'cash-crop', 'other'];

const BrowseCrops = () => {
  const [crops, setCrops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ search: '', district: '', category: '', minPrice: '', maxPrice: '', minQuantity: '' });
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);

  const fetchCrops = async (p = 1) => {
    setLoading(true);
    try {
      const params = { ...filters, page: p, limit: 12 };
      Object.keys(params).forEach((k) => !params[k] && delete params[k]);
      const res = await api.get('/crops', { params });
      setCrops(res.data.crops);
      setPages(res.data.pages);
      setPage(p);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCrops(1); }, []); // eslint-disable-line

  const handleSearch = (e) => {
    e.preventDefault();
    fetchCrops(1);
  };

  return (
    <div className="page-container">
      <h1 className="text-2xl font-bold text-gray-800 mb-1">Browse Crops</h1>
      <p className="text-gray-500 text-sm mb-6">Search fresh crop listings directly from verified farmers.</p>

      <form onSubmit={handleSearch} className="card p-4 grid md:grid-cols-6 gap-3 mb-8">
        <input placeholder="Search crop name..." className="input-field md:col-span-2" value={filters.search} onChange={(e) => setFilters({ ...filters, search: e.target.value })} />
        <input placeholder="District" className="input-field" value={filters.district} onChange={(e) => setFilters({ ...filters, district: e.target.value })} />
        <select className="input-field" value={filters.category} onChange={(e) => setFilters({ ...filters, category: e.target.value })}>
          <option value="">All Categories</option>
          {categories.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        <input type="number" placeholder="Min Price" className="input-field" value={filters.minPrice} onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })} />
        <input type="number" placeholder="Max Price" className="input-field" value={filters.maxPrice} onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })} />
        <button className="btn-primary md:col-span-6">Search</button>
      </form>

      {loading ? (
        <Loader label="Fetching crop listings..." />
      ) : crops.length === 0 ? (
        <p className="text-center text-gray-500 py-16">No crops found matching your filters.</p>
      ) : (
        <>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {crops.map((c) => <CropCard key={c._id} crop={c} />)}
          </div>
          {pages > 1 && (
            <div className="flex justify-center gap-2 mt-8">
              {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => fetchCrops(p)}
                  className={`w-9 h-9 rounded-lg text-sm font-medium ${page === p ? 'bg-primary-600 text-white' : 'bg-white border border-gray-200'}`}
                >
                  {p}
                </button>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default BrowseCrops;
