import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { useApp } from '../context/AppContext';
import { Search, X, ChevronDown, ChevronUp } from 'lucide-react';
import BrandLogoText from './BrandLogoText';

export default function MobileNavigation() {
  const {
    mobileMenuOpen,
    setMobileMenuOpen,
    setPage,
    setCategoryFilter,
    user,
    searchQuery,
    setSearchQuery
  } = useApp();

  const [categoriesExpanded, setCategoriesExpanded] = useState(false);
  const [searchInput, setSearchInput] = useState(searchQuery);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchQuery(searchInput);
    setPage('Shop');
    setMobileMenuOpen(false);
  };

  const navigateTo = (page: string, category: string = 'All') => {
    setCategoryFilter(category);
    setPage(page);
    setMobileMenuOpen(false);
  };

  const categories = [
    { name: 'Handbags', label: 'Handbags' },
    { name: 'Shoulder Bags', label: 'Shoulder Bags' },
    { name: 'Tote Bags', label: 'Tote Bags' },
    { name: 'Crossbody Bags', label: 'Crossbody Bags' },
    { name: 'Cosmetic Bags', label: 'Cosmetic Bags' },
    { name: 'Jewelry Accessories', label: 'Jewelry Accessories' },
    { name: 'Fashion Accessories', label: 'Fashion Accessories' }
  ];

  return (
    <AnimatePresence>
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 z-50 flex justify-start overflow-hidden"
          style={{ position: 'fixed', top: 0, bottom: 0, left: 0, right: 0 }}
        >
          {/* Backdrop screen mask */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
            style={{ position: 'fixed', top: 0, bottom: 0, left: 0, right: 0, zIndex: 49 }}
          />

          {/* Drawer menu body */}
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ duration: 0.35, ease: [0.25, 1, 0.5, 1] }}
            className="relative w-[85%] max-w-sm bg-white text-black h-screen flex flex-col justify-between select-none z-50 shadow-2xl overflow-hidden"
            style={{ 
              boxShadow: '0 0 30px rgba(0,0,0,0.1)', 
              height: '100vh',
              backgroundColor: '#ffffff'
            }}
          >
            {/* STICKY HEADER PART WITH LOGO AND CLOSE BUTTON */}
            <div className="sticky top-0 bg-white z-20 px-6 py-4 border-b border-zinc-100 flex items-center justify-between">
              <button
                id="mob-drawer-logo"
                onClick={() => { setPage('Home'); setMobileMenuOpen(false); }}
                className="hover:opacity-85 transition-opacity flex flex-col items-start select-none bg-transparent border-none outline-none shadow-none text-left cursor-pointer"
                style={{ background: 'transparent', border: 'none', boxShadow: 'none' }}
              >
                <BrandLogoText />
              </button>
              <button
                id="mob-close-drawer-btn"
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 text-black hover:text-[#D4AF37] hover:bg-zinc-50 rounded-full transition-all cursor-pointer border-none bg-transparent"
              >
                <X className="w-5.5 h-5.5" />
              </button>
            </div>

            {/* SCROLLABLE LINKS CONTAINER */}
            <div 
              className="flex-grow overflow-y-auto px-6 py-4"
              style={{ 
                overflowY: 'auto', 
                height: 'calc(100vh - 150px)', 
                WebkitOverflowScrolling: 'touch' 
              }}
            >
              {/* Centered and rounded Search Bar */}
              <form onSubmit={handleSearchSubmit} className="mb-6 relative w-full">
                <input
                  id="mobile-drawer-search-input"
                  type="text"
                  placeholder="Search products..."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  className="w-full px-5 py-3 pl-12 text-sm font-sans tracking-wide rounded-full border border-zinc-200 bg-white text-black placeholder-zinc-400 focus:outline-none focus:border-black transition-colors"
                  style={{ backgroundColor: '#ffffff !important', color: '#000000 !important' }}
                />
                <Search className="w-4 h-4 text-zinc-500 absolute left-4 top-1/2 -translate-y-1/2" />
              </form>

              {/* Menu items list */}
              <div className="flex flex-col space-y-1">
                {/* Home */}
                <Link
                  id="mob-link-home"
                  to="/"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-left py-3 px-4 text-[18px] font-medium tracking-[0.5px] text-black hover:bg-[#f5f5f5] active:bg-[#f5f5f5] rounded-[8px] transition-all duration-300 cursor-pointer block"
                >
                  Home
                </Link>

                {/* Shop Catalog */}
                <Link
                  id="mob-link-shop"
                  to="/shop"
                  onClick={() => { setCategoryFilter('All'); setMobileMenuOpen(false); }}
                  className="w-full text-left py-3 px-4 text-[18px] font-medium tracking-[0.5px] text-black hover:bg-[#f5f5f5] active:bg-[#f5f5f5] rounded-[8px] transition-all duration-300 cursor-pointer block"
                >
                  Shop Catalog
                </Link>

                {/* Expandable Categories */}
                <div>
                  <button
                    id="mob-link-categories-expand-trigger"
                    onClick={() => setCategoriesExpanded(!categoriesExpanded)}
                    className="w-full text-left py-3 px-4 text-[18px] font-medium tracking-[0.5px] text-black hover:bg-[#f5f5f5] active:bg-[#f5f5f5] rounded-[8px] transition-all duration-300 flex items-center justify-between cursor-pointer border-none bg-transparent"
                  >
                    <span>Categories</span>
                    {categoriesExpanded ? (
                      <ChevronUp className="w-5 h-5 text-black" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-black" />
                    )}
                  </button>

                  <AnimatePresence>
                    {categoriesExpanded && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.25 }}
                        className="pl-6 pr-2 overflow-hidden flex flex-col space-y-0.5 mt-1 border-l border-zinc-100"
                      >
                        {categories.map((cat) => (
                          <button
                            key={cat.name}
                            id={`mob-sub-cat-${cat.name.toLowerCase().replace(/\s+/g, '-')}`}
                            onClick={() => navigateTo('Shop', cat.name)}
                            className="w-full text-left py-2 px-3 text-[15px] font-normal text-zinc-600 hover:text-black hover:bg-[#f5f5f5] rounded-[6px] transition-all duration-200 cursor-pointer border-none bg-transparent animate-none"
                          >
                            {cat.label}
                          </button>
                        ))}
                        {/* Categories page overview link */}
                        <Link
                          id="mob-sub-cat-all-overview"
                          to="/categories"
                          onClick={() => setMobileMenuOpen(false)}
                          className="w-full text-left py-2 px-3 text-[15px] font-medium text-[#D4AF37] hover:bg-[#f5f5f5] rounded-[6px] transition-all duration-200 cursor-pointer block"
                        >
                          View All Categories →
                        </Link>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Bags */}
                <button
                  id="mob-link-bags"
                  onClick={() => navigateTo('Shop', 'Handbags')}
                  className="w-full text-left py-3 px-4 text-[18px] font-medium tracking-[0.5px] text-black hover:bg-[#f5f5f5] active:bg-[#f5f5f5] rounded-[8px] transition-all duration-300 cursor-pointer border-none bg-transparent"
                >
                  Bags
                </button>

                {/* Accessories */}
                <button
                  id="mob-link-accessories"
                  onClick={() => navigateTo('Shop', 'Jewelry Accessories')}
                  className="w-full text-left py-3 px-4 text-[18px] font-medium tracking-[0.5px] text-black hover:bg-[#f5f5f5] active:bg-[#f5f5f5] rounded-[8px] transition-all duration-300 cursor-pointer border-none bg-transparent"
                >
                  Accessories
                </button>

                {/* Cosmetics */}
                <button
                  id="mob-link-cosmetics"
                  onClick={() => navigateTo('Shop', 'Cosmetic Bags')}
                  className="w-full text-left py-3 px-4 text-[18px] font-medium tracking-[0.5px] text-black hover:bg-[#f5f5f5] active:bg-[#f5f5f5] rounded-[8px] transition-all duration-300 cursor-pointer border-none bg-transparent"
                >
                  Cosmetics
                </button>

                {/* About Us */}
                <Link
                  id="mob-link-about"
                  to="/about"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-left py-3 px-4 text-[18px] font-medium tracking-[0.5px] text-black hover:bg-[#f5f5f5] active:bg-[#f5f5f5] rounded-[8px] transition-all duration-300 cursor-pointer block"
                >
                  About Us
                </Link>

                {/* Contact */}
                <Link
                  id="mob-link-contact"
                  to="/contact"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-left py-3 px-4 text-[18px] font-medium tracking-[0.5px] text-black hover:bg-[#f5f5f5] active:bg-[#f5f5f5] rounded-[8px] transition-all duration-300 cursor-pointer block"
                >
                  Contact
                </Link>


              </div>
            </div>

            {/* STATIC FOOTER PART OF DRAWER */}
            <div className="p-6 border-t border-zinc-100 bg-white">
              <div className="text-[10px] text-zinc-500 font-mono">
                Torvi Fashion v1.0 • 2026
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
