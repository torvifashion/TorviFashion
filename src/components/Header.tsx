import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { useApp } from '../context/AppContext';
import { Search, Heart, ShoppingBag, User, Sun, Moon, Menu, X, Settings2, LogOut } from 'lucide-react';
import BrandLogoText from './BrandLogoText';

export default function Header() {
  const {
    cart,
    wishlist,
    user,
    darkMode,
    currentPage,
    searchQuery,
    setPage,
    setSearchQuery,
    setCategoryFilter,
    toggleDarkMode,
    logout,
    login,
    mobileMenuOpen,
    setMobileMenuOpen,
    logoPreset,
    setLogoPreset
  } = useApp();

  const [searchInput, setSearchInput] = useState(searchQuery);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchQuery(searchInput);
    setPage('Shop');
  };

  const isHome = currentPage === 'Home';
  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <header className="sticky top-0 z-50 bg-white dark:bg-brand-dark-bg border-b border-brand-border dark:border-brand-dark-border transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Standard menu toggle / Brand Left */}
          <div className="flex items-center md:hidden">
            <button
              id="mobile-menu-btn"
              onClick={() => setMobileMenuOpen(true)}
              className="p-2 text-zinc-600 dark:text-zinc-300 hover:text-[#D4AF37] transition-colors"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>

          {/* Logo text branding */}
          <div className="flex-1 md:flex-none flex justify-center md:justify-start items-center bg-transparent border-none outline-none shadow-none" style={{ backgroundColor: 'transparent', border: 'none', boxShadow: 'none' }}>
            <Link
              id="brand-logo"
              to="/"
              className="hover:opacity-85 transition-opacity flex flex-col items-start select-none py-1 text-left bg-transparent border-none outline-none shadow-none cursor-pointer"
              style={{ background: 'transparent', border: 'none', boxShadow: 'none' }}
            >
              <BrandLogoText />
            </Link>
          </div>

            {/* Links and Actions */}
            <div className="flex items-center space-x-6 lg:space-x-8">
              <nav className="hidden md:flex space-x-6 lg:space-x-8 text-[11px] font-semibold tracking-widest uppercase text-brand-charcoal/80 dark:text-zinc-200">
                <Link
                  id="nav-home"
                  to="/"
                  className={`hover:text-brand-gold py-1 transition-colors relative ${
                    currentPage === 'Home' ? 'text-brand-gold border-b border-brand-gold' : ''
                  }`}
                >
                  Home
                </Link>
                <Link
                  id="nav-shop"
                  to="/shop"
                  className={`hover:text-brand-gold py-1 transition-colors relative ${
                    currentPage === 'Shop' ? 'text-brand-gold border-b border-brand-gold' : ''
                  }`}
                >
                  Shop
                </Link>
                <Link
                  id="nav-cat"
                  to="/categories"
                  className={`hover:text-brand-gold py-1 transition-colors relative ${
                    currentPage === 'Categories' ? 'text-brand-gold border-b border-brand-gold' : ''
                  }`}
                >
                  Categories
                </Link>
              </nav>

              <div className="flex items-center space-x-2 sm:space-x-4">
                <form onSubmit={handleSearchSubmit} className="hidden lg:flex items-center relative">
                  <input
                    id="header-search-input"
                    type="text"
                    placeholder="Search accessories..."
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    className="w-48 xl:w-60 px-4 py-1.5 pl-9 text-xs font-sans tracking-wide rounded-none border border-brand-border bg-white text-zinc-900 focus:outline-none focus:border-brand-gold focus:ring-1 focus:ring-brand-gold transition-all"
                  />
                  <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3.5" />
                </form>

                <Link
                  id="wishlist-header-btn"
                  to="/wishlist"
                  className="p-2 rounded-full text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors relative"
                >
                  <Heart className={`w-5 h-5 ${wishlist.length > 0 ? 'fill-brand-pink-dark text-brand-pink-dark' : ''}`} />
                  {wishlist.length > 0 && (
                    <span className="absolute -top-1 -right-1 flex h-4 min-w-4 px-1 items-center justify-center text-[9px] font-bold text-brand-pink-dark bg-brand-pink-light rounded-full border border-brand-pink-dark/20 animate-pulse">
                      {wishlist.length}
                    </span>
                  )}
                </Link>

                <Link
                  id="cart-header-btn"
                  to="/cart"
                  className="p-2 rounded-full text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors relative"
                >
                  <ShoppingBag className="w-5 h-5" />
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 flex h-4 min-w-4 px-1 items-center justify-center text-[9px] font-bold text-brand-pink-dark bg-brand-pink-light rounded-full border border-brand-pink-dark/20">
                      {cartCount}
                    </span>
                  )}
                </Link>

                {user ? (
                  <div className="flex items-center space-x-1.5 sm:space-x-2 border-l border-zinc-200 dark:border-zinc-700 pl-3 sm:pl-4">
                    <Link
                      id="profile-header-btn"
                      to="/profile"
                      className="flex items-center space-x-2 text-zinc-700 dark:text-zinc-200 hover:text-rose-400 transition-colors text-xs font-semibold uppercase tracking-wider"
                    >
                      <User className="w-5 h-5 text-zinc-400" />
                      <span className="hidden sm:inline max-w-[90px] truncate">{user.name.split(' ')[0]}</span>
                    </Link>
                    <button
                      id="logout-header-btn"
                      onClick={logout}
                      className="p-1.5 text-zinc-400 hover:text-red-500 transition-colors"
                      title="Logout"
                    >
                      <LogOut className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <Link
                    id="login-header-btn"
                    to="/login"
                    className="p-2 rounded-full text-zinc-600 dark:text-zinc-300 hover:bg-rose-50 dark:hover:bg-zinc-800 transition-colors"
                    title="Customer Login / Signup"
                  >
                    <User className="w-5 h-5" />
                  </Link>
                )}

              </div>
            </div>
          </div>
        </div>
      </header>
  );
}
