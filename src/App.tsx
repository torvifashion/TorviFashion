import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import Header from './components/Header';
import Footer from './components/Footer';
import MobileNavigation from './components/MobileNavigation';

// Pages
import Home from './pages/Home';
import Shop from './pages/Shop';
import Categories from './pages/Categories';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Auth from './pages/Auth';
import Profile from './pages/Profile';
import OrderTracking from './pages/OrderTracking';
import Contact from './pages/Contact';
import About from './pages/About';
import Wishlist from './pages/Wishlist';
import Admin from './pages/Admin';
import EditProduct from './pages/EditProduct';

import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import { ShieldAlert } from 'lucide-react';

function PageRouter() {
  const { user } = useApp();
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <motion.main
        key={location.pathname}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.25, ease: 'easeInOut' }}
        className="flex-grow min-h-[600px] bg-brand-cream dark:bg-brand-dark-bg text-brand-charcoal dark:text-zinc-100 transition-colors"
      >
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/login" element={<Auth />} />
          <Route path="/profile" element={user ? <Profile /> : <Navigate to="/login" replace />} />
          <Route path="/ordertracking" element={<OrderTracking />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/about" element={<About />} />
          <Route path="/wishlist" element={<Wishlist />} />
          
          {/* Admin routes */}
          <Route path="/admin" element={
            user && user.role !== 'admin' ? <Navigate to="/login" replace /> : <Admin />
          } />
          <Route path="/torvi-control-suite-x9k27" element={
            user && user.role !== 'admin' ? <Navigate to="/login" replace /> : <Admin />
          } />
          
          <Route path="/editproduct" element={
            user && user.role === 'admin' ? <EditProduct /> : <Navigate to="/login" replace />
          } />
          <Route path="/editproduct/:id" element={
            user && user.role === 'admin' ? <EditProduct /> : <Navigate to="/login" replace />
          } />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </motion.main>
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <AppProvider>
      <div className="flex flex-col min-h-screen bg-brand-cream dark:bg-brand-dark-bg transition-colors selection:bg-brand-pink-light selection:text-brand-pink-dark">
        
        {/* Navigation Bar */}
        <Header />

        {/* Global Slide-Out Mobile Navigation Drawer */}
        <MobileNavigation />

        {/* Dynamic Catalog Section */}
        <PageRouter />

        {/* Multi-Column Footer */}
        <Footer />

      </div>
    </AppProvider>
  );
}
