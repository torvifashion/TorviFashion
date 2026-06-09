import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import ProductCard from '../components/ProductCard';
import { Sparkles, ArrowRight, ShoppingBag, Eye } from 'lucide-react';

// Bags and Accessories Category definitions for Tab filtering
const BAG_CATEGORIES = ['Handbags', 'Shoulder Bags', 'Tote Bags', 'Crossbody Bags', 'Cosmetic Bags'];
const ACCESSORY_CATEGORIES = ['Jewelry Accessories', 'Fashion Accessories'];

const DEFAULT_HERO_IMAGES = [
  'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1519046904884-53103b34b206?w=1800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1800&auto=format&fit=crop&q=80'
];

const RESORT_TEXTS = [
  {
    tag: 'WOMEN',
    title: 'LV Resort Collection',
    linkText: 'Shop Now'
  },
  {
    tag: 'NEW EXQUISITES',
    title: 'Summer Seaside Masterpieces',
    linkText: 'Shop Now'
  },
  {
    tag: 'BAGS & ACCESSORIES',
    title: 'The Riviera Signature Edit',
    linkText: 'Shop Now'
  }
];

export default function Home() {
  const { products, setPage, setCategoryFilter } = useApp();
  const [activeCollectionTab, setActiveCollectionTab] = useState<'all' | 'bags' | 'accessories'>('all');

  const [heroImages, setHeroImages] = useState<string[]>(() => {
    const saved = localStorage.getItem('torvi_hero_images');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length === 3) {
          return parsed;
        }
      } catch (_) {}
    }
    return DEFAULT_HERO_IMAGES;
  });

  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    // Sync if localStorage changes (e.g. from admin)
    const handleStorageChange = () => {
      const saved = localStorage.getItem('torvi_hero_images');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length === 3) {
            setHeroImages(parsed);
          }
        } catch (_) {}
      }
    };
    window.addEventListener('storage', handleStorageChange);
    
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroImages.length);
    }, 5500);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, [heroImages.length]);

  const handleCategorySelect = (categoryName: string) => {
    setCategoryFilter(categoryName);
    setPage('Shop');
  };

  const filteredProducts = products.filter((p) => {
    if (activeCollectionTab === 'bags') {
      return BAG_CATEGORIES.includes(p.category || '');
    }
    if (activeCollectionTab === 'accessories') {
      return ACCESSORY_CATEGORIES.includes(p.category || '');
    }
    return true; // all
  });

  const resortSlides = heroImages.map((img, idx) => {
    const textData = RESORT_TEXTS[idx] || {
      tag: 'COLLECTION',
      title: 'Torvi Signature Line',
      linkText: 'Shop Now'
    };
    return {
      image: img,
      tag: textData.tag,
      title: textData.title,
      linkText: textData.linkText
    };
  });

  return (
    <div className="bg-white dark:bg-brand-dark-bg transition-colors duration-300 text-left">
      
      {/* 1. PROFESSIONAL LUXURY FULL-BLEED HERITAGE COVER (LOUIS VUITTON EST. STYLE) */}
      <section className="relative h-[60vh] sm:h-[75vh] md:h-[85vh] lg:h-screen w-full bg-zinc-950 overflow-hidden flex flex-col justify-between">
        
        {/* Fullscreen background resort image carousel */}
        <div className="absolute inset-0">
          {resortSlides.map((slideItem, idx) => (
            <div
              key={idx}
              className={`absolute inset-0 transition-opacity duration-[1200ms] ease-in-out transform ${
                idx === currentSlide ? 'opacity-100 scale-100 z-10' : 'opacity-0 scale-103 z-0'
              }`}
            >
              <img
                src={slideItem.image}
                alt={`Premium Collection Slide ${idx + 1}`}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
          ))}
        </div>

        {/* Top spacing representing the header offset */}
        <div className="h-24 pointer-events-none z-20" />

        {/* Space filler to balance layout with absolute dots */}
        <div className="flex-grow z-20 flex flex-col items-center justify-end" />

        {/* Discreet Slide Dots Overlay at bottom-center */}
        <div className="absolute bottom-8 left-0 right-0 z-30 flex justify-center space-x-2.5">
          {resortSlides.map((_, idx) => (
            <button
              key={idx}
              id={`resort-dot-${idx}`}
              onClick={() => setCurrentSlide(idx)}
              className={`h-1 transition-all duration-400 cursor-pointer ${
                idx === currentSlide ? 'w-10 bg-white shadow-md' : 'w-3 bg-white/45 hover:bg-white/70 shadow-sm'
              }`}
              aria-label={`Slide ${idx + 1}`}
            />
          ))}
        </div>

      </section>

      {/* 2. CORE COLLECTION SHOWCASE */}
      <section id="collection-grid" className="py-16 bg-white dark:bg-brand-dark-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Section title & custom collections filter switch */}
          <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-zinc-100 dark:border-zinc-850 pb-6 mb-10 gap-4">
            <div className="space-y-1">
              <span className="text-[#D4AF37] text-[10px] font-bold uppercase tracking-widest font-mono block">
                Boutique Showroom
              </span>
              <h2 className="text-3xl font-sans font-light tracking-tight text-brand-charcoal dark:text-white">
                Bags & Accessories <span className="font-serif italic text-brand-gold">Collection</span>
              </h2>
            </div>

            {/* Collection Tab Toggle Controls */}
            <div className="flex bg-zinc-50 dark:bg-zinc-950 p-1 border border-zinc-150 dark:border-zinc-850 font-sans text-xs">
              <button
                onClick={() => setActiveCollectionTab('all')}
                className={`px-4 py-2 uppercase tracking-wider font-bold transition duration-200 ${
                  activeCollectionTab === 'all'
                    ? 'bg-brand-charcoal text-white dark:bg-zinc-200 dark:text-zinc-950'
                    : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200'
                }`}
              >
                All Luxury Items
              </button>
              <button
                onClick={() => setActiveCollectionTab('bags')}
                className={`px-4 py-2 uppercase tracking-wider font-bold transition duration-200 ${
                  activeCollectionTab === 'bags'
                    ? 'bg-brand-charcoal text-white dark:bg-zinc-200 dark:text-zinc-950'
                    : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200'
                }`}
              >
                Bags Collection
              </button>
              <button
                onClick={() => setActiveCollectionTab('accessories')}
                className={`px-4 py-2 uppercase tracking-wider font-bold transition duration-200 ${
                  activeCollectionTab === 'accessories'
                    ? 'bg-brand-charcoal text-white dark:bg-zinc-200 dark:text-zinc-950'
                    : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200'
                }`}
              >
                Accessories
              </button>
            </div>
          </div>

          {/* Catalog Array Grid */}
          {filteredProducts.length === 0 ? (
            <div className="py-20 text-center border border-dashed border-zinc-200 dark:border-zinc-800 space-y-3.5">
              <ShoppingBag className="w-10 h-10 text-zinc-300 mx-auto" />
              <p className="text-sm font-semibold text-zinc-700 dark:text-zinc-305">No items listed in this selection.</p>
              <p className="text-xs text-zinc-400">Head over to the control suite to include new listings in this boutique segment.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}

          {/* Call to action footer bar */}
          <div className="mt-14 pt-10 text-center border-t border-zinc-100 dark:border-zinc-850">
            <button
              onClick={() => { setCategoryFilter('All'); setPage('Shop'); }}
              className="group inline-flex items-center space-x-2 px-8 py-4 bg-brand-charcoal dark:bg-zinc-200 dark:text-zinc-950 text-white font-bold text-xs uppercase tracking-widest transition duration-250 hover:bg-[#D4AF37] dark:hover:bg-brand-gold dark:hover:text-zinc-950 hover:shadow-md"
            >
              <span>View Infinite Shelf Catalogue</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>
          </div>

        </div>
      </section>

    </div>
  );
}
