import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const user = await login(form.email, form.password);
      if (user.role === 'admin') navigate('/admin');
      else if (user.role === 'farmer') navigate('/farmer');
      else navigate('/buyer');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container max-w-md py-16">
      <div className="card p-8">
        <h1 className="text-2xl font-bold text-primary-800 text-center">Welcome Back</h1>
        <p className="text-center text-gray-500 text-sm mt-1">Login to Smart Agri Connect</p>

        {error && <div className="bg-red-50 text-red-600 text-sm rounded-lg px-4 py-2 mt-4">{error}</div>}

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700">Email</label>
            <input
              type="email" required className="input-field mt-1"
              value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">Password</label>
            <input
              type="password" required className="input-field mt-1"
              value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })}
              placeholder="••••••••"
            />
          </div>
          <button disabled={loading} className="btn-primary w-full">{loading ? 'Logging in...' : 'Login'}</button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          Don't have an account? <Link to="/register" className="text-primary-700 font-medium">Register</Link>
        </p>

        <div className="mt-6 bg-primary-50 rounded-xl p-4 text-xs text-gray-600">
          <p className="font-medium mb-1">Demo credentials (after running seed script):</p>
          <p>Farmer: farmer@smartagri.com / farmer123</p>
          <p>Buyer: buyer@smartagri.com / buyer123</p>
          <p>Admin: admin@smartagri.com / admin123</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
