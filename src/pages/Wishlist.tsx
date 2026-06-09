import React from 'react';
import { useApp } from '../context/AppContext';
import ProductCard from '../components/ProductCard';
import { Heart, Sparkles } from 'lucide-react';

export default function Wishlist() {
  const { wishlist, setPage } = useApp();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 font-sans text-left">
      
      {/* Page header */}
      <div className="text-left mb-10 border-b border-zinc-100 dark:border-zinc-805 pb-5 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <span className="text-xs uppercase tracking-widest text-zinc-400 font-semibold inline-flex items-center gap-1 leading-none">
            <Sparkles className="w-3.5 h-3.5 text-rose-455" />
            <span>Curated Desires</span>
          </span>
          <h1 className="text-3xl font-sans tracking-tight text-zinc-900 dark:text-white font-light">
            My Wishlist <span className="font-serif italic text-rose-455">Shelf</span>
          </h1>
        </div>
        
        <div className="text-xs text-zinc-405 font-mono">
          <span>Favorites / </span>
          <span className="text-rose-400 font-bold">{wishlist.length} item{wishlist.length === 1 ? '' : 's'}</span>
        </div>
      </div>

      {/* Grid mappings */}
      {wishlist.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {wishlist.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-3xl space-y-4 max-w-xl mx-auto shadow-xs">
          <div className="w-12 h-12 bg-rose-50 dark:bg-zinc-950 rounded-full flex items-center justify-center mx-auto text-rose-400">
            <Heart className="w-6 h-6" />
          </div>

          <div className="space-y-1">
            <h3 className="text-base font-semibold text-zinc-850 dark:text-white">
              Your Wishlist Selection Shelf Is Bare
            </h3>
            <p className="text-xs text-zinc-404 leading-relaxed max-w-xs mx-auto">
              Save favorite handbags, sunglasses, jewelry rings, or hair clips into your personal profile ledger directory on the fly.
            </p>
          </div>

          <button
            id="wishlist-shop-fallback"
            onClick={() => setPage('Shop')}
            className="px-5 py-2.5 bg-zinc-950 hover:bg-rose-455 hover:text-white text-white rounded text-xs uppercase tracking-widest font-semibold transition"
          >
            Explore Accessories Catalog
          </button>
        </div>
      )}

    </div>
  );
}
