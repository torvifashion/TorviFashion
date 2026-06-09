import React from 'react';
import { useApp } from '../context/AppContext';
import { Product } from '../types';
import { Heart, ShoppingCart, Star, Eye } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  key?: any;
}

export default function ProductCard({ product }: ProductCardProps) {
  const {
    toggleWishlist,
    isInWishlist,
    addToCart,
    setPage,
    setSelectedProductId,
    formatPrice
  } = useApp();

  const isFav = isInWishlist(product.id);
  const outOfStock = product.stock <= 0;

  const handleProductClick = () => {
    setSelectedProductId(product.id);
    setPage('ProductDetails');
  };

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (outOfStock) return;
    const defaultColor = product.colors?.[0] || 'Standard';
    addToCart(product, 1, defaultColor);
    
    // Quick success visual confirmation can use toast alerts or generic text, we'll let cart visual animate.
  };

  return (
    <div
      onClick={handleProductClick}
      className="group bg-white dark:bg-brand-dark-card overflow-hidden border border-brand-border dark:border-brand-dark-border transition-all duration-300 cursor-pointer flex flex-col h-full hover:border-brand-gold hover:shadow-sm"
    >
      {/* Product Image Panel */}
      <div className="relative aspect-[1/1] overflow-hidden bg-brand-cream dark:bg-zinc-950 shrink-0 border-b border-brand-border dark:border-brand-dark-border">
        
        {/* Absolute Ribbon Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1 z-10 pointer-events-none">
          {outOfStock && (
            <span className="px-2 py-0.5 text-[9px] font-bold tracking-widest text-white bg-zinc-650 rounded-none uppercase">
              SOLD OUT
            </span>
          )}
          {!outOfStock && product.isBestSeller && (
            <span className="px-2 py-0.5 text-[9px] font-semibold tracking-widest text-white bg-brand-charcoal dark:bg-zinc-800 rounded-none uppercase">
              BESTSELLER
            </span>
          )}
          {!outOfStock && product.isNewArrival && (
            <span className="px-2 py-0.5 text-[9px] font-semibold tracking-widest text-white bg-brand-pink-dark rounded-none uppercase">
              NEW
            </span>
          )}
          {!outOfStock && product.isFeatured && (
            <span className="px-2 py-0.5 text-[9px] font-semibold tracking-widest text-white bg-brand-gold rounded-none uppercase">
              FEATURED
            </span>
          )}
        </div>

        {/* Favorite Wishlist Trigger - Sharp style */}
        <button
          id={`wishlist-toggle-${product.id}`}
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(product);
          }}
          className="absolute top-3 right-3 z-10 p-2 bg-black hover:bg-neutral-900 rounded-none shadow-xs active:scale-95 transition-all border border-[#D4AF37]"
          title={isFav ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <Heart className={`w-3.5 h-3.5 ${isFav ? 'fill-white text-white' : 'text-white'}`} style={{ color: '#FFFFFF', fill: isFav ? '#FFFFFF' : 'transparent' }} />
        </button>

        {/* Real Product Image Canvas */}
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
          referrerPolicy="no-referrer"
          loading="lazy"
        />

        {/* Interactive Hover Cover Details panel */}
        <div className="absolute inset-0 bg-brand-charcoal/10 dark:bg-black/35 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <button
            id={`view-details-hover-${product.id}`}
            onClick={handleProductClick}
            className="px-4 py-2 bg-brand-charcoal text-white hover:bg-neutral-800 font-sans text-[10px] font-bold tracking-widest uppercase rounded-none transition-colors shadow-sm"
            title="View Product Details"
          >
            Quick View
          </button>
        </div>

      </div>

      {/* Product Information Panel */}
      <div className="p-4 flex flex-col flex-1 justify-between bg-white dark:bg-brand-dark-card">
        
        <div className="text-left space-y-1">
          {/* Category */}
          <span className="text-[10px] font-bold tracking-[0.2em] text-brand-gold uppercase font-sans">
            {product.category}
          </span>
          
          {/* Title */}
          <h3 className="text-sm font-semibold tracking-wide text-brand-charcoal dark:text-white group-hover:text-brand-gold transition-colors line-clamp-1">
            {product.name}
          </h3>

          {/* Rating Summary */}
          <div className="flex items-center space-x-1.5 pt-0.5">
            <div className="flex items-center text-brand-gold">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`w-2.5 h-2.5 ${
                    i < Math.floor(product.rating) ? 'fill-brand-gold text-brand-gold' : 'text-zinc-200 dark:text-zinc-700'
                  }`}
                />
              ))}
            </div>
            <span className="text-[10px] font-semibold text-zinc-450 dark:text-zinc-500 font-mono">
              {product.rating}
            </span>
          </div>
        </div>

        {/* Pricing & Add To Cart utility */}
        <div className="flex items-center justify-between mt-4 pt-3 border-t border-brand-border dark:border-brand-dark-border">
          <div className="text-left">
            <span className="text-[9px] text-zinc-400 block tracking-widest uppercase font-mono">Value</span>
            <span className="text-sm font-bold text-brand-charcoal dark:text-white font-mono">
              {formatPrice(product.price)}
            </span>
          </div>

          <button
            id={`quick-add-btn-${product.id}`}
            onClick={handleQuickAdd}
            disabled={outOfStock}
            className={`p-2 rounded-none transition-all duration-200 border ${
              outOfStock
                ? 'bg-zinc-100 border-zinc-200 text-zinc-400 dark:bg-zinc-800 dark:border-zinc-800 cursor-not-allowed'
                : 'bg-brand-charcoal border-brand-charcoal hover:bg-white hover:text-brand-charcoal text-white dark:bg-zinc-800 dark:border-zinc-800 dark:hover:bg-brand-charcoal dark:hover:text-white transition-colors'
            }`}
            title={outOfStock ? 'Out of Stock' : 'Add to cart'}
          >
            <ShoppingCart className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>

    </div>
  );
}
