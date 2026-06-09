import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import ProductCard from '../components/ProductCard';
import { Filter, SlidersHorizontal, Search, RotateCcw, ArrowUpDown } from 'lucide-react';

const CATEGORIES = [
  'All',
  'Handbags',
  'Shoulder Bags',
  'Tote Bags',
  'Crossbody Bags',
  'Cosmetic Bags',
  'Jewelry Accessories',
  'Fashion Accessories'
];

export default function Shop() {
  const {
    products,
    searchQuery,
    categoryFilter,
    priceRange,
    setSearchQuery,
    setCategoryFilter,
    setPriceRange,
    formatPrice
  } = useApp();

  const [localSearch, setLocalSearch] = useState(searchQuery);
  const [maxPriceLimit, setMaxPriceLimit] = useState(priceRange[1]);
  const [sortOption, setSortOption] = useState<string>('featured');
  const [showFiltersMobile, setShowFiltersMobile] = useState(false);

  // Sync state if global context query changes
  useEffect(() => {
    setLocalSearch(searchQuery);
  }, [searchQuery]);

  useEffect(() => {
    setMaxPriceLimit(priceRange[1]);
  }, [priceRange]);

  // Handle local filter updates
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchQuery(localSearch);
  };

  const handleResetFilters = () => {
    setLocalSearch('');
    setSearchQuery('');
    setCategoryFilter('All');
    setPriceRange([0, 300]);
    setMaxPriceLimit(300);
    setSortOption('featured');
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    setMaxPriceLimit(val);
    setPriceRange([priceRange[0], val]);
  };

  // Filter & Sort Logic
  const filteredProducts = products.filter((p) => {
    const matchSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        p.category.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchCategory = categoryFilter === 'All' ? true : p.category === categoryFilter;
    const matchPrice = p.price >= priceRange[0] && p.price <= priceRange[1];

    return matchSearch && matchCategory && matchPrice;
  }).sort((a, b) => {
    if (sortOption === 'price-low') return a.price - b.price;
    if (sortOption === 'price-high') return b.price - a.price;
    if (sortOption === 'rating') return b.rating - a.rating;
    if (sortOption === 'newest') return (b.isNewArrival ? 1 : 0) - (a.isNewArrival ? 1 : 0);
    return 0; // featured/standard sorting
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 font-sans">
      
      {/* Top Banner Details */}
      <div className="text-left mb-8 border-b border-brand-border dark:border-brand-dark-border pb-5 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <span className="text-xs uppercase tracking-widest text-[#D4AF37] font-bold">Discover Fashion</span>
          <h1 className="text-3xl font-sans tracking-tight text-brand-charcoal dark:text-white font-light mt-1">
            Torvi <span className="font-serif italic text-[#D4AF37]">Curated Fashion Catalog</span>
          </h1>
        </div>
        
        {/* Active Breadcrumb info */}
        <div className="text-xs text-zinc-500 font-mono">
          <span>Catalog / </span>
          <span className="text-brand-pink-dark font-bold">{categoryFilter}</span>
          <span> ({filteredProducts.length} items found)</span>
        </div>
      </div>

      {/* Main Grid: Filters Sidebar + Catalog Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LEFT COLUMN: FILTERS SIDEBAR (DESKTOP) */}
        <aside className="hidden lg:col-span-3 lg:block space-y-8 select-none">
          
          {/* 1. Search block */}
          <div className="bg-white dark:bg-white border border-[#D4AF37]/40 p-5 rounded-none space-y-3 shadow-xs">
            <h3 className="text-xs font-bold tracking-widest uppercase text-[#111111]">
              Filter By Title
            </h3>
            <form onSubmit={handleSearchSubmit} className="relative">
              <input
                id="shop-sidebar-search"
                type="text"
                placeholder="Type keyword & press enter..."
                value={localSearch}
                onChange={(e) => setLocalSearch(e.target.value)}
                className="w-full px-3 py-2.5 pl-8 text-xs rounded-none border border-[#D4AF37]/30 bg-white text-[#111111] placeholder-zinc-450 focus:outline-none focus:border-[#D4AF37] font-sans"
              />
              <Search className="w-3.5 h-3.5 text-[#111111] absolute left-2.5 top-3.5" />
            </form>
          </div>

          {/* 2. Category list */}
          <div className="bg-white dark:bg-white border border-[#D4AF37]/40 p-5 rounded-none space-y-4 shadow-xs">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold tracking-widest uppercase text-[#111111]">
                Accessories Segment
              </h3>
              <Filter className="w-3.5 h-3.5 text-[#D4AF37]" />
            </div>
            
            <div className="flex flex-col space-y-1.5">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  id={`shop-cat-btn-${cat.replace(/\s+/g, '-').toLowerCase()}`}
                  onClick={() => setCategoryFilter(cat)}
                  className={`text-left text-xs px-3 py-2.5 rounded-none font-sans font-medium tracking-wide transition-all duration-150 flex items-center justify-between border cursor-pointer ${
                    categoryFilter === cat
                      ? 'bg-neutral-50 dark:bg-neutral-50 text-[#111111] dark:text-[#111111] font-bold border-[#D4AF37] dark:border-[#D4AF37] ring-1 ring-[#D4AF37]/30 shadow-xs'
                      : 'bg-white dark:bg-white text-neutral-800 dark:text-neutral-800 border-[#D4AF37]/25 dark:border-[#D4AF37]/25 hover:border-[#D4AF37] hover:bg-neutral-50'
                  }`}
                >
                  <span className={categoryFilter === cat ? 'text-[#111111] font-bold' : 'text-neutral-700'}>{cat}</span>
                  <span className={`text-[10px] font-mono font-bold ${categoryFilter === cat ? 'text-[#D4AF37]' : 'text-neutral-500'}`}>
                    ({products.filter((p) => cat === 'All' ? true : p.category === cat).length})
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* 3. Price Filter */}
          <div className="bg-white dark:bg-white border border-[#D4AF37]/40 p-5 rounded-none space-y-4 shadow-xs">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold tracking-widest uppercase text-[#111111]">
                Price Budget Limit
              </h3>
              <SlidersHorizontal className="w-3.5 h-3.5 text-[#D4AF37]" />
            </div>

            <div className="space-y-3">
              <input
                id="shop-price-slider"
                type="range"
                min="0"
                max="300"
                step="5"
                value={maxPriceLimit}
                onChange={handlePriceChange}
                className="w-full accent-[#D4AF37] cursor-pointer h-1.5 bg-neutral-200"
              />
              <div className="flex items-center justify-between text-xs text-zinc-600 font-mono">
                <span> {formatPrice(0)} </span>
                <span className="font-bold text-[#111111] dark:text-[#111111] bg-white dark:bg-white border border-[#D4AF37] px-2.5 py-1 rounded-none">
                  Max: {formatPrice(maxPriceLimit)}
                </span>
                <span> {formatPrice(300)} </span>
              </div>
            </div>
          </div>

          {/* 4. Reset Button */}
          <button
            id="shop-reset-all"
            onClick={handleResetFilters}
            className="w-full py-3 border border-[#D4AF37]/50 dark:border-[#D4AF37]/50 bg-white dark:bg-white hover:bg-neutral-50 text-[#111111] dark:text-[#111111] rounded-none text-xs font-bold uppercase tracking-widest transition-all flex items-center justify-center space-x-1.5 cursor-pointer shadow-xs"
          >
            <RotateCcw className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>Reset All Filters</span>
          </button>

        </aside>

        {/* RIGHT COLUMN: CATALOG DISPLAY AREA */}
        <main className="lg:col-span-9 space-y-6">

          {/* UTILITY BAR: Sorting drop-downs/Mobile filters button */}
          <div className="bg-white dark:bg-brand-dark-card border border-brand-border dark:border-brand-dark-border rounded-none p-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs">
            
            {/* Sorting Dropdown */}
            <div className="flex items-center space-x-2 w-full sm:w-auto">
              <ArrowUpDown className="w-4 h-4 text-[#D4AF37] shrink-0" />
              <span className="text-xs text-zinc-400 shrink-0 uppercase tracking-wider">Sort By</span>
              <select
                id="shop-sort-select"
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                className="flex-1 sm:flex-none text-xs bg-[#FCFAF8] dark:bg-[#1C1A19] border border-brand-border dark:border-brand-dark-border rounded-none px-2.5 py-2 text-brand-charcoal dark:text-white focus:outline-none focus:ring-1 focus:ring-brand-gold font-sans"
              >
                <option value="featured">Featured Picks</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Top Customer Ratings</option>
                <option value="newest">Newest Accessories First</option>
              </select>
            </div>

            {/* Mobile Filters Toggle trigger */}
            <div className="lg:hidden flex items-center w-full justify-between sm:w-auto border-t sm:border-0 pt-3 sm:pt-0">
              <button
                id="mobile-filter-drawer-toggle"
                onClick={() => setShowFiltersMobile(!showFiltersMobile)}
                className="w-full sm:w-auto px-6 py-3 bg-brand-charcoal text-white rounded-none text-xs uppercase tracking-wider flex items-center justify-center space-x-1.5 font-bold"
              >
                <Filter className="w-3.5 h-3.5" />
                <span>{showFiltersMobile ? 'Close Filters' : 'Toggle Filters'}</span>
              </button>
            </div>
            
            {/* Active summary counts info */}
            <div className="hidden sm:block text-xs text-zinc-405 font-mono">
              Showing {filteredProducts.length} of {products.length} catalog items
            </div>
          </div>

          {/* DYNAMIC COLLAPSED FILTERS (MOBILE ONLY) */}
          {showFiltersMobile && (
            <div className="lg:hidden bg-white dark:bg-white p-6 rounded-none border border-[#D4AF37]/40 space-y-6 text-left shadow-sm">
              
              {/* Mobile Search */}
              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#111111]">Keyword</span>
                <form onSubmit={handleSearchSubmit} className="relative">
                  <input
                    id="mobile-shop-search"
                    type="text"
                    placeholder="Search keywords..."
                    value={localSearch}
                    onChange={(e) => setLocalSearch(e.target.value)}
                    className="w-full px-3 py-2.5 text-xs rounded-none border border-[#D4AF37]/30 bg-white text-[#111111] placeholder-zinc-400 focus:outline-none focus:border-[#D4AF37]"
                  />
                  <Search className="w-3.5 h-3.5 text-[#111111] absolute right-3 top-3" />
                </form>
              </div>

              {/* Mobile Categories list */}
              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#111111]">Category segment</span>
                <div className="flex flex-wrap gap-2">
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat}
                      id={`mobile-cat-pill-${cat.replace(/\s+/g, '-').toLowerCase()}`}
                      onClick={() => setCategoryFilter(cat)}
                      className={`px-3.5 py-2 text-xs font-medium rounded-none transition-all duration-150 border cursor-pointer ${
                        categoryFilter === cat
                          ? 'bg-neutral-50 dark:bg-neutral-50 text-[#111111] dark:text-[#111111] font-bold border-[#D4AF37] dark:border-[#D4AF37] ring-1 ring-[#D4AF37]/30'
                          : 'bg-white dark:bg-white text-[#111111] border-[#D4AF37]/25 dark:border-[#D4AF37]/25 hover:border-[#D4AF37]'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Mobile budget */}
              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#111111] block">Price budget limit</span>
                <input
                  id="mobile-price-slider"
                  type="range"
                  min="0"
                  max="300"
                  step="5"
                  value={maxPriceLimit}
                  onChange={handlePriceChange}
                  className="w-full accent-[#D4AF37] cursor-pointer h-1.5 bg-neutral-200"
                />
                <div className="flex justify-between text-xs text-zinc-650 font-mono">
                  <span> {formatPrice(0)} </span>
                  <span className="font-bold text-[#111111] bg-white border border-[#D4AF37] px-2 py-0.5">Max: {formatPrice(maxPriceLimit)}</span>
                  <span> {formatPrice(300)} </span>
                </div>
              </div>

              {/* Reset trigger */}
              <div className="pt-2 flex gap-2">
                <button
                  id="mobile-reset-filters"
                  onClick={() => { handleResetFilters(); setShowFiltersMobile(false); }}
                  className="flex-1 py-2.5 bg-neutral-50 text-[#111111] rounded-none text-xs uppercase tracking-widest font-bold transition-all border border-[#D4AF37]/45 cursor-pointer"
                >
                  Reset
                </button>
                <button
                  id="mobile-apply-filters"
                  onClick={() => { setSearchQuery(localSearch); setShowFiltersMobile(false); }}
                  className="flex-1 py-2.5 bg-white text-[#111111] rounded-none text-xs uppercase tracking-widest font-bold border border-[#D4AF37] cursor-pointer"
                >
                  Apply
                </button>
              </div>

            </div>
          )}

          {/* DYNAMIC PRODUCT CATALOG GRID */}
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 px-4 bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-xl space-y-4">
              <SlidersHorizontal className="w-12 h-12 text-zinc-300 mx-auto" />
              <h3 className="text-lg font-medium text-zinc-900 dark:text-white">
                No matching accessories found
              </h3>
              <p className="text-xs text-zinc-500 max-w-sm mx-auto leading-relaxed">
                We couldn't track down matching pieces for your current filters code. Adjust your search strings or widen budget caps.
              </p>
              <button
                id="catalog-reset-fallback"
                onClick={handleResetFilters}
                className="px-4 py-2 bg-zinc-900 hover:bg-rose-405 text-white text-xs font-bold uppercase tracking-widest rounded transition-colors shadow-xs"
              >
                View Full Boutique Catalog
              </button>
            </div>
          )}

        </main>

      </div>
    </div>
  );
}
