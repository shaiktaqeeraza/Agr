import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [role, setRole] = useState('farmer');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: '', email: '', phone: '', password: '',
    buyerType: 'individual', companyName: '',
    village: '', district: '', state: '', pincode: '',
    farmSize: ''
  });

  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const payload = {
        name: form.name,
        email: form.email,
        phone: form.phone,
        password: form.password,
        role,
        location: { village: form.village, district: form.district, state: form.state, pincode: form.pincode }
      };
      if (role === 'farmer') {
        payload.farmDetails = { farmSize: Number(form.farmSize) || 0 };
      }
      if (role === 'buyer') {
        payload.buyerType = form.buyerType;
        payload.companyName = form.companyName;
      }

      const user = await register(payload);
      if (user.role === 'farmer') navigate('/farmer');
      else navigate('/buyer');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container max-w-lg py-12">
      <div className="card p-8">
        <h1 className="text-2xl font-bold text-primary-800 text-center">Create Your Account</h1>
        <p className="text-center text-gray-500 text-sm mt-1">Join Smart Agri Connect as a Farmer or Buyer</p>

        <div className="flex gap-3 mt-6">
          {['farmer', 'buyer'].map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setRole(r)}
              className={`flex-1 py-2.5 rounded-xl font-medium capitalize border transition ${
                role === r ? 'bg-primary-600 text-white border-primary-600' : 'border-gray-200 text-gray-600'
              }`}
            >
              {r === 'farmer' ? '🌾 Farmer' : '🧑\u200d💼 Buyer / Trader / Company'}
            </button>
          ))}
        </div>

        {error && <div className="bg-red-50 text-red-600 text-sm rounded-lg px-4 py-2 mt-4">{error}</div>}

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <input required placeholder="Full Name" className="input-field col-span-2" value={form.name} onChange={set('name')} />
            <input required type="email" placeholder="Email" className="input-field" value={form.email} onChange={set('email')} />
            <input required placeholder="Phone Number" className="input-field" value={form.phone} onChange={set('phone')} />
            <input required type="password" placeholder="Password (min 6 chars)" className="input-field col-span-2" value={form.password} onChange={set('password')} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <input placeholder="Village" className="input-field" value={form.village} onChange={set('village')} />
            <input placeholder="District" className="input-field" value={form.district} onChange={set('district')} />
            <input placeholder="State" className="input-field" value={form.state} onChange={set('state')} />
            <input placeholder="Pincode" className="input-field" value={form.pincode} onChange={set('pincode')} />
          </div>

          {role === 'farmer' && (
            <input type="number" placeholder="Farm Size (in acres)" className="input-field" value={form.farmSize} onChange={set('farmSize')} />
          )}

          {role === 'buyer' && (
            <div className="grid grid-cols-2 gap-4">
              <select className="input-field" value={form.buyerType} onChange={set('buyerType')}>
                <option value="individual">Individual Buyer</option>
                <option value="trader">Trader</option>
                <option value="company">Company</option>
              </select>
              <input placeholder="Company Name (optional)" className="input-field" value={form.companyName} onChange={set('companyName')} />
            </div>
          )}

          <button disabled={loading} className="btn-primary w-full">{loading ? 'Creating account...' : 'Register'}</button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          Already have an account? <Link to="/login" className="text-primary-700 font-medium">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
