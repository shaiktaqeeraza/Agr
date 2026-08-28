import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { FiSun, FiDroplet, FiWind } from 'react-icons/fi';

const tabs = ['Ask a Question', 'Farming Tips', 'Weather', 'Disease & Pest Guidance'];

const Advisory = () => {
  const { user } = useAuth();
  const [tab, setTab] = useState(0);
  const [questions, setQuestions] = useState([]);
  const [tips, setTips] = useState([]);
  const [guidance, setGuidance] = useState([]);
  const [weather, setWeather] = useState(null);
  const [form, setForm] = useState({ title: '', description: '', category: 'other' });
  const [posting, setPosting] = useState(false);

  useEffect(() => {
    api.get('/advisory/tips').then((res) => setTips(res.data.tips));
    api.get('/advisory/disease-guidance').then((res) => setGuidance(res.data.guidance));
    api.get('/advisory/weather').then((res) => setWeather(res.data.weather));
    if (user) api.get('/advisory/questions').then((res) => setQuestions(res.data.questions));
  }, [user]);

  const submitQuestion = async (e) => {
    e.preventDefault();
    setPosting(true);
    try {
      const res = await api.post('/advisory/questions', form);
      setQuestions([res.data.question, ...questions]);
      setForm({ title: '', description: '', category: 'other' });
    } finally {
      setPosting(false);
    }
  };

  return (
    <div className="page-container">
      <h1 className="text-2xl font-bold text-gray-800 mb-1">Crop Advisory</h1>
      <p className="text-gray-500 text-sm mb-6">Get farming tips, weather updates, and expert answers to your crop questions.</p>

      <div className="flex gap-2 mb-8 overflow-x-auto no-scrollbar">
        {tabs.map((t, i) => (
          <button key={t} onClick={() => setTab(i)} className={`px-4 py-2 rounded-full text-sm whitespace-nowrap ${tab === i ? 'bg-primary-600 text-white' : 'bg-white border border-gray-200'}`}>{t}</button>
        ))}
      </div>

      {tab === 0 && (
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            {user?.role === 'farmer' ? (
              <form onSubmit={submitQuestion} className="card p-5 space-y-3">
                <h3 className="font-semibold text-gray-800">Ask a Crop Question</h3>
                <input required placeholder="Question title" className="input-field" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
                <select className="input-field" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                  <option value="disease">Disease</option>
                  <option value="pest">Pest</option>
                  <option value="soil">Soil</option>
                  <option value="irrigation">Irrigation</option>
                  <option value="weather">Weather</option>
                  <option value="other">Other</option>
                </select>
                <textarea required placeholder="Describe your issue in detail..." rows={4} className="input-field" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
                <button disabled={posting} className="btn-primary w-full">{posting ? 'Posting...' : 'Submit Question'}</button>
              </form>
            ) : (
              <div className="card p-5 text-sm text-gray-500">Login as a farmer to ask crop questions.</div>
            )}
          </div>
          <div className="space-y-3 max-h-[500px] overflow-y-auto">
            {questions.map((q) => (
              <div key={q._id} className="card p-4">
                <div className="flex justify-between items-start">
                  <h4 className="font-medium text-gray-800">{q.title}</h4>
                  <span className={`badge ${q.status === 'answered' ? 'bg-primary-100 text-primary-700' : 'bg-yellow-100 text-yellow-700'}`}>{q.status}</span>
                </div>
                <p className="text-sm text-gray-500 mt-1">{q.description}</p>
                {q.answer && <div className="bg-primary-50 rounded-lg p-3 mt-2 text-sm text-primary-800"><strong>Expert answer:</strong> {q.answer}</div>}
              </div>
            ))}
            {questions.length === 0 && <p className="text-gray-400 text-sm">No questions yet.</p>}
          </div>
        </div>
      )}

      {tab === 1 && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {tips.map((t) => (
            <div key={t.id} className="card p-5">
              <span className="badge bg-primary-100 text-primary-700 capitalize">{t.category}</span>
              <h4 className="font-semibold text-gray-800 mt-2">{t.title}</h4>
              <p className="text-sm text-gray-500 mt-1">{t.tip}</p>
            </div>
          ))}
        </div>
      )}

      {tab === 2 && weather && (
        <div className="card p-8 max-w-md mx-auto text-center bg-gradient-to-br from-primary-500 to-primary-700 text-white">
          <FiSun className="text-6xl mx-auto mb-3" />
          <h2 className="text-2xl font-bold">{weather.location}</h2>
          <p className="text-5xl font-bold mt-2">{weather.temp}°C</p>
          <p className="capitalize text-primary-100 mt-1">{weather.condition}</p>
          <div className="flex justify-center gap-8 mt-6 text-sm">
            <div className="flex items-center gap-2"><FiDroplet /> {weather.humidity}% Humidity</div>
            <div className="flex items-center gap-2"><FiWind /> {weather.windSpeed} km/h Wind</div>
          </div>
        </div>
      )}

      {tab === 3 && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {guidance.map((g) => (
            <div key={g.id} className="card p-5">
              <span className="badge bg-red-100 text-red-700">{g.crop}</span>
              <h4 className="font-semibold text-gray-800 mt-2">{g.issue}</h4>
              <p className="text-xs text-gray-500 mt-1"><strong>Symptoms:</strong> {g.symptoms}</p>
              <p className="text-xs text-gray-600 mt-1"><strong>Remedy:</strong> {g.remedy}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Advisory;
