import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Search, MapPin, Truck, CheckCircle, Package, Clock } from 'lucide-react';

export default function OrderTracking() {
  const { activeTrackingOrder, trackOrder, formatPrice, user, setPage } = useApp();
  const [trackInput, setTrackInput] = React.useState(activeTrackingOrder?.id || '');
  const [errorText, setErrorText] = React.useState<string | null>(null);
  const [isSearching, setIsSearching] = React.useState(false);

  React.useEffect(() => {
    if (!user) {
      setPage('Login');
    }
  }, [user, setPage]);

  if (!user) {
    return null;
  }

  const handleTrackSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackInput.trim()) return;

    setIsSearching(true);
    setErrorText(null);

    const found = await trackOrder(trackInput);
    setIsSearching(false);

    if (!found) {
      setErrorText(`No details traced. Make sure order ID or Tracking code digits matches. (e.g. For Sandbox demo testing, search 'ORD-104928')`);
    }
  };

  // Determine stage weights
  let activeStageIndex = 0; // 0: Pending, 1: Processing, 2: Shipped, 3: Delivered, 4: Cancelled
  if (activeTrackingOrder) {
    const status = activeTrackingOrder.orderStatus;
    if (status === 'pending') activeStageIndex = 0;
    if (status === 'processing') activeStageIndex = 1;
    if (status === 'shipped') activeStageIndex = 2;
    if (status === 'delivered') activeStageIndex = 3;
    if (status === 'cancelled') activeStageIndex = -1; // cancelled
  }

  const timelineStages = [
    { title: 'Ordered', desc: 'Sourcing secure log files', icon: Package },
    { title: 'Approved', desc: 'Quality checklist audits passed', icon: Clock },
    { title: 'Dispatched', desc: 'Assigned to local Dhaka courier', icon: Truck },
    { title: 'Delivered', desc: 'Handover complete near client doorstep', icon: CheckCircle }
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 font-sans text-left space-y-8">
      
      {/* Search Input bar */}
      <div className="bg-[#FFFFFF] w-full p-6 rounded-[20px] border border-[#EAEAEA] shadow-[0_4px_20px_rgba(0,0,0,0.06)] space-y-4 text-black">
        <div className="text-left space-y-1 select-none">
          <span className="text-[#D4AF37] text-[10px] uppercase tracking-widest block font-bold">
            Real-Time Logistics
          </span>
          <h1 className="text-2xl font-light text-black">
            Dispatch <span className="font-serif italic text-[#D4AF37]">Tracking Timeline</span>
          </h1>
          <p className="text-xs text-[#555555]">
            Enter private invoice codes or shipment logs to verify real-time regional dispatch positions.
          </p>
        </div>

        <form onSubmit={handleTrackSearch} className="flex gap-2 pt-1.5">
          <input
            id="tracking-search-input"
            type="text"
            required
            placeholder="Search ORD-104928..."
            value={trackInput}
            onChange={(e) => setTrackInput(e.target.value)}
            className="flex-1 px-4 py-2.5 text-xs bg-[#FFFFFF] border border-[#EAEAEA] rounded font-mono text-black uppercase tracking-wider focus:outline-none focus:border-[#D4AF37]"
          />
          <button
            id="tracking-search-btn"
            type="submit"
            disabled={isSearching}
            className="px-5 py-2.5 bg-black hover:bg-zinc-800 text-white rounded-[20px] text-xs uppercase tracking-widest font-bold transition flex items-center justify-center space-x-1.5 shrink-0 shadow-sm cursor-pointer"
          >
            {isSearching ? 'Tracking...' : 'Track'}
          </button>
        </form>

        {errorText && (
          <p className="text-xs font-semibold text-red-500 font-sans leading-relaxed">
            ⚠️ {errorText}
          </p>
        )}
        
        {/* Sandbox Hints */}
        <p className="text-[10px] text-[#555555] font-sans text-center italic">
          Sandbox Hint: Search <span className="font-mono underline font-bold text-black">ORD-104928</span> (seeded default order) to see a live active timeline demonstration layout!
        </p>
      </div>

      {activeTrackingOrder ? (
        <div className="space-y-8 animate-fade-in">
          
          {/* A. VISUAL STATELINE TRACKING SLIDER BAR */}
          <div className="bg-[#FFFFFF] border border-[#EAEAEA] rounded-[20px] p-6 relative overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.06)]">
            
            <h3 className="text-xs font-bold font-mono tracking-wider text-black uppercase mb-8 pb-3 border-b border-[#EAEAEA]">
              SHIPMENT PROGRESS FOR: {activeTrackingOrder.id}
            </h3>

            {activeStageIndex === -1 ? (
              <div className="p-4 bg-red-50 text-red-655 text-xs rounded-[20px] text-center select-none font-sans font-semibold">
                ⚠️ THIS ORDER RECORD HAS BEEN MARKED AS CANCELLED INDEFINITELY.
              </div>
            ) : (
              <div className="relative">
                {/* Visual Connector Line */}
                <div className="absolute top-5 left-10 right-10 h-0.5 bg-zinc-200 -z-10" />
                <div
                  className="absolute top-5 left-10 h-0.5 bg-[#D4AF37] -z-10 transition-all duration-1000"
                  style={{
                    width: `${
                      activeStageIndex === 0 ? '0%' :
                      activeStageIndex === 1 ? '33%' :
                      activeStageIndex === 2 ? '66%' : '100%'
                    }`
                  }}
                />

                {/* Nodes layout mapping */}
                <div className="grid grid-cols-4 gap-2 text-center select-none">
                  {timelineStages.map((stage, idx) => {
                    const StageIcon = stage.icon;
                    const isPassed = idx <= activeStageIndex;

                    return (
                      <div key={idx} className="space-y-3">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center mx-auto border transition-all duration-500 ${
                            isPassed
                              ? 'bg-[#D4AF37] text-white border-[#D4AF37] shadow-sm ring-4 ring-amber-100 scale-105'
                              : 'bg-white text-zinc-300 border-zinc-200'
                          }`}
                        >
                          <StageIcon className="w-5 h-5 shrink-0" />
                        </div>

                        <div className="space-y-0.5 leading-tight">
                          <span className={`text-xs font-bold block ${isPassed ? 'text-black' : 'text-zinc-400'}`}>
                            {stage.title}
                          </span>
                          <span className="text-[9px] text-[#555555] block max-w-[100px] mx-auto hidden sm:block font-sans">
                            {stage.desc}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

          </div>

          {/* B. DETAILED METADATA SUMMARY */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Delivery address details */}
            <div className="bg-[#FFFFFF] border border-[#EAEAEA] p-6 rounded-[20px] space-y-4 shadow-[0_4px_20px_rgba(0,0,0,0.06)] text-black">
              <h3 className="text-xs font-bold tracking-widest uppercase text-black border-b border-[#EAEAEA] pb-3">
                Courier Consignment details
              </h3>

              <div className="space-y-3.5 text-xs text-[#555555] leading-relaxed font-sans">
                
                <div>
                  <span className="text-[10px] text-zinc-400 block font-mono">CLIENT CONSIGNEE:</span>
                  <span className="font-semibold text-black">{activeTrackingOrder.customerName}</span>
                </div>

                <div>
                  <span className="text-[10px] text-zinc-400 block font-mono">CONSIGNMENT ADRESSEE:</span>
                  <div className="flex items-start space-x-1 pt-0.5">
                    <MapPin className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                    <span className="text-black">{activeTrackingOrder.shippingAddress}</span>
                  </div>
                </div>

                <div>
                  <span className="text-[10px] text-zinc-400 block font-mono">CONTACT NUMBER:</span>
                  <span className="text-black">{activeTrackingOrder.customerPhone}</span>
                </div>

                {activeTrackingOrder.notes && (
                  <div>
                    <span className="text-[10px] text-zinc-400 block font-mono">INSTRUCTIONS LOG:</span>
                    <span className="italic block bg-zinc-50 p-2.5 rounded-[12px] border border-[#EAEAEA]">"{activeTrackingOrder.notes}"</span>
                  </div>
                )}

              </div>
            </div>

            {/* Financial Invoice listing */}
            <div className="bg-[#FFFFFF] border border-[#EAEAEA] p-6 rounded-[20px] space-y-4 shadow-[0_4px_20px_rgba(0,0,0,0.06)] text-black">
              <h3 className="text-xs font-bold tracking-widest uppercase text-black border-b border-[#EAEAEA] pb-3">
                Consolidated Item packages ({(activeTrackingOrder.items || []).length})
              </h3>

              <div className="space-y-4 max-h-[160px] overflow-y-auto pr-1">
                {activeTrackingOrder.items?.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center text-xs text-black font-sans">
                    <div className="flex items-center space-x-2">
                      <div className="w-7 h-7 rounded overflow-hidden bg-zinc-50 border border-[#EAEAEA] shrink-0">
                        <img src={item.productImage} alt={item.productName} className="w-full h-full object-cover" />
                      </div>
                      <span className="font-semibold line-clamp-1 max-w-[150px]">{item.productName} ({item.color})</span>
                    </div>
                    <span className="font-mono text-[#555555]">Qty: {item.quantity} • {formatPrice(item.price)}</span>
                  </div>
                ))}
              </div>

              <div className="pt-3 border-t border-[#EAEAEA] text-xs space-y-1 font-sans text-left leading-relaxed">
                <div className="flex justify-between">
                  <span className="text-[#555555]">Subtotal value:</span>
                  <span className="font-mono text-black">{formatPrice(activeTrackingOrder.subtotal)}</span>
                </div>
                {activeTrackingOrder.discount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-bold font-mono">
                    <span>Coupon subtracted:</span>
                    <span>-{formatPrice(activeTrackingOrder.discount)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-[#555555]">Dispatch Fee:</span>
                  <span className="font-mono text-black">{formatPrice(activeTrackingOrder.shipping)}</span>
                </div>
                <div className="flex justify-between text-sm font-bold border-t border-[#EAEAEA] pt-2 text-black mt-1.5 font-mono">
                  <span>Grand Total Net:</span>
                  <span className="text-[#D4AF37] font-extrabold">{formatPrice(activeTrackingOrder.total)}</span>
                </div>
              </div>

            </div>

          </div>

        </div>
      ) : (
        <div className="py-16 text-center text-xs text-[#555555] font-sans bg-[#FFFFFF] w-full rounded-[20px] border border-[#EAEAEA] shadow-[0_4px_20px_rgba(0,0,0,0.06)]">
          <Truck className="w-12 h-12 text-[#D4AF37] mx-auto mb-4 animate-pulse" />
          No dispatcher timeline retrieved. Populate search filters to track items.
        </div>
      )}

    </div>
  );
}
