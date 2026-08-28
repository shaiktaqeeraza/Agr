import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FiTrendingUp, FiShield, FiMessageCircle, FiTruck } from 'react-icons/fi';

const features = [
  { icon: <FiTrendingUp />, title: 'Fair Market Prices', desc: 'Sell directly to buyers and get real-time crop price updates — no middlemen.' },
  { icon: <FiShield />, title: 'Verified Listings', desc: 'Every crop listing is verified by our admin team before it goes live.' },
  { icon: <FiMessageCircle />, title: 'Direct Chat', desc: 'Chat directly with farmers or buyers to negotiate and finalize deals.' },
  { icon: <FiTruck />, title: 'Agri Store', desc: 'Buy seeds, fertilizers, pesticides, and tools delivered to your farm.' }
];

const Home = () => {
  const { t } = useTranslation();
  return (
    <div>
      <section className="bg-gradient-to-br from-primary-700 to-primary-900 text-white">
        <div className="page-container py-16 md:py-24 grid md:grid-cols-2 gap-10 items-center">
          <div>
            <h1 className="text-3xl md:text-5xl font-bold leading-tight">{t('home.heroTitle')}</h1>
            <p className="mt-4 text-primary-100 text-lg">{t('home.heroSubtitle')}</p>
            <div className="mt-8 flex gap-4 flex-wrap">
              <Link to="/register" className="bg-white text-primary-700 font-semibold px-6 py-3 rounded-xl shadow hover:bg-primary-50 transition">
                {t('home.sellCrop')}
              </Link>
              <Link to="/crops" className="border border-white/60 px-6 py-3 rounded-xl hover:bg-white/10 transition">
                {t('home.browseCrops')}
              </Link>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {['🌾 Wheat', '🍅 Vegetables', '🌻 Oilseeds', '🥭 Fruits'].map((c) => (
              <div key={c} className="bg-white/10 rounded-2xl p-6 text-center text-lg font-medium backdrop-blur">
                {c}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="page-container py-16">
        <h2 className="text-2xl font-bold text-center text-gray-800">{t('home.whyUs')}</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-10">
          {features.map((f) => (
            <div key={f.title} className="card p-6 text-center">
              <div className="w-12 h-12 mx-auto rounded-full bg-primary-100 text-primary-700 flex items-center justify-center text-2xl mb-4">
                {f.icon}
              </div>
              <h3 className="font-semibold text-gray-800">{f.title}</h3>
              <p className="text-sm text-gray-500 mt-2">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-primary-800 text-white">
        <div className="page-container py-12 grid sm:grid-cols-3 gap-6 text-center">
          <div><p className="text-3xl font-bold">10,000+</p><p className="text-primary-200 text-sm">Farmers Onboarded</p></div>
          <div><p className="text-3xl font-bold">2,500+</p><p className="text-primary-200 text-sm">Verified Buyers</p></div>
          <div><p className="text-3xl font-bold">₹50Cr+</p><p className="text-primary-200 text-sm">Crop Value Traded</p></div>
        </div>
      </section>
    </div>
  );
};

export default Home;
