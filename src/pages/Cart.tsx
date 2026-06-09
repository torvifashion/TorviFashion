import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ShoppingBag, X, Plus, Minus, Tag, ArrowRight, ShieldCheck, ShoppingCart } from 'lucide-react';

export default function Cart() {
  const {
    cart,
    appliedCoupon,
    setPage,
    updateCartQuantity,
    removeFromCart,
    applyCoupon,
    removeCoupon,
    formatPrice
  } = useApp();

  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState<string | null>(null);
  const [couponSuccess, setCouponSuccess] = useState<boolean>(false);

  // Subtotal calculation
  const subtotal = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);

  // Discount calculation
  let discountValue = 0;
  let couponRejectedMessage = '';

  if (appliedCoupon) {
    if (subtotal < appliedCoupon.minSpend) {
      discountValue = 0;
      couponRejectedMessage = `Disqualified! Minimum spend must be at least $${appliedCoupon.minSpend} to use ${appliedCoupon.code}.`;
    } else {
      if (appliedCoupon.type === 'percentage') {
        discountValue = (subtotal * appliedCoupon.value) / 100;
      } else {
        discountValue = appliedCoupon.value;
      }
    }
  }

  // Shipping policies: Free over $150
  const isFreeShipping = subtotal >= 150;
  const shippingCharge = cart.length === 0 ? 0 : isFreeShipping ? 0 : 10;
  const grandTotal = Math.max(0, subtotal - discountValue + shippingCharge);

  const handleCouponSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError(null);
    setCouponSuccess(false);

    if (!couponInput.trim()) return;

    const errMsg = await applyCoupon(couponInput);
    if (errMsg) {
      setCouponError(errMsg);
    } else {
      setCouponSuccess(true);
      setCouponInput('');
    }
  };

  const handleCheckoutTrigger = () => {
    if (couponRejectedMessage) {
      removeCoupon();
    }
    setPage('Checkout');
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center space-y-5 font-sans">
        <div className="w-16 h-16 rounded-full bg-rose-50 dark:bg-zinc-805 flex items-center justify-center mx-auto text-rose-400">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <div className="space-y-1">
          <h2 className="text-xl font-medium text-zinc-900 dark:text-white">Your Shopping Cart is Empty</h2>
          <p className="text-xs text-zinc-505 max-w-xs mx-auto">
            You haven't added any luxury accessories to your styling shelf yet.
          </p>
        </div>
        <button
          id="cart-empty-shop-now"
          onClick={() => setPage('Shop')}
          className="px-6 py-2.5 bg-zinc-90 w-auto text-white dark:bg-zinc-800 rounded font-sans text-xs uppercase tracking-wider font-semibold hover:bg-rose-455 transition shadow-sm"
        >
          Explore Boutique Catalog
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 font-sans text-left">
      
      {/* Page Title details */}
      <h1 className="text-3xl font-sans tracking-tight text-zinc-900 dark:text-white font-light mb-8">
        Your Shopping <span className="font-serif italic text-rose-400">Bag Shelf</span>
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        
        {/* LEFT COLUMN: SELECTED ACCESSORIES LIST */}
        <div className="lg:col-span-8 space-y-6">
          
          <div className="space-y-4">
            {cart.map((item, idx) => {
              const itemTotal = item.product.price * item.quantity;
              return (
                <div
                  key={`${item.product.id}-${item.selectedColor}-${idx}`}
                  className="flex flex-col sm:flex-row items-stretch sm:items-center bg-[#ffffff] text-[#000000] p-5 rounded-[20px] border border-zinc-150 shadow-xs justify-between gap-4"
                >
                  
                  {/* Image details */}
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 rounded-xl overflow-hidden bg-zinc-50 flex-shrink-0 border border-zinc-150">
                      <img
                        src={item.product.imageUrl}
                        alt={item.product.name}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div className="text-left leading-tight">
                      <span className="text-[10px] text-rose-405 font-medium uppercase font-sans tracking-wider block">
                        {item.product.category}
                      </span>
                      <h3 className="text-sm font-semibold text-black line-clamp-1 py-0.5">
                        {item.product.name}
                      </h3>
                      <div className="flex items-center space-x-2 text-xs text-zinc-500">
                        <span>Color:</span>
                        <span className="font-semibold text-zinc-700 bg-zinc-100 px-1.5 py-0.5 rounded text-[10px]">
                          {item.selectedColor}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Pricing and Steppers section */}
                  <div className="flex items-center justify-between sm:justify-start gap-6 border-t sm:border-t-0 pt-3 sm:pt-0">
                    
                    {/* Stepper */}
                    <div className="flex items-center border border-zinc-200 bg-zinc-50 rounded-lg overflow-hidden w-24 justify-between shrink-0">
                      <button
                        id={`cart-qty-dec-${item.product.id}-${idx}`}
                        onClick={() => updateCartQuantity(item.product.id, item.selectedColor, item.quantity - 1)}
                        className="p-1.5 text-zinc-500 hover:bg-zinc-200 transition"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="font-mono text-xs text-black font-bold select-none">
                        {item.quantity}
                      </span>
                      <button
                        id={`cart-qty-inc-${item.product.id}-${idx}`}
                        onClick={() => updateCartQuantity(item.product.id, item.selectedColor, item.quantity + 1)}
                        className="p-1.5 text-zinc-500 hover:bg-zinc-200 transition"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    {/* Unit/Total Rate */}
                    <div className="text-right min-w-[70px]">
                      <span className="text-[10px] text-zinc-400 block tracking-wider font-mono">Unit: {formatPrice(item.product.price)}</span>
                      <span className="text-xs font-semibold text-black font-mono">
                        {formatPrice(itemTotal)}
                      </span>
                    </div>

                    {/* Remove Action */}
                    <button
                      id={`cart-remove-${item.product.id}-${idx}`}
                      onClick={() => removeFromCart(item.product.id, item.selectedColor)}
                      className="p-1.5 text-zinc-400 hover:text-red-500 hover:bg-zinc-50 rounded transition-colors"
                      title="Remove product"
                    >
                      <X className="w-4 h-4" />
                    </button>

                  </div>

                </div>
              );
            })}
          </div>

          {/* Quick instructions bar */}
          <div className="p-5 bg-[#ffffff] text-black border border-zinc-150 rounded-[20px] shadow-xs text-xs flex items-start space-x-2">
            <ShieldCheck className="w-4.5 h-4.5 text-emerald-500 shrink-0 mt-0.5" />
            <p className="leading-relaxed font-sans text-zinc-700">
              <strong className="text-black">Torvi Delivery Protocol:</strong> We support bKash, SSLCommerz gateway systems, Nagad, Rocket, and cash-payment-on-delivery. Enjoy complimentary luxury box giftwrapping standard for order lists values exceeding $150.
            </p>
          </div>

        </div>

        {/* RIGHT COLUMN: PRICING LOGS & COUPON INPUTS */}
        <div className="lg:col-span-4 space-y-6 select-none">
          
          {/* A. Apply Coupon board */}
          <div className="bg-[#ffffff] text-[#000000] border border-zinc-150 rounded-[20px] p-6 space-y-4 shadow-sm">
            <h3 className="text-xs font-bold tracking-widest uppercase text-black">
              Apply Discount Coupon
            </h3>
            
            {appliedCoupon ? (
              <div className="p-4 bg-emerald-50/50 border border-emerald-150 rounded-xl space-y-2 text-left">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-emerald-700 border border-emerald-200 bg-white px-2 py-0.5 rounded shadow-xs">
                    {appliedCoupon.code}
                  </span>
                  <button
                    id="cart-remove-coupon-btn"
                    onClick={removeCoupon}
                    className="text-[10px] text-red-500 hover:underline px-1.5 py-0.5 pointer-events-auto bg-transparent border-none cursor-pointer"
                  >
                    Remove
                  </button>
                </div>
                <p className="text-[11px] text-zinc-700 leading-relaxed font-sans">
                  {appliedCoupon.description}
                </p>
                {couponRejectedMessage ? (
                  <p className="text-[10px] font-bold text-red-500 font-sans tracking-wide">
                    ⚠️ {couponRejectedMessage}
                  </p>
                ) : (
                  <p className="text-[10px] font-semibold text-emerald-600 flex items-center gap-1">
                    ✓ Valid Coupon Activated: Subtracting{' '}
                    {appliedCoupon.type === 'percentage'
                      ? `${appliedCoupon.value}%`
                      : `${formatPrice(appliedCoupon.value)}`}
                  </p>
                )}
              </div>
            ) : (
              <form onSubmit={handleCouponSubmit} className="flex gap-1.5">
                <input
                  id="cart-coupon-input"
                  type="text"
                  placeholder="WELCOME10"
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                  className="flex-1 px-3 py-2 text-xs bg-zinc-50 border border-zinc-200 rounded text-black uppercase tracking-wider focus:outline-none focus:border-rose-300 font-mono"
                />
                <button
                  id="cart-coupon-apply-btn"
                  type="submit"
                  className="px-4 py-2 bg-black hover:bg-zinc-805 text-white rounded font-sans text-xs uppercase tracking-wider font-semibold transition cursor-pointer"
                >
                  Apply
                </button>
              </form>
            )}

            {couponError && (
              <p className="text-[10px] font-semibold text-red-500 text-left font-sans">
                ⚠️ {couponError}
              </p>
            )}
            
            {couponSuccess && (
              <p className="text-[10px] font-semibold text-emerald-500 text-left font-sans">
                ✓ Coupon registered successfully!
              </p>
            )}
            
            {/* Quick help lists */}
            <div className="text-[10px] text-zinc-500 text-left space-y-1 font-sans">
              <span className="block font-semibold text-zinc-650 select-none">Active boutique test coupons:</span>
              <ul className="list-disc pl-3 text-zinc-500 space-y-0.5 leading-relaxed">
                <li><span className="font-mono text-zinc-700 font-semibold">WELCOME10</span> (10% Off over $50)</li>
                <li><span className="font-mono text-zinc-700 font-semibold">ELEGANCE20</span> (20% Off over $150)</li>
                <li><span className="font-mono text-zinc-700 font-semibold">BOUTIQUE30</span> (Flat $30 Off over $200)</li>
              </ul>
            </div>
          </div>

          {/* B. Checkout Invoices calculation log */}
          <div className="bg-[#ffffff] text-[#000000] border border-zinc-150 rounded-[20px] p-6 space-y-4 text-left shadow-sm">
            <h3 className="text-xs font-bold tracking-widest uppercase text-black">
              Pricing Summary Ledger
            </h3>

            <div className="space-y-3 pt-2 text-xs font-sans text-[#000000]/70">
              
              <div className="flex justify-between items-center">
                <span className="text-zinc-500">Articles Subtotal</span>
                <span className="font-mono font-semibold text-black">
                  {formatPrice(subtotal)}
                </span>
              </div>

              {discountValue > 0 && (
                <div className="flex justify-between items-center text-emerald-600 font-semibold font-mono font-bold">
                  <span>Coupon Discount ({appliedCoupon?.code})</span>
                  <span>
                    -{formatPrice(discountValue)}
                  </span>
                </div>
              )}

              <div className="flex justify-between items-center">
                <span className="text-zinc-500">Shipping Dispatch</span>
                {isFreeShipping ? (
                  <span className="text-emerald-600 font-bold uppercase tracking-wider text-[10px]">
                    FREE OVER {formatPrice(150)}
                  </span>
                ) : (
                  <span className="font-mono font-semibold text-black">
                    {formatPrice(shippingCharge)}
                  </span>
                )}
              </div>

              {/* Free shipping progress bar metric */}
              {!isFreeShipping && (
                <div className="space-y-1 bg-zinc-50 p-2.5 rounded-xl border border-zinc-150 text-[10px]">
                  <div className="flex justify-between text-zinc-500">
                    <span>Free courier dispatch progress</span>
                    <span>{formatPrice(subtotal)} / {formatPrice(150)}</span>
                  </div>
                  <div className="w-full bg-zinc-200 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-black h-1.5 rounded-full"
                      style={{ width: `${Math.min(100, (subtotal / 150) * 100)}%` }}
                    />
                  </div>
                </div>
              )}

              <div className="border-t border-zinc-150 pt-3 flex justify-between items-center text-sm font-bold text-black border-dashed">
                <span className="text-black font-semibold">Net Invoice Total</span>
                <span className="font-mono text-lg font-extrabold text-[#000000]">
                  {formatPrice(grandTotal)}
                </span>
              </div>

            </div>

            {/* Checkout Action button */}
            <button
              id="cart-checkout-action-btn"
              onClick={handleCheckoutTrigger}
              className="w-full py-3.5 bg-black hover:bg-zinc-800 text-white text-xs uppercase tracking-widest font-semibold rounded-[20px] shadow-xs hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center space-x-1.5 mt-4 cursor-pointer"
            >
              <span>Continue to Secure Checkout</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
