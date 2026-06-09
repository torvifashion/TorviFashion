import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Order } from '../types';
import { ShieldCheck, ArrowLeft, Loader2, Tag, Gift, CircleCheck, Search } from 'lucide-react';

export default function Checkout() {
  const {
    cart,
    appliedCoupon,
    user,
    setPage,
    submitOrder,
    trackOrder,
    formatPrice
  } = useApp();

  // Form states
  const [customerName, setCustomerName] = useState(user?.name || '');
  const [customerEmail, setCustomerEmail] = useState(user?.email || '');
  const [customerPhone, setCustomerPhone] = useState('');
  const [shippingAddress, setShippingAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'sslcommerz' | 'bkash' | 'nagad' | 'rocket' | 'cod'>('cod');
  const [notes, setNotes] = useState('');

  // Simulation overlays states
  const [isSimulatingPayment, setIsSimulatingPayment] = useState(false);
  const [simStep, setSimStep] = useState<'none' | 'prompt' | 'otp' | 'pin'>('none');
  const [simPhoneNumber, setSimPhoneNumber] = useState('');
  const [simOtp, setSimOtp] = useState('');
  const [simPin, setSimPin] = useState('');
  const [simCardNumber, setSimCardNumber] = useState('');
  
  // Placed Order details (for success screen)
  const [placedOrder, setPlacedOrder] = useState<Order | null>(null);

  // Delivery options state:
  // 'inside_dhaka' (৳60 / $0.50)
  // 'outside_dhaka' (৳120 / $1.00)
  // 'express_delivery' (৳240 / $2.00)
  // 'free_pickup' (৳0)
  const [deliveryType, setDeliveryType] = useState<'inside_dhaka' | 'outside_dhaka' | 'express_delivery' | 'free_pickup'>('inside_dhaka');

  // Financial calculations
  const subtotal = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  
  let discountValue = 0;
  if (appliedCoupon && subtotal >= appliedCoupon.minSpend) {
    discountValue = appliedCoupon.type === 'percentage'
      ? (subtotal * appliedCoupon.value) / 100
      : appliedCoupon.value;
  }

  // Sourcing shipping fees
  let baseShippingCharge = 0.50; // standard inside dhaka
  if (deliveryType === 'outside_dhaka') baseShippingCharge = 1.00;
  else if (deliveryType === 'express_delivery') baseShippingCharge = 2.00;
  else if (deliveryType === 'free_pickup') baseShippingCharge = 0.00;

  const isFreeShipping = subtotal >= 150;
  // Overwrite non-express routes shipping cost under free shipping promo
  const shippingCharge = isFreeShipping && deliveryType !== 'express_delivery' ? 0 : baseShippingCharge;
  const grandTotal = Math.max(0, subtotal - discountValue + shippingCharge);

  if (cart.length === 0 && !placedOrder) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center space-y-4 font-sans text-left">
        <CircleCheck className="w-12 h-12 text-rose-300 mx-auto" />
        <h2 className="text-xl font-medium text-zinc-900 dark:text-white">Active session checkout empty</h2>
        <button
          onClick={() => setPage('Shop')}
          className="px-4 py-2 bg-zinc-90 w-auto text-white rounded text-xs uppercase"
        >
          Return to Shop catalog
        </button>
      </div>
    );
  }

  // Handle placing order sequence
  const handlePlaceOrderSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !customerEmail || !customerPhone || !shippingAddress) {
      alert('Please complete all required fields on the shipping dashboard.');
      return;
    }

    // Is it COD or online gateway?
    if (paymentMethod === 'cod') {
      executeSubmitOrder();
    } else {
      // Trigger gateway simulated portal overlay!
      setSimStep('prompt');
      if (paymentMethod === 'bkash' || paymentMethod === 'nagad' || paymentMethod === 'rocket') {
        setSimPhoneNumber(customerPhone);
      }
      setIsSimulatingPayment(true);
    }
  };

  const executeSubmitOrder = async () => {
    setIsSimulatingPayment(true);
    setSimStep('none');
    try {
      const orderData = {
        customerName,
        customerEmail,
        customerPhone,
        shippingAddress,
        notes: `${notes}${deliveryType ? ` | Selected Delivery: ${
          deliveryType === 'inside_dhaka' ? 'Inside Dhaka Home Delivery' :
          deliveryType === 'outside_dhaka' ? 'Outside Dhaka Courier' :
          deliveryType === 'express_delivery' ? 'Express priority Next-day' : 'Showroom Counter Pick'
        }` : ''}`,
        paymentMethod,
        subtotal,
        discount: discountValue,
        shipping: shippingCharge,
        total: grandTotal,
        couponCode: appliedCoupon?.code
      };

      const result = await submitOrder(orderData);
      setPlacedOrder(result);
    } catch (err) {
      console.error('Checkout failed:', err);
      alert('Checkout error! Please try again or toggle Cash on Delivery for test approvals.');
    } finally {
      setIsSimulatingPayment(false);
    }
  };

  const handleSimulatedPaymentNext = () => {
    if (simStep === 'prompt') {
      setSimStep('otp');
    } else if (simStep === 'otp') {
      setSimStep('pin');
    } else if (simStep === 'pin') {
      executeSubmitOrder();
    }
  };

  const handleTrackSubmit = () => {
    if (placedOrder) {
      trackOrder(placedOrder.id);
      setPage('OrderTracking');
    }
  };

  // SUCCESS SCREEN RENDER
  if (placedOrder) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-16 text-center space-y-6 font-sans text-left bg-[#ffffff] text-black rounded-[20px] border border-zinc-150 shadow-sm mt-8">
        <div className="w-16 h-16 rounded-full bg-emerald-50 flex items-center justify-center mx-auto text-emerald-600 animate-bounce">
          <CircleCheck className="w-8 h-8" />
        </div>

        <div className="space-y-2 text-center">
          <span className="text-[10px] text-rose-500 font-mono tracking-widest uppercase font-bold">Torvi Cleared Securely</span>
          <h1 className="text-3xl font-sans font-light text-zinc-900">
            Order <span className="font-serif italic text-rose-500">Successfully Confirmed!</span>
          </h1>
          <p className="text-xs text-zinc-650 max-w-md mx-auto leading-relaxed">
            Congratulations, Amelia! Your purchase cleared elegantly. We've logged transaction histories onto the persistent JSON DB.
          </p>
        </div>

        {/* Invoice Summary Receipt Card */}
        <div className="p-6 rounded-[20px] bg-[#ffffff] border border-zinc-150 text-left space-y-4 max-w-md mx-auto shadow-xs">
          <div className="flex justify-between items-center text-xs font-mono border-b border-zinc-150 pb-2.5">
            <span className="text-zinc-400">ORDER ID:</span>
            <span className="font-bold text-black uppercase">{placedOrder.id}</span>
          </div>

          <div className="space-y-1 text-xs">
            <div className="flex justify-between">
              <span className="text-zinc-500">Deliver To:</span>
              <span className="text-black font-semibold">{placedOrder.customerName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-500">Phone Contact:</span>
              <span className="text-black">{placedOrder.customerPhone}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-500">Settled Via:</span>
              <span className="font-semibold text-rose-500 uppercase font-mono">{placedOrder.paymentMethod}</span>
            </div>
          </div>

          <div className="border-t border-zinc-150 pt-2.5 flex justify-between items-center text-[10px] text-zinc-400 font-mono">
            <span>TRACK CODES DEPLOYED:</span>
            <span className="font-bold text-rose-500">{placedOrder.trackingNumber}</span>
          </div>
        </div>

        {/* Tracking Call to Action */}
        <div className="pt-2 max-w-sm mx-auto flex flex-col gap-2">
          
          <button
            id="checkout-back-home"
            onClick={() => setPage('Home')}
            className="w-full py-3 border border-zinc-200 hover:bg-zinc-50 text-zinc-700 text-xs uppercase tracking-widest font-semibold rounded-[20px] transition cursor-pointer"
          >
            Explore More Boutique Picks
          </button>
        </div>

      </div>
    );
  }

  return (
    <div className="checkout-page-root max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 font-sans text-left">
      
      {/* Back button */}
      <button
        id="checkout-back-to-cart"
        onClick={() => setPage('Cart')}
        className="mb-8 inline-flex items-center space-x-1 text-xs font-semibold uppercase tracking-wider text-zinc-500 hover:text-rose-500 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Return to Shopping Bag</span>
      </button>

      <h1 className="text-3xl font-sans tracking-tight text-neutral-900 font-light mb-8">
        Secure Handbags <span className="font-serif italic text-rose-455">Checkout Dispatch</span>
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        
        {/* LEFT COMPONENT: SHIPPING FORM & PAYMENT GATEWAYS */}
        <form onSubmit={handlePlaceOrderSubmit} className="lg:col-span-8 space-y-6">
             {/* Section A: Shipping Details */}
          <div className="checkout-card bg-[#ffffff] text-[#000000] border border-[#EAEAEA] p-6 rounded-[20px] shadow-[0_4px_20px_rgba(0,0,0,0.06)] space-y-4">
            <h3 className="text-sm font-bold tracking-widest uppercase text-black border-b border-[#EAEAEA] pb-3 checkout-primary-text">
              1. Delivery Contact Details
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs checkout-secondary-text block font-sans">Full Name *</label>
                <input
                  id="checkout-shipping-name"
                  type="text"
                  required
                  placeholder="e.g. Amelia Watson"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-white text-black rounded-lg border border-[#EAEAEA] focus:outline-none pointer-events-auto"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs checkout-secondary-text block font-sans">Email Address *</label>
                <input
                  id="checkout-shipping-email"
                  type="email"
                  required
                  placeholder="amelia@gmail.com"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-white text-black rounded-lg border border-[#EAEAEA] focus:outline-none pointer-events-auto"
                />
              </div>

              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-xs checkout-secondary-text block font-sans">Phone Number * (e.g. For bKash / Delivery Contacts)</label>
                <input
                  id="checkout-shipping-phone"
                  type="text"
                  required
                  placeholder="+880 1711-223344"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-white text-black rounded-lg border border-[#EAEAEA] focus:outline-none pointer-events-auto"
                />
              </div>

              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-xs checkout-secondary-text block font-sans">Full Shipping Address *</label>
                <textarea
                  id="checkout-shipping-address"
                  required
                  rows={3}
                  placeholder="House 42, Road 11, Banani, Dhaka, Bangladesh"
                  value={shippingAddress}
                  onChange={(e) => setShippingAddress(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-white text-black rounded-lg border border-[#EAEAEA] focus:outline-none pointer-events-auto"
                />
              </div>

              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-xs checkout-secondary-text block font-sans">Notes to Concierge (Optional)</label>
                <input
                  id="checkout-shipping-notes"
                  type="text"
                  placeholder="e.g., Deliver during evening, wrap as elegant gift, etc..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-white text-black rounded-lg border border-[#EAEAEA] focus:outline-none pointer-events-auto"
                />
              </div>

              {/* Delivery Sourcing Grid Selection Option */}
              <div className="space-y-1.5 sm:col-span-2 border-t border-[#EAEAEA] pt-4 mt-2 text-left">
                <label className="text-xs font-bold text-black checkout-primary-text block uppercase tracking-wider text-[10px] pb-1">
                  Delivery Method & Cost (ডেলিভারি খরচ / চার্জ পদ্ধতি) *
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  
                  {/* Inside Dhaka option */}
                  <label className={`block border p-3.5 cursor-pointer rounded-xl transition duration-150 ${deliveryType === 'inside_dhaka' ? 'border-[#D4AF37] bg-amber-50/40 ring-1 ring-[#D4AF37]/30 shadow-xs' : 'border-[#EAEAEA] bg-white'}`}>
                    <input 
                      type="radio" 
                      name="deliveryType" 
                      value="inside_dhaka"
                      checked={deliveryType === 'inside_dhaka'}
                      onChange={() => setDeliveryType('inside_dhaka')}
                      className="sr-only"
                    />
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="block text-xs font-bold text-black checkout-primary-text">Inside Dhaka (ঢাকা সিটি)</span>
                        <span className="block text-[10px] checkout-secondary-text mt-0.5">Direct home courier within 48 hours</span>
                      </div>
                      <span className="text-xs font-mono font-bold text-[#D4AF37] shrink-0">
                        {isFreeShipping ? 'FREE' : formatPrice(0.50)}
                      </span>
                    </div>
                  </label>

                  {/* Outside Dhaka option */}
                  <label className={`block border p-3.5 cursor-pointer rounded-xl transition duration-150 ${deliveryType === 'outside_dhaka' ? 'border-[#D4AF37] bg-amber-50/40 ring-1 ring-[#D4AF37]/30 shadow-xs' : 'border-[#EAEAEA] bg-white'}`}>
                    <input 
                      type="radio" 
                      name="deliveryType" 
                      value="outside_dhaka"
                      checked={deliveryType === 'outside_dhaka'}
                      onChange={() => setDeliveryType('outside_dhaka')}
                      className="sr-only"
                    />
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="block text-xs font-bold text-black checkout-primary-text">Outside Dhaka (ঢাকার বাইরে)</span>
                        <span className="block text-[10px] checkout-secondary-text mt-0.5">District home courier status tracked</span>
                      </div>
                      <span className="text-xs font-mono font-bold text-[#D4AF37] shrink-0">
                        {isFreeShipping ? 'FREE' : formatPrice(1.00)}
                      </span>
                    </div>
                  </label>

                  {/* Express option */}
                  <label className={`block border p-3.5 cursor-pointer rounded-xl transition duration-150 ${deliveryType === 'express_delivery' ? 'border-[#D4AF37] bg-amber-50/40 ring-1 ring-[#D4AF37]/30 shadow-xs' : 'border-[#EAEAEA] bg-white'}`}>
                    <input 
                      type="radio" 
                      name="deliveryType" 
                      value="express_delivery"
                      checked={deliveryType === 'express_delivery'}
                      onChange={() => setDeliveryType('express_delivery')}
                      className="sr-only"
                    />
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="block text-xs font-bold text-black checkout-primary-text">Express Delivery (জরুরী এক্সপ্রেস)</span>
                        <span className="block text-[10px] checkout-secondary-text mt-0.5">Guaranteed same/next day dispatch</span>
                      </div>
                      <span className="text-xs font-mono font-bold text-[#D4AF37] shrink-0">
                        {formatPrice(2.00)}
                      </span>
                    </div>
                  </label>

                  {/* Pickup option */}
                  <label className={`block border p-3.5 cursor-pointer rounded-xl transition duration-150 ${deliveryType === 'free_pickup' ? 'border-emerald-500 bg-emerald-50/30 ring-1 ring-emerald-300 shadow-xs' : 'border-[#EAEAEA] bg-white'}`}>
                    <input 
                      type="radio" 
                      name="deliveryType" 
                      value="free_pickup"
                      checked={deliveryType === 'free_pickup'}
                      onChange={() => setDeliveryType('free_pickup')}
                      className="sr-only"
                    />
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="block text-xs font-bold text-black checkout-primary-text">Showroom Pickup (পিকআপ কাউন্টার)</span>
                        <span className="block text-[10px] checkout-secondary-text mt-0.5">Collect from showroom counter for free</span>
                      </div>
                      <span className="text-xs font-mono font-bold text-emerald-600 shrink-0">FREE</span>
                    </div>
                  </label>

                </div>
              </div>
            </div>

          </div>

          {/* Section B: Dynamic Payment Portals integrations Selectors */}
          <div className="checkout-card bg-[#ffffff] text-[#000000] border border-[#EAEAEA] p-6 rounded-[20px] shadow-[0_4px_20px_rgba(0,0,0,0.06)] space-y-4">
            <h3 className="text-sm font-bold tracking-widest uppercase text-black border-b border-[#EAEAEA] pb-3 checkout-primary-text">
              2. Select Secure Payment Integration
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              
              {/* bKash */}
              <button
                type="button"
                id="select-payment-bkash"
                onClick={() => setPaymentMethod('bkash')}
                className={`p-4 rounded-xl border text-left flex flex-col justify-between h-20 relative cursor-pointer transition ${
                  paymentMethod === 'bkash'
                    ? 'border-pink-500 bg-pink-50 text-pink-700 ring-1 ring-pink-400 shadow-xs font-bold'
                    : 'border-[#EAEAEA] bg-white hover:bg-zinc-50 text-black'
                }`}
              >
                <div className="text-xs font-bold uppercase tracking-wider font-mono">bKash</div>
                <span className="text-[9px] checkout-secondary-text block leading-tight font-sans">Simulated Instant OTP Verification</span>
                {paymentMethod === 'bkash' && (
                  <span className="absolute top-2 right-2 flex h-2 w-2 rounded-full bg-pink-500" />
                )}
              </button>

              {/* Nagad */}
              <button
                type="button"
                id="select-payment-nagad"
                onClick={() => setPaymentMethod('nagad')}
                className={`p-4 rounded-xl border text-left flex flex-col justify-between h-20 relative cursor-pointer transition ${
                  paymentMethod === 'nagad'
                    ? 'border-orange-500 bg-orange-50 text-orange-750 ring-1 ring-orange-400 shadow-xs font-bold'
                    : 'border-[#EAEAEA] bg-white hover:bg-zinc-50 text-black'
                }`}
              >
                <div className="text-xs font-bold uppercase tracking-wider font-mono">Nagad</div>
                <span className="text-[9px] checkout-secondary-text block leading-tight font-sans">Simulated Secure PIN validations</span>
                {paymentMethod === 'nagad' && (
                  <span className="absolute top-2 right-2 flex h-2 w-2 rounded-full bg-orange-500" />
                )}
              </button>

              {/* Rocket */}
              <button
                type="button"
                id="select-payment-rocket"
                onClick={() => setPaymentMethod('rocket')}
                className={`p-4 rounded-xl border text-left flex flex-col justify-between h-20 relative cursor-pointer transition ${
                  paymentMethod === 'rocket'
                    ? 'border-purple-500 bg-purple-50 text-purple-700 ring-1 ring-purple-400 shadow-xs font-bold'
                    : 'border-[#EAEAEA] bg-white hover:bg-zinc-50 text-black'
                }`}
              >
                <div className="text-xs font-bold uppercase tracking-wider font-mono">Rocket DBBL</div>
                <span className="text-[9px] checkout-secondary-text block leading-tight font-sans">Simulated Secure OTP pins</span>
                {paymentMethod === 'rocket' && (
                  <span className="absolute top-2 right-2 flex h-2 w-2 rounded-full bg-purple-500" />
                )}
              </button>

              {/* SSLCommerz Gateway */}
              <button
                type="button"
                id="select-payment-ssl"
                onClick={() => setPaymentMethod('sslcommerz')}
                className={`p-4 rounded-xl border text-left flex flex-col justify-between h-20 relative cursor-pointer transition ${
                  paymentMethod === 'sslcommerz'
                    ? 'border-rose-500 bg-rose-50 text-rose-700 ring-1 ring-rose-400 shadow-xs font-bold'
                    : 'border-[#EAEAEA] bg-white hover:bg-zinc-50 text-black'
                }`}
              >
                <div className="text-xs font-bold uppercase tracking-wider font-mono">SSLCommerz</div>
                <span className="text-[9px] checkout-secondary-text block leading-tight font-sans">Visa/Mastercard Simulated portals</span>
                {paymentMethod === 'sslcommerz' && (
                  <span className="absolute top-2 right-2 flex h-2 w-2 rounded-full bg-rose-500" />
                )}
              </button>

              {/* Cash on Delivery */}
              <button
                type="button"
                id="select-payment-cod"
                onClick={() => setPaymentMethod('cod')}
                className={`p-4 rounded-xl border text-left flex flex-col justify-between h-20 relative cursor-pointer transition ${
                  paymentMethod === 'cod'
                    ? 'border-black bg-zinc-50 text-black ring-1 ring-black/40 shadow-xs font-bold'
                    : 'border-[#EAEAEA] bg-white hover:bg-zinc-50 text-black'
                }`}
              >
                <div className="text-xs font-bold uppercase tracking-wider font-sans">Cash on Delivery</div>
                <span className="text-[9px] checkout-secondary-text block leading-tight font-sans">Pay Cash upon courier arrival</span>
                {paymentMethod === 'cod' && (
                  <span className="absolute top-2 right-2 flex h-2 w-2 rounded-full bg-emerald-500" />
                )}
              </button>

            </div>

            {/* Quick trust assurances */}
            <div className="pt-2 text-[11px] checkout-secondary-text flex items-center space-x-1.5 font-sans leading-relaxed">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Simulated SSL layer active. Real client checkout information will write securely to `db.json`.</span>
            </div>

          </div>

          {/* Checkout submit trigger */}
          <button
            id="checkout-shipping-submit"
            type="submit"
            className="w-full py-4 bg-black hover:bg-zinc-800 text-white rounded-[20px] text-xs uppercase tracking-widest font-semibold transition-all shadow-md text-center flex items-center justify-center space-x-1 cursor-pointer"
          >
            <span>Place Order Securely • ${grandTotal.toFixed(2)}</span>
          </button>

        </form>

        {/* RIGHT COLUMN: REVIEWS BASKET CART SUMMARY */}
        <div className="lg:col-span-4 space-y-6 select-none">
          
          <div className="checkout-card bg-[#ffffff] text-[#000000] border border-[#EAEAEA] rounded-[20px] p-6 space-y-4 shadow-[0_4px_20px_rgba(0,0,0,0.06)]">
            <h3 className="text-xs font-bold tracking-widest uppercase text-black border-b border-[#EAEAEA] pb-3 checkout-primary-text">
              Order Basket
            </h3>

            <div className="space-y-4 max-h-[220px] overflow-y-auto pr-2">
              {cart.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center gap-3 text-xs font-sans">
                  
                  <div className="flex items-center space-x-2.5">
                    <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0 border border-[#EAEAEA]">
                      <img
                        src={item.product.imageUrl}
                        alt={item.product.name}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    
                    <div className="text-left leading-tight">
                      <h4 className="font-semibold text-black line-clamp-1">
                        {item.product.name}
                      </h4>
                      <div className="text-[10px] checkout-secondary-text">
                        <span>Qty: {item.quantity} • </span>
                        <span>{item.selectedColor}</span>
                      </div>
                    </div>
                  </div>

                  <span className="font-mono text-black font-semibold">
                    {formatPrice(item.product.price * item.quantity)}
                  </span>

                </div>
              ))}
            </div>

            {/* Financial logs */}
            <div className="space-y-2 text-xs pt-3 border-t border-[#EAEAEA] text-left font-sans">
              <div className="flex justify-between">
                <span className="checkout-secondary-text">Items subtotal</span>
                <span className="font-mono text-black font-semibold">{formatPrice(subtotal)}</span>
              </div>
              {discountValue > 0 && (
                <div className="flex justify-between text-emerald-600 font-bold font-mono">
                  <span>Applied coupon discount</span>
                  <span>-{formatPrice(discountValue)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="checkout-secondary-text">Shipping charge</span>
                {shippingCharge === 0 ? (
                  <span className="text-emerald-600 text-[10px] uppercase font-bold tracking-wider">FREE</span>
                ) : (
                  <span className="font-mono text-black font-semibold">{formatPrice(shippingCharge)}</span>
                )}
              </div>
              <div className="flex justify-between items-center text-sm font-bold border-t border-[#EAEAEA] pt-2 text-black mt-1.5 border-dashed">
                <span>Grand Total Invoice</span>
                <span className="font-mono text-rose-500 font-extrabold">{formatPrice(grandTotal)}</span>
              </div>
            </div>

          </div>

          {/* Secure seals block */}
          <div className="checkout-card p-5 rounded-[20px] bg-[#ffffff] text-[#000000] border border-[#EAEAEA] space-y-2.5 text-xs shadow-[0_4px_20px_rgba(0,0,0,0.06)]">
            <div className="flex items-center space-x-1.5 font-bold text-black select-none">
              <Gift className="w-4 h-4 text-rose-500" />
              <span>Free Luxury Wrapping Gift:</span>
            </div>
            <p className="font-sans leading-relaxed text-[11px] checkout-secondary-text">
              If purchase ledger totals exceed {formatPrice(150)}, our boutique automatically deploys satin gift box envelopes & complementary greeting cards under your shipment references.
            </p>
          </div>

        </div>

      </div>

      {/* SECURE SIMULATED PAYMENT OVERLAY PORTAL WINDOWS */}
      {isSimulatingPayment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/60 backdrop-blur-md">
          <div className="payment-modal-card max-w-sm w-full p-6 shadow-2xl space-y-6 border border-[#EAEAEA] text-center relative overflow-hidden">
            
            {/* Header branding logo based on active provider */}
            <div className={`p-4 rounded-t-2xl font-mono text-white text-base font-extrabold tracking-widest leading-none ${
              paymentMethod === 'bkash' ? 'bg-[#E91E63]' :
              paymentMethod === 'nagad' ? 'bg-orange-600' :
              paymentMethod === 'rocket' ? 'bg-purple-700' : 'bg-rose-600'
            }`}>
              {paymentMethod === 'bkash' && 'bKash Merchant CheckOut'}
              {paymentMethod === 'nagad' && 'Nagad Secure Gateway'}
              {paymentMethod === 'rocket' && 'Rocket DBBL Mobile Banking'}
              {paymentMethod === 'sslcommerz' && 'SSLCommerz Visa/Mastercard Payment Panel'}
            </div>

            {simStep === 'prompt' && (
              <div className="space-y-4">
                <p className="text-xs checkout-secondary-text">
                  Enter mobile wallet account or card digits to simulate digital transfer loops.
                </p>
                {paymentMethod === 'sslcommerz' ? (
                  <div className="space-y-3 text-left">
                    <label className="text-[10px] checkout-secondary-text uppercase font-bold tracking-wide block">Cardholder Digits</label>
                    <input
                      id="sim-card-input"
                      type="text"
                      placeholder="4242 4242 4242 4242"
                      value={simCardNumber}
                      onChange={(e) => setSimCardNumber(e.target.value)}
                      className="w-full px-3 py-2 text-xs text-center font-mono border border-[#EAEAEA] rounded bg-white text-black"
                    />
                  </div>
                ) : (
                  <div className="space-y-3 text-left">
                    <label className="text-[10px] checkout-secondary-text uppercase font-bold tracking-wide block">Mobile Account Number</label>
                    <input
                      id="sim-phone-input"
                      type="text"
                      placeholder="01711223344"
                      value={simPhoneNumber}
                      onChange={(e) => setSimPhoneNumber(e.target.value)}
                      className="w-full px-3 py-2 text-xs text-center font-mono border border-[#EAEAEA] rounded bg-white text-black"
                    />
                  </div>
                )}
                <div className="pt-2 flex gap-2">
                  <button
                    id="sim-cancel-btn-p"
                    type="button"
                    onClick={() => setIsSimulatingPayment(false)}
                    className="flex-1 py-1.5 text-xs checkout-secondary-text font-bold uppercase transition hover:underline"
                  >
                    Cancel
                  </button>
                  <button
                    id="sim-next-btn-p"
                    type="button"
                    onClick={handleSimulatedPaymentNext}
                    className="flex-1 py-2 bg-black text-white rounded-[20px] text-xs font-bold uppercase animate-none"
                  >
                    Next Step
                  </button>
                </div>
              </div>
            )}

            {simStep === 'otp' && (
              <div className="space-y-4">
                <p className="text-xs checkout-secondary-text">
                  A simulated OTP SMS was sent under <span className="font-bold underline">{simPhoneNumber || 'credentials'}</span>. Specify target simulated pins.
                </p>
                <div className="text-left space-y-2">
                  <label className="text-[10px] checkout-secondary-text uppercase font-bold tracking-wide block text-center">Simulated OTP Code</label>
                  <input
                    id="sim-otp-input"
                    type="text"
                    maxLength={6}
                    placeholder="123456"
                    value={simOtp}
                    onChange={(e) => setSimOtp(e.target.value)}
                    className="w-full px-3 py-2 text-xs text-center font-mono font-bold tracking-[0.5em] border border-[#EAEAEA] bg-white text-black rounded"
                  />
                  <span className="text-[9px] checkout-secondary-text italic block text-center mt-1">(Hint: Enter 123456 or any 6 digits to bypass)</span>
                </div>
                <div className="pt-2 flex gap-2">
                  <button
                    id="sim-cancel-btn-otp"
                    type="button"
                    onClick={() => setIsSimulatingPayment(false)}
                    className="flex-1 py-1.5 text-xs checkout-secondary-text hover:underline uppercase"
                  >
                    Cancel
                  </button>
                  <button
                    id="sim-next-btn-otp"
                    type="button"
                    onClick={handleSimulatedPaymentNext}
                    className="flex-1 py-2 bg-black text-white rounded-[20px] text-xs font-bold uppercase animate-none"
                  >
                    Verify Code
                  </button>
                </div>
              </div>
            )}

            {simStep === 'pin' && (
              <div className="space-y-4">
                <p className="text-xs checkout-secondary-text leading-relaxed">
                  Authentication verified. Specify confidential gateway simulated PIN (e.g. 4-5 digit pin check) to clear the fund simulation.
                </p>
                <div className="text-left space-y-2">
                  <label className="text-[10px] checkout-secondary-text uppercase font-bold tracking-wide block text-center">MFS Pin Number</label>
                  <input
                    id="sim-pin-input"
                    type="password"
                    maxLength={5}
                    placeholder="••••"
                    value={simPin}
                    onChange={(e) => setSimPin(e.target.value)}
                    className="w-full px-3 py-2 text-xs text-center border border-[#EAEAEA] bg-white text-black font-mono tracking-[0.5em] rounded focus:outline-none"
                  />
                  <span className="text-[9px] checkout-secondary-text italic block text-center">(Hint: Enter any PIN to simulation clear transaction)</span>
                </div>
                <div className="pt-2 flex gap-2">
                  <button
                    id="sim-cancel-pin"
                    type="button"
                    onClick={() => setIsSimulatingPayment(false)}
                    className="flex-1 py-1.5 text-xs checkout-secondary-text hover:underline uppercase"
                  >
                    Cancel
                  </button>
                  <button
                    id="sim-submit-pin"
                    type="button"
                    onClick={handleSimulatedPaymentNext}
                    className="flex-1 py-2 bg-black text-white rounded-[20px] text-xs font-bold uppercase flex items-center justify-center space-x-1"
                  >
                    <Loader2 className="w-3.5 h-3.5 animate-spin hidden" />
                    <span>Authorize Payment</span>
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
}
