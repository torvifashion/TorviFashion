import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { ArrowRight, Sparkles, Tag, ShieldCheck, HelpCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const HERO_SLIDES = [
  {
    tagline: 'SOPHISTICATED ACCENTS',
    title: 'Aurelia Collection',
    highlight: 'Handcrafted Blush Luxury',
    description: 'Elevate your daily outfits with the exquisite craftsmanship of the genuine Aurelia Handbag. Sleek silhouettes, solid brass hardware, and premium rose calfskin leather.',
    cta: 'Explore Handbags',
    coupon: 'WELCOME10',
    image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=1000&auto=format&fit=crop&q=80',
    category: 'Handbags'
  },
  {
    tagline: 'MINIMAL & RADIANT',
    title: 'Bespoke Jewelry',
    highlight: 'Organic Baroque Pearl Drops',
    description: 'Accentuate your neckline with 18k yellow-gold vermeil vermillion necklaces and natural saltwater pearls carefully hand-picked for their unique radiant reflections.',
    cta: 'Browse Fine Jewelry',
    coupon: 'BOUTIQUE30',
    image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=1000&auto=format&fit=crop&q=80',
    category: 'Jewelry Accessories'
  },
  {
    tagline: 'CONTEMPORARY CHIC',
    title: 'Chevron Shoulder',
    highlight: 'Nappa Quilted Masterpiece',
    description: 'A versatile convertible mesh gold chain companion for high-profile evenings and city walks. Features stateful interior compartments and soft cushioned quilted lining.',
    cta: 'Shop Shoulder Bags',
    coupon: 'ELEGANCE20',
    image: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=1000&auto=format&fit=crop&q=80',
    category: 'Shoulder Bags'
  }
];

export default function Hero() {
  const { setPage, setCategoryFilter } = useApp();
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const slide = HERO_SLIDES[currentSlide];

  const handleCta = (categoryName: string) => {
    setCategoryFilter(categoryName);
    setPage('Shop');
  };

  return (
    <div className="relative overflow-hidden bg-white dark:bg-brand-dark-bg border-b border-brand-border dark:border-brand-dark-border transition-colors duration-300 font-sans">
      
      <div className="relative h-[60vh] sm:h-[75vh] md:h-[85vh] lg:h-screen w-full bg-zinc-950 overflow-hidden flex flex-col justify-between">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="absolute inset-0"
          >
            <img
              src={slide.image}
              alt={`Premium Collection Slide ${currentSlide + 1}`}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </motion.div>
        </AnimatePresence>

        {/* Top spacing */}
        <div className="h-24 pointer-events-none z-20" />

        {/* Spacer */}
        <div className="flex-grow z-20" />

        {/* Slideshow Progress indicators */}
        <div className="absolute bottom-8 left-0 right-0 z-30 flex justify-center space-x-2.5">
          {HERO_SLIDES.map((_, i) => (
            <button
              key={i}
              id={`hero-dot-${i}`}
              onClick={() => setCurrentSlide(i)}
              className={`h-1 transition-all duration-400 cursor-pointer ${
                i === currentSlide ? 'w-10 bg-white shadow-md' : 'w-3 bg-white/45 hover:bg-white/70 shadow-sm'
              }`}
              aria-label={`Go to slide ${i+1}`}
            />
          ))}
        </div>

      </div>
    </div>
  );
}
