import React from 'react';
import { useApp } from '../context/AppContext';
import { ArrowRight, Sparkles, FolderHeart } from 'lucide-react';

const CATEGORY_META = [
  {
    name: 'Handbags',
    desc: 'Unparalleled classical luxury. Designed from top grain leather handles with solid clasp brass hardware. Made for grand occasions and formal presentations.',
    img: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800&auto=format&fit=crop&q=80',
    slug: 'handbags'
  },
  {
    name: 'Shoulder Bags',
    desc: 'The perfect harmony of structural elegance and chain convenience. Convertible straps let you transition effortlessly from business hours to evening cocktails.',
    img: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=800&auto=format&fit=crop&q=80',
    slug: 'shoulder-bags'
  },
  {
    name: 'Tote Bags',
    desc: 'Generous proportions for the modern multi-passionate woman. Designed with durable weave canvas boundaries, accommodating up to 14" office notebooks.',
    img: 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=800&auto=format&fit=crop&q=80',
    slug: 'tote-bags'
  },
  {
    name: 'Crossbody Bags',
    desc: 'Snug companion for social weekend strolls. Dual zipped compartments packed in pebble grained vegan skins providing safe, lightweight mobility.',
    img: 'https://images.unsplash.com/photo-1591561954557-26941169b49e?w=800&auto=format&fit=crop&q=80',
    slug: 'crossbody-bags'
  },
  {
    name: 'Cosmetic Bags',
    desc: 'Sleek luxury storage for your beauty essentials. Featuring premium water-resistant interior lining, custom organization compartments, and heavy gold-finished zippers.',
    img: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800&auto=format&fit=crop&q=80',
    slug: 'cosmetic-bags'
  },
  {
    name: 'Jewelry Accessories',
    desc: 'Exquisite jewelry pieces crafted from hypoallergenic 18k sterling gold plating and natural freshwater pearls, suspending romance down your collars.',
    img: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800&auto=format&fit=crop&q=80',
    slug: 'jewelry-accessories'
  },
  {
    name: 'Fashion Accessories',
    desc: 'Premium accents designed to refine luxury. Discover standard Japanese Quartz watches matching sandblast rose-gold dials, amber sunglasses, and pure mulberry silk scrunchies.',
    img: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800&auto=format&fit=crop&q=80',
    slug: 'fashion-accessories'
  }
];

export default function Categories() {
  const { products, setPage, setCategoryFilter, categories = [] } = useApp();

  const handleCategoryClimb = (catName: string) => {
    setCategoryFilter(catName);
    setPage('Shop');
  };

  const displayCategories = categories.length > 0 ? categories : CATEGORY_META;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 font-sans text-left">
      
      {/* Page Header text details */}
      <div className="space-y-2 mb-12 text-center">
        <span className="text-rose-455 text-xs font-semibold uppercase tracking-[0.2em] inline-flex items-center gap-1">
          <Sparkles className="w-3 h-3" />
          <span>Curated Compartments</span>
        </span>
        <h1 className="text-3xl md:text-4xl font-sans tracking-tight text-zinc-900 dark:text-white font-light">
          Torvi Fashion <span className="font-serif italic text-rose-400">Chapters</span>
        </h1>
        <p className="text-xs text-zinc-500 max-w-md mx-auto leading-relaxed">
          Navigate our precise 7-module inventory. Discover signature craftsmanship adapted to separate daily wardrobes.
        </p>
      </div>

      {/* Categories Visual List */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {displayCategories.map((cat, idx) => {
          const matchingCount = products.filter((p) => p.category === cat.name).length;

          return (
            <div
              key={idx}
              className="group bg-[#FFFFFF] dark:bg-[#FFFFFF] rounded-3xl overflow-hidden border border-[#D4AF37]/50 shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
            >
              <div className="relative aspect-[3/2] overflow-hidden bg-zinc-50">
                <img
                  src={cat.img}
                  alt={cat.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  referrerPolicy="no-referrer"
                />
                
                {/* Visual Glass counts tag */}
                <div className="absolute bottom-4 left-4 p-2 py-1 bg-zinc-950/80 text-white rounded text-[10px] font-mono tracking-wider flex items-center space-x-1">
                  <FolderHeart className="w-3.5 h-3.5 text-rose-450" />
                  <span>{matchingCount} IN STOCK</span>
                </div>
              </div>

              {/* Informational descriptions text */}
              <div className="p-6 flex flex-col flex-1 justify-between space-y-4 bg-[#FFFFFF] dark:bg-[#FFFFFF]">
                <div className="space-y-1">
                  <h3 className="text-lg font-medium text-zinc-900 dark:text-zinc-900 font-sans">
                    {cat.name}
                  </h3>
                  <p className="text-xs text-zinc-500 dark:text-zinc-600 leading-relaxed font-sans line-clamp-3">
                    {cat.desc}
                  </p>
                </div>

                <button
                  id={`cat-climb-${cat.slug}`}
                  onClick={() => handleCategoryClimb(cat.name)}
                  className="w-full group/btn py-2.5 bg-[#FCFAF8] dark:bg-[#FCFAF8] hover:bg-[#D4AF37] dark:hover:bg-[#D4AF37] text-zinc-900 dark:text-zinc-900 hover:text-white dark:hover:text-white text-xs font-semibold uppercase tracking-wider rounded border border-zinc-200 dark:border-zinc-200 transition-all duration-200 flex items-center justify-center space-x-1.5"
                >
                  <span>Select {cat.name}</span>
                  <ArrowRight className="w-3.5 h-3.5 transform group-hover/btn:translate-x-1 transition-transform" />
                </button>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
}
