import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { UserPlus, LogIn, Sparkles, ShieldCheck } from 'lucide-react';

export default function Auth() {
  const { user, login, setPage } = useApp();
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [isRegister, setIsRegister] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [authSuccess, setAuthSuccess] = useState<boolean>(false);

  React.useEffect(() => {
    if (user) {
      if (user.role === 'admin' || user.email.toLowerCase() === 'shihabsany.ix@gmail.com') {
        setPage('torvi-control-suite-x9k27');
      } else {
        setPage('Profile');
      }
    }
  }, [user, setPage]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setAuthSuccess(false);

    if (!email.trim()) return;

    try {
      const success = await login(email, isRegister ? name : undefined);
      if (success) {
        setAuthSuccess(true);
        setTimeout(() => {
          // If the logged in user is admin, push them to admin dashboard
          if (email.toLowerCase() === 'shihabsany.ix@gmail.com') {
            setPage('torvi-control-suite-x9k27');
          } else {
            setPage('Profile');
          }
        }, 1000);
      } else {
        setAuthError('Error communicating with authentication endpoints.');
      }
    } catch (_) {
      setAuthError('Connection error during authentication.');
    }
  };

  // Quick sandbox helpers
  const handleQuickCustomer = async () => {
    await login('customer@elegance.com', 'Amelia Watson');
    setPage('Profile');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 font-sans text-left flex justify-center">
      
      <div className="bg-white dark:bg-zinc-90 w-full max-w-md p-8 rounded-3xl border border-zinc-100 dark:border-zinc-800 shadow-sm space-y-8 relative overflow-hidden">
        
        {/* Soft atmospheric background blush */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-rose-50 dark:bg-rose-955/20 rounded-full blur-2xl -z-10" />

        <div className="text-center space-y-2 select-none">
          <span className="text-rose-455 text-[10px] uppercase tracking-widest block font-bold">
            Torvi Fashion Society
          </span>
          <h1 className="text-2xl font-light text-zinc-905 dark:text-white">
            {isRegister ? 'Create Your ' : 'Access Your '}
            <span className="font-serif italic text-rose-455">Styling Account</span>
          </h1>
          <p className="text-xs text-zinc-404 leading-relaxed">
            Gain secure control hubs over styling wishlists, cart profiles, and track historical dispatches.
          </p>
        </div>

        {/* Quick Simulation sandbox triggers */}
        <div className="p-4 bg-zinc-50 dark:bg-zinc-950 rounded-2xl border border-zinc-150 dark:border-zinc-800 space-y-3">
          <span className="text-[10px] text-zinc-400 uppercase tracking-widest font-mono font-bold block text-center">
            ⚡ Quick Access Shortcut
          </span>
          <button
            id="quick-login-customer"
            type="button"
            onClick={handleQuickCustomer}
            className="w-full px-3 py-2.5 bg-rose-500 hover:bg-rose-600 font-semibold text-white text-[11px] rounded-lg transition uppercase tracking-wider text-center"
          >
            Express Login as Customer
          </button>
        </div>

        {/* Auth form */}
        {authSuccess ? (
          <div className="p-4 bg-emerald-50 dark:bg-emerald-955/15 text-emerald-600 dark:text-emerald-400 text-xs rounded-xl text-center space-y-2 font-sans font-medium">
            <p>🎉 Credentials verified successfully!</p>
            <p className="text-zinc-400 font-normal">Sourcing account panels into workspace...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {isRegister && (
              <div className="space-y-1.5">
                <label className="text-xs text-zinc-400 block">Your Profile Name</label>
                <input
                  id="auth-name-input"
                  type="text"
                  required
                  placeholder="e.g. Amelia Watson"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-white rounded border border-zinc-200 dark:border-zinc-800 focus:outline-none focus:border-rose-455"
                />
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-xs text-zinc-400 block">Your Email Address</label>
              <input
                id="auth-email-input"
                type="email"
                required
                placeholder="customer@elegance.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-white rounded border border-zinc-200 dark:border-zinc-800 focus:outline-none focus:border-rose-455"
              />
            </div>

            <button
              id="auth-submit-btn"
              type="submit"
              className="w-full py-2.5 bg-zinc-900 hover:bg-rose-455 text-white rounded text-xs uppercase tracking-widest font-semibold transition-colors flex items-center justify-center space-x-1 shadow-sm mt-2"
            >
              {isRegister ? <UserPlus className="w-4 h-4" /> : <LogIn className="w-4 h-4" />}
              <span>{isRegister ? 'Register & Access' : 'Authenticate Credentials'}</span>
            </button>

          </form>
        )}

        {authError && (
          <p className="text-xs font-semibold text-red-500 text-center">
            ⚠️ {authError}
          </p>
        )}

        {/* Switch Register / Login toggles */}
        <div className="text-center text-xs text-zinc-500 border-t border-zinc-100 dark:border-zinc-805 pt-5">
          {isRegister ? (
            <p>
              Already have a Torvi account?{' '}
              <button
                id="auth-toggle-login"
                type="button"
                onClick={() => setIsRegister(false)}
                className="text-rose-455 underline font-semibold focus:outline-none"
              >
                Sign In
              </button>
            </p>
          ) : (
            <p>
              New to the Boutique Society?{' '}
              <button
                id="auth-toggle-register"
                type="button"
                onClick={() => setIsRegister(true)}
                className="text-rose-455 underline font-semibold focus:outline-none"
              >
                Create Account
              </button>
            </p>
          )}
        </div>

      </div>

    </div>
  );
}
