import React, { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import PostCard from '../components/PostCard';
import SearchBar from '../components/SearchBar';

const demoPosts = [
  {
    _id: 'demo1',
    cropName: 'Javari Tomato',
    pricePerKg: 10,
    quantity: 1000,
    negotiable: true,
    sold: false,
    createdAt: new Date().toISOString(),
    cropImage: 'https://images.unsplash.com/photo-1567306226416-28f0efdc88ce?q=80&w=1600&auto=format&fit=crop&ixlib=rb-4.0.3&s=0f9a2a4b3d1f6d7a8a9b',
    location: 'Nashik, Maharashtra',
    userId: { _id: 'u1', name: 'Ramesh Kumar', location: 'Nashik, Maharashtra', profileImage: '' }
  },
  {
    _id: 'demo2',
    cropName: 'Green Leafy Mix',
    pricePerKg: 15,
    quantity: 500,
    negotiable: false,
    sold: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
    cropImage: 'https://images.unsplash.com/photo-1501004318641-b39e6451bec6?q=80&w=1600&auto=format&fit=crop&ixlib=rb-4.0.3&s=7d6f7f3d9f0b4a2e3c4f',
    location: 'Ahmednagar, MH',
    userId: { _id: 'u2', name: 'Sunita Patil', location: 'Ahmednagar, MH', profileImage: '' }
  }
];

const Feed = () => {
  const [posts, setPosts] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchPosts = async (q = '') => {
    setLoading(true);
    try {
      const { data } = await api.get('/posts', { params: q ? { search: q } : {} });
      if (!data || data.length === 0) {
        setPosts(demoPosts);
      } else {
        setPosts(data);
      }
    } catch (e) {
      // fallback to demo posts when API fails
      setPosts(demoPosts);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => fetchPosts(search), 350);
    return () => clearTimeout(timeout);
  }, [search]);

  return (
    <div className="max-w-xl mx-auto px-4 py-6 space-y-4">
      <div className="flex items-center gap-3">
        <div className="flex-1">
          <SearchBar value={search} onChange={setSearch} />
        </div>
        <button
          onClick={() => navigate('/create-post')}
          className="btn-primary flex items-center gap-1.5 whitespace-nowrap"
        >
          <Plus size={18} /> Post
        </button>
      </div>

      {loading && <p className="text-center text-crop-400 py-10">Loading posts...</p>}

      {!loading && posts.length === 0 && (
        <div className="text-center text-crop-400 py-16">
          <p>No crop posts found.</p>
        </div>
      )}

      {posts.map((post) => (
        <PostCard key={post._id} post={post} />
      ))}
    </div>
  );
};

export default Feed;
