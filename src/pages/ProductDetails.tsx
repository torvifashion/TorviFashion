import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import ProductCard from '../components/ProductCard';
import { Product } from '../types';
import { ArrowLeft, Star, ShoppingBag, Heart, User, Check, Send, ShieldAlert, BadgeInfo } from 'lucide-react';

export default function ProductDetails() {
  const { id } = useParams<{ id: string }>();
  const {
    products,
    selectedProductId,
    user,
    setPage,
    addToCart,
    toggleWishlist,
    isInWishlist,
    postReview,
    formatPrice
  } = useApp();

  const [product, setProduct] = useState<Product | null>(null);
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);
  const [reviewRating, setReviewRating] = useState<number>(5);
  const [reviewComment, setReviewComment] = useState<string>('');
  const [isSubmitSuccess, setIsSubmitSuccess] = useState<boolean>(false);

  // Sync state if selectedProductId or route params transition
  useEffect(() => {
    const activeId = id || selectedProductId;
    if (activeId) {
      const found = products.find((p) => p.id === activeId);
      if (found) {
        setProduct(found);
        setSelectedColor(found.colors?.[0] || 'Standard');
        setQuantity(1);
        setIsSubmitSuccess(false);
        setReviewComment('');
        setReviewRating(5);
      }
    }
  }, [id, selectedProductId, products]);

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center space-y-4">
        <BadgeInfo className="w-12 h-12 text-rose-300 mx-auto" />
        <h2 className="text-xl font-medium text-zinc-900 dark:text-white">Product index not loaded</h2>
        <button
          onClick={() => setPage('Shop')}
          className="px-4 py-2 bg-zinc-900 text-white rounded text-xs uppercase"
        >
          Return to Shop catalog
        </button>
      </div>
    );
  }

  const outOfStock = product.stock <= 0;
  const isWish = isInWishlist(product.id);

  // Filter related list
  const related = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  const handleQtyDec = () => setQuantity((prev) => Math.max(1, prev - 1));
  const handleQtyInc = () => setQuantity((prev) => Math.min(product.stock, prev + 1));

  const handleAddToCart = () => {
    if (outOfStock) return;
    addToCart(product, quantity, selectedColor);
    
    // Quick simple animation feedback triggers could go here
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    await postReview(product.id, reviewRating, reviewComment);
    setIsSubmitSuccess(true);
    setReviewComment('');
    setReviewRating(5);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 font-sans text-left">
      
      {/* 1. Back button trigger */}
      <button
        id="btn-back-to-shop"
        onClick={() => setPage('Shop')}
        className="mb-8 inline-flex items-center space-x-1.5 text-xs font-semibold uppercase tracking-wider text-zinc-500 hover:text-rose-500 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Product Catalog</span>
      </button>

      {/* 2. Main Columns: Photo Carousel + Specs Board */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-start mb-16">
        
        {/* Left Side: Product Image Display */}
        <div className="md:col-span-6 space-y-4">
          <div className="relative aspect-square overflow-hidden rounded-3xl border border-zinc-100 dark:border-zinc-805 bg-zinc-50 dark:bg-zinc-950 shadow-sm">
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            {outOfStock && (
              <div className="absolute inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center">
                <span className="px-4 py-2 bg-zinc-950 text-white font-bold tracking-widest text-xs rounded-lg">
                  SOLD OUT
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Interactive Specs Panel */}
        <div className="md:col-span-6 space-y-6">
          
          <div className="space-y-1.5">
            <span className="text-xs font-semibold tracking-widest text-rose-500 uppercase font-sans">
              {product.category}
            </span>
            <h1 className="text-3xl font-sans tracking-tight text-zinc-900 dark:text-white font-light">
              {product.name}
            </h1>
            
            <div className="flex items-center space-x-2 pt-1">
              <div className="flex items-center text-amber-400">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < Math.floor(product.rating) ? 'fill-amber-400' : 'text-zinc-200 dark:text-zinc-700'
                    }`}
                  />
                ))}
              </div>
              <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 font-mono">
                {product.rating} / 5.0 • ({product.reviewCount} verified client reviews)
              </span>
            </div>
          </div>

          <div className="text-2xl font-semibold text-zinc-900 dark:text-white font-mono">
            {formatPrice(product.price)}
          </div>

          <p className="text-xs sm:text-sm text-zinc-650 dark:text-zinc-350 leading-relaxed font-sans">
            {product.description}
          </p>

          {/* Color Selection checklist */}
          {product.colors && product.colors.length > 0 && (
            <div className="space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300">
                Option Color: <span className="text-rose-500 font-normal">{selectedColor}</span>
              </span>
              <div className="flex flex-wrap gap-2">
                {product.colors.map((color) => (
                  <button
                    key={color}
                    id={`color-select-${color.replace(/\s+/g, '-').toLowerCase()}`}
                    onClick={() => setSelectedColor(color)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition flex items-center space-x-1.5 ${
                      selectedColor === color
                        ? 'border-rose-455 bg-rose-50/50 dark:bg-rose-950/20 text-rose-500 ring-1 ring-rose-400'
                        : 'border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-350 bg-white dark:bg-zinc-900 hover:bg-zinc-50 dark:hover:bg-zinc-800'
                    }`}
                  >
                    {selectedColor === color && <Check className="w-3 h-3" />}
                    <span>{color}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Built-in Features Bullets list */}
          {product.features && product.features.length > 0 && (
            <div className="p-4 rounded-2xl bg-stone-50/50 dark:bg-zinc-900 border border-zinc-150 dark:border-zinc-805 space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-850 dark:text-zinc-200">
                Boutique Craft Specifications
              </h4>
              <ul className="space-y-1.5 text-xs text-zinc-500 dark:text-zinc-400 font-sans">
                {product.features.map((feat, i) => (
                  <li key={i} className="flex items-start space-x-1.5">
                    <span className="text-rose-400 shrink-0 select-none">•</span>
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Inventory warnings and cart triggers */}
          <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800 space-y-4">
            
            {/* Stock details */}
            <div className="flex items-center space-x-2 text-xs font-mono">
              <span className="text-zinc-400 font-sans">Inventory Status:</span>
              {outOfStock ? (
                <span className="text-red-500 font-bold">SOLD OUT</span>
              ) : product.stock <= 5 ? (
                <span className="text-amber-500 font-bold animate-pulse">
                  CRITICAL BULK: ONLY {product.stock} PIECES REMAINING!
                </span>
              ) : (
                <span className="text-emerald-500 font-bold">{product.stock} ITEMS AVAILABLE</span>
              )}
            </div>

            {/* Quantity Stepper + Cart/Wishlist actions */}
            {!outOfStock && (
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                
                {/* Stepper */}
                <div className="flex items-center border border-zinc-200 dark:border-zinc-750 bg-zinc-50 dark:bg-zinc-90 w-32 justify-between rounded-lg overflow-hidden shrink-0">
                  <button
                    id="details-qty-dec"
                    onClick={handleQtyDec}
                    className="px-3 py-2 text-zinc-500 hover:bg-zinc-150 dark:hover:bg-zinc-800 transition"
                  >
                    -
                  </button>
                  <span className="font-mono text-sm text-zinc-900 dark:text-white font-bold">
                    {quantity}
                  </span>
                  <button
                    id="details-qty-inc"
                    onClick={handleQtyInc}
                    className="px-3 py-2 text-zinc-500 hover:bg-zinc-150 dark:hover:bg-zinc-800 transition"
                  >
                    +
                  </button>
                </div>

                {/* Main trigger */}
                <button
                  id="details-add-to-cart"
                  onClick={handleAddToCart}
                  className="flex-1 py-3 px-6 bg-zinc-900 hover:bg-rose-455 hover:scale-[1.01] active:scale-[0.99] dark:bg-white dark:hover:bg-rose-50 text-white dark:text-zinc-900 text-xs uppercase tracking-wider font-semibold rounded-lg shadow-md transition-all flex items-center justify-center space-x-2"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Secure Add To Cart</span>
                </button>

                {/* Wishlist toggle */}
                <button
                  id="details-favorite-toggle"
                  onClick={() => toggleWishlist(product)}
                  className={`p-3 rounded-lg border transition ${
                    isWish
                      ? 'border-rose-400 bg-rose-50 dark:bg-rose-955/20 text-rose-500'
                      : 'border-zinc-200 dark:border-zinc-700 text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800'
                  }`}
                  title={isWish ? 'Remove from wishlist' : 'Add to wishlist'}
                >
                  <Heart className={`w-4 h-4 ${isWish ? 'fill-rose-500 text-rose-500' : ''}`} />
                </button>

              </div>
            )}

          </div>

        </div>

      </div>

      {/* 3. REVIEWS & RATINGS BOARD */}
      <section className="py-10 border-t border-zinc-100 dark:border-zinc-800 grid grid-cols-1 lg:grid-cols-12 gap-12 items-start mb-16">
        
        {/* Left Col: Reviews list mappings */}
        <div className="lg:col-span-7 space-y-6 text-left">
          <h3 className="text-lg font-medium text-zinc-905 dark:text-white">
            Client Feedbacks ({product.reviews?.length || 0})
          </h3>

          {product.reviews && product.reviews.length > 0 ? (
            <div className="space-y-4 max-h-[420px] overflow-y-auto pr-2">
              {product.reviews.map((rev) => (
                <div
                  key={rev.id}
                  className="p-4 rounded-2xl bg-stone-50/50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800"
                >
                  <div className="flex items-center justify-between gap-2.5 mb-2">
                    <div className="flex items-center space-x-2.5">
                      <div className="w-8 h-8 rounded-full bg-zinc-100 dark:bg-zinc-850 flex items-center justify-center text-zinc-400">
                        <User className="w-4.5 h-4.5" />
                      </div>
                      <div className="text-left leading-tight">
                        <span className="text-xs font-bold text-zinc-855 dark:text-zinc-200 block">
                          {rev.userName}
                        </span>
                        <span className="text-[10px] text-zinc-400 font-mono">{rev.date}</span>
                      </div>
                    </div>

                    <div className="flex items-center text-amber-400">
                      {Array.from({ length: 5 }).map((_, rIdx) => (
                        <Star
                          key={rIdx}
                          className={`w-3 h-3 ${rIdx < rev.rating ? 'fill-amber-400' : 'text-zinc-100 dark:text-zinc-700'}`}
                        />
                      ))}
                    </div>
                  </div>

                  <p className="text-xs text-zinc-600 dark:text-zinc-450 leading-relaxed font-sans pl-2.5">
                    "{rev.comment}"
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center text-xs text-zinc-400 bg-stone-50/50 dark:bg-zinc-900 rounded-xl border border-dotted border-zinc-200 dark:border-zinc-800 font-sans">
              No testimonials logged yet for this piece. Be the first to append feedback below.
            </div>
          )}

        </div>

        {/* Right Col: Write feedback form */}
        <div className="lg:col-span-5 bg-white dark:bg-zinc-900 border border-zinc-150 dark:border-zinc-808 p-6 rounded-2xl space-y-4">
          <h3 className="text-sm font-bold tracking-widest uppercase text-zinc-930 dark:text-white">
            Write verified feedback
          </h3>

          {!user ? (
            <div className="p-4 rounded-xl bg-rose-50/50 dark:bg-rose-955/10 border border-rose-100 dark:border-rose-950/40 text-left space-y-3">
              <ShieldAlert className="w-4.5 h-4.5 text-rose-455 inline mr-1" />
              <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed inline">
                For spam prevention purposes, you must be catalog logged inside the boutique profile systems to post reviews.
              </p>
              <button
                id="review-login-action"
                onClick={() => setPage('Login')}
                className="w-full py-2 bg-zinc-900 text-white rounded text-xs font-semibold uppercase tracking-wider"
              >
                Access Account Login
              </button>
            </div>
          ) : isSubmitSuccess ? (
            <div className="p-4 bg-emerald-50 dark:bg-emerald-950/25 text-emerald-600 dark:text-emerald-400 text-xs rounded-xl text-center space-y-2">
              <p>🎉 Testimonial successfully written onto server db structures!</p>
              <button
                id="submit-another-review"
                onClick={() => setIsSubmitSuccess(false)}
                className="text-xs font-bold underline cursor-pointer"
              >
                Submit another feedback response
              </button>
            </div>
          ) : (
            <form onSubmit={handleReviewSubmit} className="space-y-4 text-left">
              
              {/* Rating Select stepper */}
              <div className="space-y-2">
                <label className="text-xs font-sans text-zinc-400 block tracking-wide">
                  Overall Score Points ({reviewRating} / 5)
                </label>
                <div className="flex items-center space-x-1">
                  {Array.from({ length: 5 }).map((_, star) => (
                    <button
                      key={star}
                      type="button"
                      id={`star-btn-${star + 1}`}
                      onClick={() => setReviewRating(star + 1)}
                      className="text-amber-400 hover:scale-110 active:scale-95 transition"
                    >
                      <Star
                        className={`w-6 h-6 ${
                          star < reviewRating ? 'fill-amber-400' : 'text-zinc-200 dark:text-zinc-700'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Comment text block */}
              <div className="space-y-1.5">
                <label className="text-xs text-zinc-400 font-sans tracking-wide">Your comment feedback details</label>
                <textarea
                  id="review-comment-textarea"
                  rows={4}
                  required
                  placeholder="Detail your fitting experience with this handbag or accessories..."
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-white rounded border border-zinc-200 dark:border-zinc-800 focus:outline-none focus:border-rose-455"
                />
              </div>

              <button
                id="submit-review-form"
                type="submit"
                className="w-full py-2.5 bg-zinc-950 hover:bg-rose-455 text-white rounded text-xs uppercase tracking-widest font-semibold transition-colors flex items-center justify-center space-x-1.5 shadow-sm"
              >
                <span>Publish Feedback</span>
                <Send className="w-3.5 h-3.5" />
              </button>

            </form>
          )}

        </div>
      </section>

      {/* 4. RECOMMENDATIONS RELATED PRODUCTS TABLE */}
      {related.length > 0 && (
        <section className="py-10 border-t border-zinc-100 dark:border-zinc-805">
          <div className="text-left space-y-1 mb-8">
            <span className="text-rose-455 text-xs font-semibold tracking-widest uppercase font-sans">
              More styling chapters
            </span>
            <h3 className="text-2xl font-light text-zinc-900 dark:text-white">
              Related <span className="font-serif italic text-rose-400">Assessments</span>
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {related.map((prod) => (
              <ProductCard key={prod.id} product={prod} />
            ))}
          </div>
        </section>
      )}

    </div>
  );
}
