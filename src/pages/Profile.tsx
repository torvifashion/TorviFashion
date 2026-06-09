import React, { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext';
import { Order, Product } from '../types';
import {
  User,
  ShoppingBag,
  Eye,
  Calendar,
  MapPin,
  Mail,
  Award,
  Search,
  BadgeAlert,
  Heart,
  CreditCard,
  Settings,
  LogOut,
  Plus,
  Trash2,
  Lock,
  Bell,
  CheckCircle,
  Truck,
  Package,
  Clock,
  ShieldCheck,
  ChevronRight,
  ShoppingBagIcon
} from 'lucide-react';

export default function Profile() {
  const {
    user,
    setPage,
    trackOrder,
    activeTrackingOrder,
    formatPrice,
    wishlist,
    toggleWishlist,
    addToCart,
    logout
  } = useApp();

  // Active Tab state inside customer account dashboard
  const [activeTab, setActiveTab] = useState<'profile' | 'orders' | 'tracking' | 'wishlist' | 'addresses' | 'payments' | 'settings'>('profile');
  
  // States of order search query inside the inline tracker
  const [trackInput, setTrackInput] = useState('');
  const [trackerError, setTrackerError] = useState<string | null>(null);
  const [isSearchingTracker, setIsSearchingTracker] = useState(false);

  // Lists for mock address registers
  const [addresses, setAddresses] = useState([
    {
      id: 'addr-1',
      title: 'Amelia’s Banani Residence (Primary)',
      address: 'Level 4, Grace Tower, Banani, Dhaka, Bangladesh',
      phone: '+880 1711-233445',
      isDefault: true
    },
    {
      id: 'addr-2',
      title: 'Gulshan Art Salon Outlet',
      address: 'House 12, Road 44, Gulshan-2, Dhaka',
      phone: '+880 1711-233445',
      isDefault: false
    }
  ]);
  const [newAddressTitle, setNewAddressTitle] = useState('');
  const [newAddressVal, setNewAddressVal] = useState('');
  const [newAddressPhone, setNewAddressPhone] = useState('');

  // Lists for mock payment options
  const [payments, setPayments] = useState([
    {
      id: 'pay-1',
      type: 'bKash Wallet',
      details: '01711-233445',
      isDefault: true
    },
    {
      id: 'pay-2',
      type: 'Visa Premium Card',
      details: '**** **** **** 4242 (Exp 12/28)',
      isDefault: false
    }
  ]);
  const [newPayType, setNewPayType] = useState('Visa Card');
  const [newPayVal, setNewPayVal] = useState('');

  // Sourcing dispatches
  const [memberOrders, setMemberOrders] = useState<Order[]>([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState(true);

  // Settings states
  const [receiveNewsletter, setReceiveNewsletter] = useState(true);
  const [receiveOrderUpdates, setReceiveOrderUpdates] = useState(true);
  const [passwordCurrent, setPasswordCurrent] = useState('');
  const [passwordNew, setPasswordNew] = useState('');
  const [settingsSuccess, setSettingsSuccess] = useState(false);

  useEffect(() => {
    const fetchMemberOrders = async () => {
      if (!user) return;
      setIsLoadingOrders(true);
      try {
        const res = await fetch('/api/orders', {
          headers: {
            'x-user-email': user.email,
            'x-user-id': user.id
          }
        });
        if (res.ok) {
          const allOrders: Order[] = await res.json();
          const filtered = allOrders.filter(
            (o) => o.customerEmail.toLowerCase() === user.email.toLowerCase() || o.userId === user.id
          );
          setMemberOrders(filtered);
        }
      } catch (err) {
        console.error('Error fetching member orders:', err);
      } finally {
        setIsLoadingOrders(false);
      }
    };

    fetchMemberOrders();
  }, [user]);

  // If user is logged out, show placeholder box to login
  if (!user) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center space-y-4 font-sans text-left">
        <BadgeAlert className="w-12 h-12 text-[#D4AF37] mx-auto animate-pulse" />
        <h2 className="text-xl font-medium text-black">Active session profile not loaded</h2>
        <button
          onClick={() => setPage('Login')}
          className="px-6 py-2.5 bg-black hover:bg-neutral-800 text-white rounded-[20px] text-xs uppercase cursor-pointer"
        >
          Go to Login Screen
        </button>
      </div>
    );
  }

  // Triggering dispatch tracking query
  const handleTrackerSearchSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackInput.trim()) return;

    setIsSearchingTracker(true);
    setTrackerError(null);

    const found = await trackOrder(trackInput.trim());
    setIsSearchingTracker(false);

    if (!found) {
      setTrackerError(`No tracking log detected for "${trackInput}". Please use ORD-104928 for live demo testing.`);
    }
  };

  const handleTrackActionClick = (orderId: string) => {
    trackOrder(orderId);
    setTrackInput(orderId);
    setActiveTab('tracking');
    setTrackerError(null);
  };

  // Saved Addresses operations
  const handleAddAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAddressTitle || !newAddressVal) return;
    const nextItem = {
      id: `addr-${Date.now()}`,
      title: newAddressTitle,
      address: newAddressVal,
      phone: newAddressPhone || '+880 1711-233445',
      isDefault: false
    };
    setAddresses([...addresses, nextItem]);
    setNewAddressTitle('');
    setNewAddressVal('');
    setNewAddressPhone('');
  };

  const handleDeleteAddress = (id: string) => {
    setAddresses(addresses.filter(a => a.id !== id));
  };

  // Saved Payments operations
  const handleAddPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPayVal) return;
    const nextItem = {
      id: `pay-${Date.now()}`,
      type: newPayType,
      details: newPayVal,
      isDefault: false
    };
    setPayments([...payments, nextItem]);
    setNewPayVal('');
  };

  const handleDeletePayment = (id: string) => {
    setPayments(payments.filter(p => p.id !== id));
  };

  const handleSettingsSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSettingsSuccess(true);
    setTimeout(() => setSettingsSuccess(false), 3000);
    setPasswordCurrent('');
    setPasswordNew('');
  };

  // Calculate tracking stages weights
  let activeStageIndex = 0;
  if (activeTrackingOrder) {
    const status = activeTrackingOrder.orderStatus;
    if (status === 'pending') activeStageIndex = 0;
    if (status === 'processing') activeStageIndex = 1;
    if (status === 'shipped') activeStageIndex = 2;
    if (status === 'delivered') activeStageIndex = 3;
    if (status === 'cancelled') activeStageIndex = -1;
  }

  const timelineStages = [
    { title: 'Ordered', desc: 'Secure logs received', icon: Package },
    { title: 'Approved', desc: 'Product audits passed', icon: Clock },
    { title: 'Dispatched', desc: 'Sourced to Dhaka courier', icon: Truck },
    { title: 'Delivered', desc: 'Handover complete', icon: CheckCircle }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 font-sans text-left min-h-screen text-black">
      
      {/* Header section with brand and user name */}
      <div className="mb-8 border-b border-[#EAEAEA] pb-5 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <span className="text-xs uppercase tracking-widest text-[#555555]">Private Member Lounge</span>
          <h1 className="text-3xl font-light text-black font-sans">
            Welcome Back, <span className="font-serif italic text-[#D4AF37] font-semibold">{user.name}</span>
          </h1>
          <p className="text-xs text-[#555555] mt-1">Manage your luxury dispatches, saved addresses, and premium settings.</p>
        </div>
        <div className="flex items-center space-x-2 text-xs text-[#555555]">
          <span className="h-2 w-2 rounded-full bg-emerald-500 inline-block animate-ping"></span>
          <span className="font-mono">Authorized Session • Security Verified</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN: NAVIGATION LIST (MY ACCOUNT LAYOUT) */}
        <div className="lg:col-span-4 bg-white border border-[#EAEAEA] rounded-[20px] p-6 shadow-[0_4px_20px_rgba(0,0,0,0.06)] space-y-6">
          
          {/* User profile capsule info */}
          <div className="text-center space-y-3 pb-5 border-b border-[#EAEAEA]">
            <div className="w-20 h-20 rounded-full bg-amber-50 flex items-center justify-center mx-auto border border-amber-200">
              <User className="w-10 h-10 text-[#D4AF37]" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-bold text-black tracking-wide leading-tight">
                {user.name}
              </h3>
              <p className="text-xs text-[#555555]">{user.email}</p>
              <div className="pt-1.5">
                <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded bg-amber-50 text-[#D4AF37] text-[10px] font-bold uppercase font-mono tracking-wider">
                  <Award className="w-3 h-3 text-[#D4AF37]" />
                  <span>{user.role} Partner</span>
                </span>
              </div>
            </div>
          </div>

          {/* MY ACCOUNT INTERACTIVE SIDEBAR LINKS */}
          <div className="space-y-1">
            <span className="text-[10px] text-zinc-400 uppercase tracking-widest font-mono font-bold block mb-2 px-3">
              My Account
            </span>
            
            <button
              onClick={() => setActiveTab('profile')}
              className={`w-full flex items-center justify-between text-left px-4 py-2.5 text-xs font-semibold uppercase tracking-wider rounded-[12px] transition ${
                activeTab === 'profile'
                  ? 'bg-amber-50 text-[#D4AF37] border-l-4 border-[#D4AF37]'
                  : 'bg-transparent text-black hover:bg-zinc-50'
              }`}
            >
              <span className="flex items-center space-x-2.5">
                <User className="w-4.5 h-4.5" />
                <span>Profile Details</span>
              </span>
              <ChevronRight className="w-3.5 h-3.5 opacity-60" />
            </button>

            <button
              onClick={() => setActiveTab('orders')}
              className={`w-full flex items-center justify-between text-left px-4 py-2.5 text-xs font-semibold uppercase tracking-wider rounded-[12px] transition ${
                activeTab === 'orders'
                  ? 'bg-amber-50 text-[#D4AF37] border-l-4 border-[#D4AF37]'
                  : 'bg-transparent text-black hover:bg-zinc-50'
              }`}
            >
              <span className="flex items-center space-x-2.5">
                <ShoppingBag className="w-4.5 h-4.5" />
                <span>My Orders History</span>
              </span>
              <ChevronRight className="w-3.5 h-3.5 opacity-60" />
            </button>

            <button
              onClick={() => setActiveTab('tracking')}
              className={`w-full flex items-center justify-between text-left px-4 py-2.5 text-xs font-semibold uppercase tracking-wider rounded-[12px] transition ${
                activeTab === 'tracking'
                  ? 'bg-amber-50 text-[#D4AF37] border-l-4 border-[#D4AF37]'
                  : 'bg-transparent text-black hover:bg-zinc-50'
              }`}
            >
              <span className="flex items-center space-x-2.5">
                <Search className="w-4.5 h-4.5" />
                <span>Order Tracking</span>
              </span>
              <ChevronRight className="w-3.5 h-3.5 opacity-60" />
            </button>

            <button
              onClick={() => setActiveTab('wishlist')}
              className={`w-full flex items-center justify-between text-left px-4 py-2.5 text-xs font-semibold uppercase tracking-wider rounded-[12px] transition ${
                activeTab === 'wishlist'
                  ? 'bg-amber-50 text-[#D4AF37] border-l-4 border-[#D4AF37]'
                  : 'bg-transparent text-black hover:bg-zinc-50'
              }`}
            >
              <span className="flex items-center space-x-2.5">
                <Heart className="w-4.5 h-4.5" />
                <span>Wishlist ({wishlist.length})</span>
              </span>
              <ChevronRight className="w-3.5 h-3.5 opacity-60" />
            </button>

            <button
              onClick={() => setActiveTab('addresses')}
              className={`w-full flex items-center justify-between text-left px-4 py-2.5 text-xs font-semibold uppercase tracking-wider rounded-[12px] transition ${
                activeTab === 'addresses'
                  ? 'bg-amber-50 text-[#D4AF37] border-l-4 border-[#D4AF37]'
                  : 'bg-transparent text-black hover:bg-zinc-50'
              }`}
            >
              <span className="flex items-center space-x-2.5">
                <MapPin className="w-4.5 h-4.5" />
                <span>Saved Addresses</span>
              </span>
              <ChevronRight className="w-3.5 h-3.5 opacity-60" />
            </button>

            <button
              onClick={() => setActiveTab('payments')}
              className={`w-full flex items-center justify-between text-left px-4 py-2.5 text-xs font-semibold uppercase tracking-wider rounded-[12px] transition ${
                activeTab === 'payments'
                  ? 'bg-amber-50 text-[#D4AF37] border-l-4 border-[#D4AF37]'
                  : 'bg-transparent text-black hover:bg-zinc-50'
              }`}
            >
              <span className="flex items-center space-x-2.5">
                <CreditCard className="w-4.5 h-4.5" />
                <span>Payment Methods</span>
              </span>
              <ChevronRight className="w-3.5 h-3.5 opacity-60" />
            </button>

            <button
              onClick={() => setActiveTab('settings')}
              className={`w-full flex items-center justify-between text-left px-4 py-2.5 text-xs font-semibold uppercase tracking-wider rounded-[12px] transition ${
                activeTab === 'settings'
                  ? 'bg-amber-50 text-[#D4AF37] border-l-4 border-[#D4AF37]'
                  : 'bg-transparent text-black hover:bg-zinc-50'
              }`}
            >
              <span className="flex items-center space-x-2.5">
                <Settings className="w-4.5 h-4.5" />
                <span>Lounge Settings</span>
              </span>
              <ChevronRight className="w-3.5 h-3.5 opacity-60" />
            </button>

            <button
              onClick={() => {
                logout();
                setPage('Home');
              }}
              className="w-full flex items-center justify-between text-left px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-red-500 rounded-[12px] hover:bg-red-50 transition mt-4"
            >
              <span className="flex items-center space-x-2.5">
                <LogOut className="w-4.5 h-4.5" />
                <span>Logout Session</span>
              </span>
              <ChevronRight className="w-3.5 h-3.5 opacity-60" />
            </button>
          </div>

        </div>

        {/* RIGHT COLUMN: DYNAMIC SUB-SECTION DISPLAY */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* PROFILE TAB */}
          {activeTab === 'profile' && (
            <div className="bg-white border border-[#EAEAEA] rounded-[20px] p-6 shadow-[0_4px_20px_rgba(0,0,0,0.06)] space-y-6">
              <div className="border-b border-[#EAEAEA] pb-3 flex items-center justify-between">
                <h3 className="text-sm font-bold tracking-widest uppercase">
                  Profile Details
                </h3>
                <User className="w-5 h-5 text-[#D4AF37]" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-[#555555]">
                <div className="p-4 bg-zinc-50 rounded-[12px] border border-[#EAEAEA] space-y-1">
                  <span className="text-[10px] text-zinc-400 font-mono block">PARTNER NAME:</span>
                  <span className="font-bold text-black text-sm">{user.name}</span>
                </div>
                <div className="p-4 bg-zinc-50 rounded-[12px] border border-[#EAEAEA] space-y-1">
                  <span className="text-[10px] text-zinc-400 font-mono block">EMAIL REGISTRY:</span>
                  <span className="font-semibold text-black text-sm">{user.email}</span>
                </div>
                <div className="p-4 bg-zinc-50 rounded-[12px] border border-[#EAEAEA] space-y-1">
                  <span className="text-[10px] text-zinc-400 font-mono block">MEMBER ID LOG:</span>
                  <span className="font-mono text-black">{user.id}</span>
                </div>
                <div className="p-4 bg-zinc-50 rounded-[12px] border border-[#EAEAEA] space-y-1">
                  <span className="text-[10px] text-zinc-400 font-mono block">JOINED DATE:</span>
                  <span className="text-black font-semibold">
                    {new Date(user.createdAt || '2026-01-01').toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                  </span>
                </div>
              </div>

              <div className="p-4 rounded-[12px] border border-[#EAEAEA] flex items-start space-x-3.5">
                <ShieldCheck className="w-6 h-6 text-[#D4AF37] shrink-0 mt-0.5" />
                <div className="space-y-1 text-xs">
                  <h4 className="font-bold text-black">Torvi Premium Security Verified</h4>
                  <p className="text-[#555555] leading-relaxed">
                    This browser connection is logged onto Torvi’s secure logistics gateway. Double-layer token encryption protects your address cards, discount slips, and purchase streams.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* ORDERS HISTORIES TAB */}
          {activeTab === 'orders' && (
            <div className="bg-white border border-[#EAEAEA] rounded-[20px] p-6 shadow-[0_4px_20px_rgba(0,0,0,0.06)] space-y-6">
              <div className="border-b border-[#EAEAEA] pb-3 flex items-center justify-between">
                <h3 className="text-sm font-bold tracking-widest uppercase">
                  My Orders History ({memberOrders.length})
                </h3>
                <ShoppingBag className="w-5 h-5 text-[#D4AF37]" />
              </div>

              {isLoadingOrders ? (
                <div className="text-center py-12 text-xs text-zinc-400 font-mono">
                  Loading order databases...
                </div>
              ) : memberOrders.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse text-black">
                    <thead>
                      <tr className="border-b border-[#EAEAEA] text-[10px] font-mono tracking-wider text-[#555555] uppercase select-none">
                        <th className="py-2.5">Order ID</th>
                        <th className="py-2.5">Date</th>
                        <th className="py-2.5">Total Paid</th>
                        <th className="py-2.5">Log Status</th>
                        <th className="py-2.5 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#EAEAEA] font-sans">
                      {memberOrders.map((order) => (
                        <tr key={order.id} className="hover:bg-zinc-50 transition">
                          <td className="py-3.5 font-mono font-bold uppercase text-black">
                            {order.id}
                          </td>
                          <td className="py-3.5 text-[#555555]">
                            {new Date(order.createdAt).toLocaleDateString().split('T')[0]}
                          </td>
                          <td className="py-3.5 font-mono font-bold text-black">
                            {formatPrice(order.total)}
                          </td>
                          <td className="py-3.5">
                            <span className={`px-2 py-0.5 rounded-[12px] text-[9px] font-bold uppercase tracking-wider ${
                              order.orderStatus === 'delivered' ? 'bg-emerald-50 text-emerald-600' :
                              order.orderStatus === 'shipped' ? 'bg-indigo-50 text-indigo-600' :
                              order.orderStatus === 'processing' ? 'bg-amber-50 text-amber-600' :
                              order.orderStatus === 'cancelled' ? 'bg-red-50 text-red-600' :
                              'bg-zinc-100 text-zinc-500'
                            }`}>
                              {order.orderStatus}
                            </span>
                          </td>
                          <td className="py-3.5 text-right">
                            <button
                              id={`profile-track-${order.id}`}
                              onClick={() => handleTrackActionClick(order.id)}
                              className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-black hover:bg-[#D4AF37] hover:text-black text-white text-[10px] font-bold uppercase tracking-widest rounded-[12px] transition cursor-pointer"
                              title="Trace real-time courier position"
                            >
                              <Search className="w-3.5 h-3.5" />
                              <span>Track</span>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-16 space-y-4">
                  <ShoppingBag className="w-12 h-12 text-zinc-300 mx-auto" />
                  <div className="space-y-1">
                    <h4 className="text-sm font-semibold text-black">No order placements found</h4>
                    <p className="text-xs text-[#555555] max-w-xs mx-auto">
                      You haven’t processed checked design bags on this account yet. Feel free to browse shop categories!
                    </p>
                  </div>
                  <button
                    onClick={() => setPage('Shop')}
                    className="px-5 py-2.5 bg-black hover:bg-[#D4AF37] hover:text-black text-white rounded-[20px] text-xs uppercase tracking-wider font-semibold transition"
                  >
                    Shop Collections Now
                  </button>
                </div>
              )}
            </div>
          )}

          {/* ORDER TRACKING SUB-SECTION */}
          {activeTab === 'tracking' && (
            <div className="space-y-6">
              
              {/* Tracker search block */}
              <div className="bg-white border border-[#EAEAEA] rounded-[20px] p-6 shadow-[0_4px_20px_rgba(0,0,0,0.06)] space-y-4 text-black">
                <div className="text-left space-y-1 select-none">
                  <span className="text-[#D4AF37] text-[10px] uppercase tracking-widest block font-bold">
                    Lounge Logistics Gateway
                  </span>
                  <h1 className="text-2xl font-light text-black">
                    Consignment <span className="font-serif italic text-[#D4AF37]">Security Timeline</span>
                  </h1>
                  <p className="text-xs text-[#555555]">
                    Enter your invoice ID to retrieve live regional coordinates and dispatch dispatch positions.
                  </p>
                </div>

                <form onSubmit={handleTrackerSearchSubmit} className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="text"
                    placeholder="Search ORD-104928..."
                    value={trackInput}
                    onChange={(e) => setTrackInput(e.target.value)}
                    className="flex-grow px-4 py-2.5 text-xs bg-white border border-[#EAEAEA] rounded-[12px] font-mono text-black uppercase tracking-wider focus:outline-none focus:border-[#D4AF37]"
                  />
                  <button
                    type="submit"
                    disabled={isSearchingTracker}
                    className="px-6 py-2.5 bg-black hover:bg-[#D4AF37] hover:text-black text-white rounded-[20px] text-xs uppercase tracking-widest font-bold transition flex items-center justify-center space-x-1.5 shrink-0 shadow-sm cursor-pointer"
                  >
                    {isSearchingTracker ? 'Searching...' : 'Search Timeline'}
                  </button>
                </form>

                {trackerError && (
                  <p className="text-xs text-red-500 font-medium bg-red-50 p-3 rounded-[12px]">
                    ⚠️ {trackerError}
                  </p>
                )}

                <p className="text-[10px] text-[#555555] text-center italic">
                  Sandbox Testing: Input <span className="font-mono underline font-bold text-black">ORD-104928</span> to demonstrate shipment steps!
                </p>
              </div>

              {/* Live Tracking Result */}
              {activeTrackingOrder ? (
                <div className="space-y-6 animate-fade-in">
                  
                  {/* Visual Tracker Slider */}
                  <div className="bg-white border border-[#EAEAEA] rounded-[20px] p-6 relative overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.06)]">
                    <h3 className="text-xs font-bold font-mono tracking-wider text-black uppercase mb-8 pb-3 border-b border-[#EAEAEA]">
                      SHIPMENT FLOW CODE: {activeTrackingOrder.id}
                    </h3>

                    {activeTrackingOrder.orderStatus === 'cancelled' ? (
                      <div className="p-4 bg-red-50 text-red-600 text-xs rounded-[12px] text-center select-none font-sans font-semibold">
                        ⚠️ THIS ORDER CODES MARKED AS CANCELLED INDEFINITELY.
                      </div>
                    ) : (
                      <div className="relative pt-2 pb-6">
                        
                        {/* Visual Connector Line */}
                        <div className="absolute top-7 left-10 right-10 h-0.5 bg-zinc-200 -z-0" />
                        <div
                          className="absolute top-7 left-10 h-0.5 bg-[#D4AF37] -z-0 transition-all duration-1000"
                          style={{
                            width: `${
                              activeStageIndex === 0 ? '0%' :
                              activeStageIndex === 1 ? '34%' :
                              activeStageIndex === 2 ? '68%' : '100%'
                            }`
                          }}
                        />

                        <div className="grid grid-cols-4 text-center relative z-10">
                          {timelineStages.map((stage, idx) => {
                            const StageIcon = stage.icon;
                            const isPassed = idx <= activeStageIndex;

                            return (
                              <div key={idx} className="space-y-3">
                                <div
                                  className={`w-10 h-10 rounded-full flex items-center justify-center mx-auto border transition-all duration-500 bg-white ${
                                    isPassed
                                      ? 'bg-[#D4AF37] text-white border-[#D4AF37] shadow-sm ring-4 ring-amber-100 scale-105'
                                      : 'bg-white text-zinc-300 border-zinc-200'
                                  }`}
                                >
                                  <StageIcon className="w-5 h-5 shrink-0" />
                                </div>

                                <div className="space-y-0.5 leading-tight">
                                  <span className={`text-[11px] font-bold block ${isPassed ? 'text-black font-semibold' : 'text-zinc-400'}`}>
                                    {stage.title}
                                  </span>
                                  <span className="text-[9px] text-[#555555] block max-w-[80px] mx-auto hidden sm:block font-sans">
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

                  {/* Consignee & Items Row */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    
                    {/* Courier details card */}
                    <div className="bg-white border border-[#EAEAEA] p-6 rounded-[20px] space-y-4 shadow-[0_4px_20px_rgba(0,0,0,0.06)] text-black">
                      <h3 className="text-xs font-bold tracking-widest uppercase border-b border-[#EAEAEA] pb-3">
                        Courier Consignment Details
                      </h3>

                      <div className="space-y-3.5 text-xs text-[#555555] leading-relaxed font-sans">
                        <div>
                          <span className="text-[10px] text-zinc-400 block font-mono">CLIENT CONSIGNEE:</span>
                          <span className="font-semibold text-black">{activeTrackingOrder.customerName}</span>
                        </div>

                        <div>
                          <span className="text-[10px] text-zinc-400 block font-mono">SHIPPING REGISTRY ADDRESS:</span>
                          <div className="flex items-start space-x-1 pt-0.5">
                            <MapPin className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                            <span className="text-black">{activeTrackingOrder.shippingAddress}</span>
                          </div>
                        </div>

                        <div>
                          <span className="text-[10px] text-zinc-400 block font-mono">CONTACT VALUE:</span>
                          <span className="text-black">{activeTrackingOrder.customerPhone}</span>
                        </div>
                      </div>
                    </div>

                    {/* Content package details */}
                    <div className="bg-white border border-[#EAEAEA] p-6 rounded-[20px] space-y-4 shadow-[0_4px_20px_rgba(0,0,0,0.06)] text-black">
                      <h3 className="text-xs font-bold tracking-widest uppercase border-b border-[#EAEAEA] pb-3">
                        Consolidated Item Packages ({(activeTrackingOrder.items || []).length})
                      </h3>

                      <div className="space-y-3 max-h-[160px] overflow-y-auto">
                        {activeTrackingOrder.items?.map((item, idx) => (
                          <div key={idx} className="flex justify-between items-center text-xs text-black font-sans">
                            <div className="flex items-center space-x-2">
                              <div className="w-7 h-7 rounded overflow-hidden bg-zinc-50 border border-[#EAEAEA] shrink-0">
                                <img src={item.productImage} alt={item.productName} className="w-full h-full object-cover" />
                              </div>
                              <span className="font-semibold line-clamp-1 max-w-[150px]">{item.productName}</span>
                            </div>
                            <span className="font-mono text-[#555555]">Qty: {item.quantity} • {formatPrice(item.price)}</span>
                          </div>
                        ))}
                      </div>

                      <div className="pt-3 border-t border-[#EAEAEA] text-xs space-y-1 font-sans text-left leading-relaxed">
                        <div className="flex justify-between">
                          <span className="text-[#555555]">Subtotal Value:</span>
                          <span className="font-mono text-black">{formatPrice(activeTrackingOrder.subtotal)}</span>
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
                <div className="py-16 text-center text-xs text-[#555555] font-sans bg-white w-full rounded-[20px] border border-[#EAEAEA] shadow-[0_4px_20px_rgba(0,0,0,0.06)]">
                  <Truck className="w-12 h-12 text-[#D4AF37] mx-auto mb-4 animate-pulse" />
                  No dispatcher timeline retrieved yet. Populate invoice filters above to track items.
                </div>
              )}

            </div>
          )}

          {/* WISHLIST TAB */}
          {activeTab === 'wishlist' && (
            <div className="bg-white border border-[#EAEAEA] rounded-[20px] p-6 shadow-[0_4px_20px_rgba(0,0,0,0.06)] space-y-6">
              <div className="border-b border-[#EAEAEA] pb-3 flex items-center justify-between">
                <h3 className="text-sm font-bold tracking-widest uppercase">
                  My Curated Wishlist ({wishlist.length})
                </h3>
                <Heart className="w-5 h-5 text-red-500 fill-red-50" />
              </div>

              {wishlist.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {wishlist.map((item) => (
                    <div key={item.id} className="p-4 rounded-[12px] border border-[#EAEAEA] flex space-x-4 items-center justify-between hover:bg-zinc-50 transition">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 rounded overflow-hidden bg-zinc-100 border border-[#EAEAEA] shrink-0">
                          <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="text-xs">
                          <h4 className="font-bold text-black line-clamp-1">{item.name}</h4>
                          <span className="font-mono text-zinc-400">{item.category}</span>
                          <div className="font-bold text-[#D4AF37] mt-0.5">{formatPrice(item.price)}</div>
                        </div>
                      </div>

                      <div className="flex flex-col space-y-1.5 shrink-0">
                        <button
                          onClick={() => {
                            addToCart(item, 1, item.colors ? item.colors[0] : 'Classic Carbon');
                            alert(`${item.name} added elegantly to checkout cart bag!`);
                          }}
                          className="px-2.5 py-1.5 bg-black hover:bg-[#D4AF37] hover:text-black text-white text-[9px] font-bold uppercase tracking-widest rounded-[12px] transition cursor-pointer"
                        >
                          Add Bag
                        </button>
                        <button
                          onClick={() => toggleWishlist(item)}
                          className="px-2 py-1 bg-red-50 hover:bg-red-100 text-red-600 text-[9px] font-bold uppercase tracking-widest rounded-[12px] transition flex items-center justify-center space-x-1 cursor-pointer font-sans"
                        >
                          <Trash2 className="w-3 h-3" />
                          <span>Remove</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16 space-y-4">
                  <Heart className="w-12 h-12 text-zinc-300 mx-auto" />
                  <div className="space-y-1">
                    <h4 className="text-sm font-semibold text-black">Your curated wishlist card is empty</h4>
                    <p className="text-xs text-[#555555] max-w-xs mx-auto">
                      Explore our premium handbag arrays and tap heart icons to aggregate luxury accessories here.
                    </p>
                  </div>
                  <button
                    onClick={() => setPage('Shop')}
                    className="px-5 py-2.5 bg-black hover:bg-[#D4AF37] hover:text-black text-white rounded-[20px] text-xs uppercase tracking-wider font-semibold transition"
                  >
                    View Boutique Catalog
                  </button>
                </div>
              )}
            </div>
          )}

          {/* SAVED ADDRESSES TAB */}
          {activeTab === 'addresses' && (
            <div className="bg-white border border-[#EAEAEA] rounded-[20px] p-6 shadow-[0_4px_20px_rgba(0,0,0,0.06)] space-y-6">
              <div className="border-b border-[#EAEAEA] pb-3 flex items-center justify-between">
                <h3 className="text-sm font-bold tracking-widest uppercase">
                  Saved Billing & Delivery Addresses
                </h3>
                <MapPin className="w-5 h-5 text-[#D4AF37]" />
              </div>

              {/* Loop addresses */}
              <div className="space-y-4">
                {addresses.map((a) => (
                  <div key={a.id} className="p-4 rounded-[12px] border border-[#EAEAEA] relative hover:bg-zinc-50 transition flex items-start justify-between">
                    <div className="space-y-2 text-xs">
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-black">{a.title}</span>
                        {a.isDefault && (
                          <span className="px-2 py-0.5 rounded-[12px] bg-amber-50 text-[#D4AF37] text-[8px] font-mono font-bold uppercase tracking-widest border border-amber-200">
                            DEFAULT SHIPPING
                          </span>
                        )}
                      </div>
                      <p className="text-[#555555] font-semibold">{a.address}</p>
                      <p className="text-zinc-400 font-mono">Contact: {a.phone}</p>
                    </div>

                    <button
                      onClick={() => handleDeleteAddress(a.id)}
                      className="p-1 px-2.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-[12px] text-[10px] font-bold uppercase transition flex items-center space-x-0.5 font-sans"
                      title="Deallocate address log"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Delete</span>
                    </button>
                  </div>
                ))}
              </div>

              {/* Add address form */}
              <form onSubmit={handleAddAddress} className="pt-6 border-t border-[#EAEAEA] space-y-4">
                <h4 className="text-xs font-bold uppercase text-[#D4AF37] tracking-widest">
                  Allocate New Delivery Outlet Address
                </h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="space-y-1">
                    <label className="text-zinc-400 font-sans block">Address Label title</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Work / Corporate Office"
                      value={newAddressTitle}
                      onChange={(e) => setNewAddressTitle(e.target.value)}
                      className="w-full px-3 py-2 border border-[#EAEAEA] rounded-[12px] bg-white text-black outline-none focus:border-[#D4AF37]"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-zinc-400 font-sans block">Delivery Contact Number</label>
                    <input
                      type="text"
                      placeholder="+880 1711-233445"
                      value={newAddressPhone}
                      onChange={(e) => setNewAddressPhone(e.target.value)}
                      className="w-full px-3 py-2 border border-[#EAEAEA] rounded-[12px] bg-white text-black outline-none focus:border-[#D4AF37]"
                    />
                  </div>
                </div>

                <div className="text-xs space-y-1">
                  <label className="text-zinc-400 font-sans block">Complete Street Address Details</label>
                  <textarea
                    required
                    placeholder="Full street name, holding digits, post code..."
                    value={newAddressVal}
                    onChange={(e) => setNewAddressVal(e.target.value)}
                    className="w-full px-3 py-2 border border-[#EAEAEA] rounded-[12px] bg-white text-black outline-none focus:border-[#D4AF37] min-h-[60px]"
                  />
                </div>

                <button
                  type="submit"
                  className="px-5 py-2.5 bg-black hover:bg-[#D4AF37] hover:text-black text-white text-xs uppercase tracking-widest font-bold rounded-[20px] transition flex items-center space-x-1"
                >
                  <Plus className="w-4 h-4" />
                  <span>Register Outlet Address</span>
                </button>
              </form>
            </div>
          )}

          {/* PAYMENT METHODS TAB */}
          {activeTab === 'payments' && (
            <div className="bg-white border border-[#EAEAEA] rounded-[20px] p-6 shadow-[0_4px_20px_rgba(0,0,0,0.06)] space-y-6">
              <div className="border-b border-[#EAEAEA] pb-3 flex items-center justify-between">
                <h3 className="text-sm font-bold tracking-widest uppercase">
                  My Security Payment Methods
                </h3>
                <CreditCard className="w-5 h-5 text-[#D4AF37]" />
              </div>

              {/* Loop payments */}
              <div className="space-y-4">
                {payments.map((p) => (
                  <div key={p.id} className="p-4 rounded-[12px] border border-[#EAEAEA] relative hover:bg-zinc-50 transition flex items-center justify-between">
                    <div className="space-y-1.5 text-xs">
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-black uppercase font-mono">{p.type}</span>
                        {p.isDefault && (
                          <span className="px-2 py-0.5 rounded-[12px] bg-emerald-50 text-emerald-600 text-[8px] font-mono font-bold uppercase tracking-widest border border-emerald-200">
                            DEFAULT WALLET
                          </span>
                        )}
                      </div>
                      <p className="text-zinc-400 font-mono">Account logs Ref: {p.details}</p>
                    </div>

                    <button
                      onClick={() => handleDeletePayment(p.id)}
                      className="p-1 px-2.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-[12px] text-[10px] font-bold uppercase transition flex items-center space-x-0.5 font-sans"
                      title="Deallocate payment registration"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Delete</span>
                    </button>
                  </div>
                ))}
              </div>

              {/* Add payment form */}
              <form onSubmit={handleAddPayment} className="pt-6 border-t border-[#EAEAEA] space-y-4">
                <h4 className="text-xs font-bold uppercase text-[#D4AF37] tracking-widest">
                  Authenticate Digital Wallet Card
                </h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="space-y-1">
                    <label className="text-zinc-400 font-sans block">Platform Wallet type</label>
                    <select
                      value={newPayType}
                      onChange={(e) => setNewPayType(e.target.value)}
                      className="w-full px-3 py-2 border border-[#EAEAEA] rounded-[12px] bg-white text-black outline-none focus:border-[#D4AF37]"
                    >
                      <option value="Visa Card">Visa Premium Credit Card</option>
                      <option value="Mastercard">Mastercard Elite Gold</option>
                      <option value="bKash Wallet">bKash Registered Wallet</option>
                      <option value="Nagad Wallet">Nagad Digital Account</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-zinc-400 font-sans block">Card / Account number payload</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 01711-xxxxxx or 4242-xxxx-xxxx"
                      value={newPayVal}
                      onChange={(e) => setNewPayVal(e.target.value)}
                      className="w-full px-3 py-2 border border-[#EAEAEA] rounded-[12px] bg-white text-black outline-none focus:border-[#D4AF37]"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="px-5 py-2.5 bg-black hover:bg-[#D4AF37] hover:text-black text-white text-xs uppercase tracking-widest font-bold rounded-[20px] transition flex items-center space-x-1"
                >
                  <Plus className="w-4 h-4" />
                  <span>Anchor Payment Method</span>
                </button>
              </form>
            </div>
          )}

          {/* PRIVACY LOUNGE SETTINGS TAB */}
          {activeTab === 'settings' && (
            <div className="bg-white border border-[#EAEAEA] rounded-[20px] p-6 shadow-[0_4px_20px_rgba(0,0,0,0.06)] space-y-6">
              <div className="border-b border-[#EAEAEA] pb-3 flex items-center justify-between">
                <h3 className="text-sm font-bold tracking-widest uppercase">
                  Logistics & Security Lounge Settings
                </h3>
                <Settings className="w-5 h-5 text-[#D4AF37]" />
              </div>

              {settingsSuccess && (
                <div className="p-3 bg-emerald-50 text-emerald-600 rounded-[12px] text-xs font-semibold">
                  ✓ Config parameters updated seamlessly into local memory!
                </div>
              )}

              {/* Settings configurations option listing */}
              <form onSubmit={handleSettingsSave} className="space-y-6 text-xs text-black">
                
                <div className="space-y-4">
                  <h4 className="font-bold text-zinc-400 uppercase tracking-wider text-[10px]">
                    Authorized Dispatch Communication Updates
                  </h4>

                  <div className="flex items-center justify-between p-3 rounded-[12px] border border-[#EAEAEA] bg-zinc-50">
                    <div className="space-y-0.5">
                      <span className="font-semibold block">Push SMS Stream Notifications</span>
                      <span className="text-[10px] text-[#555555]">Dispatch milestones push directly into phone log lines.</span>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={receiveOrderUpdates}
                        onChange={(e) => setReceiveOrderUpdates(e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-9 h-5 bg-zinc-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#D4AF37]"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-[12px] border border-[#EAEAEA] bg-zinc-50">
                    <div className="space-y-0.5">
                      <span className="font-semibold block">Weekly Luxury Catalog Drops</span>
                      <span className="text-[10px] text-[#555555]">Email newsletters with exclusive coupon offsets.</span>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={receiveNewsletter}
                        onChange={(e) => setReceiveNewsletter(e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-9 h-5 bg-zinc-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#D4AF37]"></div>
                    </label>
                  </div>
                </div>

                {/* Password reset mock panel */}
                <div className="space-y-4 pt-4 border-t border-[#EAEAEA]">
                  <h4 className="font-bold text-zinc-400 uppercase tracking-wider text-[10px]">
                    Update Security Crypt System
                  </h4>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-zinc-400 block pb-0.5">Current Password</label>
                      <input
                        type="password"
                        placeholder="••••••••"
                        value={passwordCurrent}
                        onChange={(e) => setPasswordCurrent(e.target.value)}
                        className="w-full px-3 py-2 border border-[#EAEAEA] rounded-[12px] bg-white text-black outline-none focus:border-[#D4AF37]"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-zinc-400 block pb-0.5">Envision New Crypt</label>
                      <input
                        type="password"
                        placeholder="Enter secure password credentials"
                        value={passwordNew}
                        onChange={(e) => setPasswordNew(e.target.value)}
                        className="w-full px-3 py-2 border border-[#EAEAEA] rounded-[12px] bg-white text-black outline-none focus:border-[#D4AF37]"
                      />
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  className="px-5 py-2.5 bg-black hover:bg-[#D4AF37] hover:text-black text-white text-xs uppercase tracking-widest font-bold rounded-[20px] transition"
                >
                  Save Lounge Updates
                </button>

              </form>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
