import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sprout } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    const res = await login(form.email, form.password);
    setSubmitting(false);
    if (res.success) navigate('/');
    else setError(res.message);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-wheat px-4">
      <div className="card w-full max-w-sm p-8">
        <div className="flex flex-col items-center mb-6">
          <div className="bg-crop-600 text-white p-3 rounded-2xl mb-2">
            <Sprout size={28} />
          </div>
          <h1 className="font-display font-semibold text-2xl text-crop-800">CropsConnection</h1>
          <p className="text-crop-500 text-sm mt-1">Log in to your account</p>
        </div>

        {error && <p className="bg-red-50 text-red-600 text-sm rounded-lg px-3 py-2 mb-4">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            required
            placeholder="Email"
            className="input-field"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
          <input
            type="password"
            required
            placeholder="Password"
            className="input-field"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
          <button type="submit" disabled={submitting} className="btn-primary w-full">
            {submitting ? 'Logging in...' : 'Log In'}
          </button>
        </form>

        <p className="text-sm text-crop-500 text-center mt-6">
          New to CropsConnection?{' '}
          <Link to="/register" className="text-crop-700 font-medium">Create an account</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
