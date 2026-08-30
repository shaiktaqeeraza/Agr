import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FiMenu, FiX, FiShoppingCart, FiBell, FiMessageCircle } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { cartCount } = useCart();
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const dashboardLink =
    user?.role === 'admin' ? '/admin' : user?.role === 'farmer' ? '/farmer' : user?.role === 'buyer' ? '/buyer' : '/login';

  const changeLang = (lng) => {
    i18n.changeLanguage(lng);
    localStorage.setItem('sac_lang', lng);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-primary-100 shadow-sm">
      <div className="page-container flex items-center justify-between py-3">
        <Link to="/" className="flex items-center gap-2 font-bold text-primary-700 text-xl">
          <span className="text-2xl">🌾</span> {t('appName')}
        </Link>

        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-600">
          <Link to="/crops" className="hover:text-primary-700">{t('nav.browseCrops')}</Link>
          <Link to="/store" className="hover:text-primary-700">{t('nav.store')}</Link>
          <Link to="/advisory" className="hover:text-primary-700">{t('nav.advisory')}</Link>
          {user && <Link to="/chat" className="hover:text-primary-700 flex items-center gap-1"><FiMessageCircle />{t('nav.chat')}</Link>}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <select
            value={i18n.language}
            onChange={(e) => changeLang(e.target.value)}
            className="text-xs border border-gray-200 rounded-lg px-2 py-1.5 bg-white"
          >
            <option value="en">English</option>
            <option value="hi">हिंदी</option>
          </select>

          {user?.role !== 'admin' && (
            <Link to="/cart" className="relative p-2 rounded-full hover:bg-primary-50">
              <FiShoppingCart className="text-xl text-gray-600" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary-600 text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>
          )}

          {user && (
            <Link to="/notifications" className="p-2 rounded-full hover:bg-primary-50">
              <FiBell className="text-xl text-gray-600" />
            </Link>
          )}

          {user ? (
            <>
              <Link to={dashboardLink} className="btn-outline !py-2 !px-4 text-sm">{t('nav.dashboard')}</Link>
              <button onClick={handleLogout} className="btn-primary !py-2 !px-4 text-sm">{t('nav.logout')}</button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn-outline !py-2 !px-4 text-sm">{t('nav.login')}</Link>
              <Link to="/register" className="btn-primary !py-2 !px-4 text-sm">{t('nav.register')}</Link>
            </>
          )}
        </div>

        <button className="md:hidden text-2xl text-primary-700" onClick={() => setOpen(!open)}>
          {open ? <FiX /> : <FiMenu />}
        </button>
      </div>

      {open && (
        <div className="md:hidden px-4 pb-4 flex flex-col gap-3 border-t border-primary-100 bg-white">
          <Link to="/crops" onClick={() => setOpen(false)} className="py-2">{t('nav.browseCrops')}</Link>
          <Link to="/store" onClick={() => setOpen(false)} className="py-2">{t('nav.store')}</Link>
          <Link to="/advisory" onClick={() => setOpen(false)} className="py-2">{t('nav.advisory')}</Link>
          {user && <Link to="/chat" onClick={() => setOpen(false)} className="py-2">{t('nav.chat')}</Link>}
          {user && <Link to="/cart" onClick={() => setOpen(false)} className="py-2">Cart ({cartCount})</Link>}
          {user ? (
            <>
              <Link to={dashboardLink} onClick={() => setOpen(false)} className="btn-outline text-center">{t('nav.dashboard')}</Link>
              <button onClick={handleLogout} className="btn-primary">{t('nav.logout')}</button>
            </>
          ) : (
            <>
              <Link to="/login" onClick={() => setOpen(false)} className="btn-outline text-center">{t('nav.login')}</Link>
              <Link to="/register" onClick={() => setOpen(false)} className="btn-primary text-center">{t('nav.register')}</Link>
            </>
          )}
        </div>
      )}
    </header>
  );
};

export default Navbar;
