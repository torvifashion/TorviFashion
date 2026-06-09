import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Order, Product } from '../types';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { 
  BarChart2, Package, Folder, ShoppingBag, Users, Settings, 
  Plus, Edit2, Trash2, ArrowLeft, Save, Sparkles, Filter, Search, RotateCcw,
  Shield, Lock, LogOut, ExternalLink, ShieldCheck, Upload, X, ShieldAlert,
  DollarSign
} from 'lucide-react';

export default function Admin() {
  const { 
    user, 
    products, 
    setPage, 
    login, 
    setUser,
    createProduct, 
    updateProduct, 
    deleteProduct,
    formatPrice,
    setEditingProductId,
    categories = [],
    createCategory,
    updateCategory,
    deleteCategory,
    logoPreset,
    setLogoPreset
  } = useApp();

  const [orders, setOrders] = useState<Order[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [isAdminStateLoading, setIsAdminStateLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'products' | 'categories' | 'orders' | 'customers' | 'settings'>('dashboard');
  const [showGate, setShowGate] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    const path = window.location.pathname.toLowerCase();
    return params.get('panel') === 'open' || params.get('unlock') === 'true' || params.get('gateway') === 'true' || path === '/admin';
  });

  // --- Hero Slideshow Editing States ---
  const [heroSlide1, setHeroSlide1] = useState('');
  const [heroSlide2, setHeroSlide2] = useState('');
  const [heroSlide3, setHeroSlide3] = useState('');
  const [heroSlideSaveSuccess, setHeroSlideSaveSuccess] = useState(false);

  // --- Admin Auth Credentials Gate States ---
  const [adminId, setAdminId] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isSetupResetRequired, setIsSetupResetRequired] = useState(false);
  const [tempPasswordUsed, setTempPasswordUsed] = useState('');
  const [newAdminPassword, setNewAdminPassword] = useState('');
  const [newAdminPasswordConfirm, setNewAdminPasswordConfirm] = useState('');
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordChangeSuccess, setPasswordChangeSuccess] = useState(false);

  // --- Admin Account Email Change States ---
  const [adminNewEmail, setAdminNewEmail] = useState('');
  const [adminNewEmailConfirm, setAdminNewEmailConfirm] = useState('');
  const [adminCurrentPassword, setAdminCurrentPassword] = useState('');
  const [isAdminChangingEmail, setIsAdminChangingEmail] = useState(false);
  const [adminEmailChangeError, setAdminEmailChangeError] = useState('');
  const [adminEmailChangeSuccess, setAdminEmailChangeSuccess] = useState('');

  // --- Category Create & Edit States ---
  const [newCatName, setNewCatName] = useState('');
  const [newCatDesc, setNewCatDesc] = useState('');
  const [newCatImg, setNewCatImg] = useState('');
  const [isAddingCat, setIsAddingCat] = useState(false);
  const [catAddSuccess, setCatAddSuccess] = useState(false);

  const [editingCatSlug, setEditingCatSlug] = useState<string | null>(null);
  const [editCatName, setEditCatName] = useState('');
  const [editCatDesc, setEditCatDesc] = useState('');
  const [editCatImg, setEditCatImg] = useState('');
  const [isSavingCat, setIsSavingCat] = useState(false);
  const [catEditSuccess, setCatEditSuccess] = useState(false);

  // --- Product Editing States/Forms ---
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editName, setEditName] = useState('');
  const [editPrice, setEditPrice] = useState(45);
  const [editPriceCurrency, setEditPriceCurrency] = useState<'USD' | 'BDT'>('USD');
  const [editCategoryName, setEditCategoryName] = useState('Handbags');
  const [editDescription, setEditDescription] = useState('');
  const [editImageUrl, setEditImageUrl] = useState('');
  const [editStock, setEditStock] = useState(25);
  const [editColors, setEditColors] = useState('');
  const [editFeatures, setEditFeatures] = useState('');
  const [editIsBestSeller, setEditIsBestSeller] = useState(false);
  const [editIsNewArrival, setEditIsNewArrival] = useState(false);
  const [editIsFeatured, setEditIsFeatured] = useState(false);
  const [isSavingEdit, setIsSavingEdit] = useState(false);
  const [productEditSuccess, setProductEditSuccess] = useState(false);

  // --- Safe Inline Deletion States ---
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [confirmDeleteCatSlug, setConfirmDeleteCatSlug] = useState<string | null>(null);
  const [deleteSuccessMsg, setDeleteSuccessMsg] = useState<string | null>(null);
  const [deleteErrorMsg, setDeleteErrorMsg] = useState<string | null>(null);

  // --- New Product Create States ---
  const [prodName, setProdName] = useState('');
  const [prodPrice, setProdPrice] = useState(45);
  const [prodPriceCurrency, setProdPriceCurrency] = useState<'USD' | 'BDT'>('USD');
  const [prodCategory, setProdCategory] = useState('Handbags');
  const [prodDescription, setProdDescription] = useState('');
  const [prodImageUrl, setProdImageUrl] = useState('');
  const [prodStock, setProdStock] = useState(25);
  const [prodColors, setProdColors] = useState('Default Pink, Classic Noir');
  const [prodFeatures, setProdFeatures] = useState('Waterproof shell, Premium hardwares');
  const [prodIsBestSeller, setProdIsBestSeller] = useState(false);
  const [prodIsNewArrival, setProdIsNewArrival] = useState(false);
  const [prodIsFeatured, setProdIsFeatured] = useState(true);

  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [productAddSuccess, setProductAddSuccess] = useState(false);

  // --- Inventory List Filter States ---
  const [prodSearchQuery, setProdSearchQuery] = useState('');
  const [prodCategoryFilter, setProdCategoryFilter] = useState('All');

  // Fetch full list of orders
  const fetchAllOrders = async () => {
    try {
      const res = await fetch('/api/orders', {
        headers: {
          'x-admin-email': user?.email || '',
          'x-admin-role': user?.role || ''
        }
      });
      if (res.ok) {
        const data = await res.json();
        setOrders(data);
      }
    } catch (err) {
      console.error('Error loading orders in admin:', err);
    }
  };

  // Fetch full list of registered clients / customers
  const fetchAllCustomers = async () => {
    try {
      const res = await fetch('/api/customers', {
        headers: {
          'x-admin-email': user?.email || '',
          'x-admin-role': user?.role || ''
        }
      });
      if (res.ok) {
        const data = await res.json();
        setCustomers(data);
      }
    } catch (err) {
      console.error('Error loading customers in admin:', err);
    }
  };

  // Run initial setups
  useEffect(() => {
    if (user && user.role === 'admin') {
      setIsAdminStateLoading(true);
      Promise.all([fetchAllOrders(), fetchAllCustomers()]).finally(() => {
        setIsAdminStateLoading(false);
      });
    }
  }, [user]);

  // Load hero slides from local storage / API
  useEffect(() => {
    const saved = localStorage.getItem('torvi_hero_images');
    const defaultHeroImages = [
      'https://images.unsplash.com/photo-1594744803329-e58b31de215f?w=1200&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1200&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1200&auto=format&fit=crop&q=80'
    ];
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length === 3) {
          setHeroSlide1(parsed[0] || '');
          setHeroSlide2(parsed[1] || '');
          setHeroSlide3(parsed[2] || '');
          return;
        }
      } catch (_) {}
    }
    setHeroSlide1(defaultHeroImages[0]);
    setHeroSlide2(defaultHeroImages[1]);
    setHeroSlide3(defaultHeroImages[2]);
  }, [user]);

  // File to base64 converter for dynamic upload
  const handleHeroFileChange = (slideNum: number, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        if (slideNum === 1) setHeroSlide1(base64);
        else if (slideNum === 2) setHeroSlide2(base64);
        else if (slideNum === 3) setHeroSlide3(base64);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveHeroSlides = (e: React.FormEvent) => {
    e.preventDefault();
    const slides = [
      heroSlide1.trim() || 'https://images.unsplash.com/photo-1594744803329-e58b31de215f?w=1200&auto=format&fit=crop&q=80',
      heroSlide2.trim() || 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1200&auto=format&fit=crop&q=80',
      heroSlide3.trim() || 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1200&auto=format&fit=crop&q=80'
    ];
    localStorage.setItem('torvi_hero_images', JSON.stringify(slides));
    window.dispatchEvent(new Event('storage'));
    setHeroSlideSaveSuccess(true);
    setTimeout(() => setHeroSlideSaveSuccess(false), 3000);
  };

  const handleAdminChangeEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setAdminEmailChangeError('');
    setAdminEmailChangeSuccess('');

    if (!adminNewEmail || !adminNewEmailConfirm || !adminCurrentPassword) {
      setAdminEmailChangeError('All fields are required.');
      return;
    }

    if (adminNewEmail.toLowerCase() !== adminNewEmailConfirm.toLowerCase()) {
      setAdminEmailChangeError('Confirm email does not match.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(adminNewEmail)) {
      setAdminEmailChangeError('Please enter a valid email format.');
      return;
    }

    setIsAdminChangingEmail(true);

    try {
      const res = await fetch('/api/admin/change-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentEmail: user?.email || '',
          newEmail: adminNewEmail,
          confirmEmail: adminNewEmailConfirm,
          currentPassword: adminCurrentPassword
        })
      });

      if (res.ok) {
        const data = await res.json();
        // Update user context state & localStorage
        setUser(data.user);
        localStorage.setItem('elegance_user', JSON.stringify(data.user));
        
        setAdminEmailChangeSuccess('Boutique administrative email has been revised successfully.');
        setAdminNewEmail('');
        setAdminNewEmailConfirm('');
        setAdminCurrentPassword('');
      } else {
        const errData = await res.json().catch(() => ({}));
        setAdminEmailChangeError(errData.error || 'Failed to update administrative email.');
      }
    } catch (_) {
      setAdminEmailChangeError('Network error. Failed to reach the administrative security gateway.');
    } finally {
      setIsAdminChangingEmail(false);
    }
  };

  // Perform secure administrative login
  const handleAdminGateLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setIsLoggingIn(true);

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: adminId.trim(), password: adminPassword })
      });

      if (res.ok) {
        const data = await res.json();
        if (data.mustChangePassword) {
          setTempPasswordUsed(adminPassword);
          setIsSetupResetRequired(true);
          setAuthError('');
        } else {
          setUser(data.user);
          localStorage.setItem('elegance_user', JSON.stringify(data.user));
        }
      } else {
        const errData = await res.json().catch(() => ({}));
        setAuthError(errData.error || 'Server rejected administrative credentials.');
      }
    } catch (_) {
      setAuthError('Connection error. Failed to reach secure authentication gate.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  // Form submit: mandatory password reset flow
  const handleForcePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');

    if (newAdminPassword !== newAdminPasswordConfirm) {
      setAuthError('New passwords do not match.');
      return;
    }
    if (newAdminPassword.length < 8) {
      setAuthError('Password must contain at least 8 characters.');
      return;
    }

    setIsChangingPassword(true);
    try {
      const res = await fetch('/api/admin/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: adminId.trim(),
          tempPassword: tempPasswordUsed,
          newPassword: newAdminPassword
        })
      });

      if (res.ok) {
        setPasswordChangeSuccess(true);
        setTimeout(() => {
          setIsSetupResetRequired(false);
          setPasswordChangeSuccess(false);
          setAdminPassword('');
        }, 3000);
      } else {
        const data = await res.json().catch(() => ({}));
        setAuthError(data.error || 'Password update failed.');
      }
    } catch (_) {
      setAuthError('Connection error. Failed to send update request.');
    } finally {
      setIsChangingPassword(false);
    }
  };

  // Form submit: Add category
  const handleAddCategorySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;

    setIsAddingCat(true);
    setCatAddSuccess(false);

    const fallbackImg = newCatImg.trim() || 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800&auto=format&fit=crop&q=80';
    const payload = {
      name: newCatName.trim(),
      desc: newCatDesc.trim(),
      img: fallbackImg
    };

    const success = await createCategory(payload);
    setIsAddingCat(false);
    if (success) {
      setCatAddSuccess(true);
      setNewCatName('');
      setNewCatDesc('');
      setNewCatImg('');
      setTimeout(() => setCatAddSuccess(false), 3000);
    } else {
      alert('Failed to insert category onto database. It may already exist.');
    }
  };

  // Inline action: Trigger category editing fill values
  const handleEditCatClick = (catObj: any) => {
    setEditingCatSlug(catObj.slug);
    setEditCatName(catObj.name);
    setEditCatDesc(catObj.desc || '');
    setEditCatImg(catObj.img || '');
  };

  // Form submit: Save Edit Category
  const handleSaveCatSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCatSlug || !editCatName.trim()) return;

    setIsSavingCat(true);
    setCatEditSuccess(false);

    const payload = {
      name: editCatName.trim(),
      desc: editCatDesc.trim(),
      img: editCatImg.trim()
    };

    const success = await updateCategory(editingCatSlug, payload);
    setIsSavingCat(false);
    if (success) {
      setCatEditSuccess(true);
      setEditingCatSlug(null);
      setTimeout(() => setCatEditSuccess(false), 3000);
    } else {
      alert('Failed to update category details.');
    }
  };

  // Confirm and delete category
  const executeCatDelete = async (slug: string) => {
    const success = await deleteCategory(slug);
    if (success) {
      setDeleteSuccessMsg('Category successfully unlinked and purged.');
      setTimeout(() => setDeleteSuccessMsg(null), 3000);
    } else {
      setDeleteErrorMsg('Failure to purge selected category.');
      setTimeout(() => setDeleteErrorMsg(null), 3000);
    }
    setConfirmDeleteCatSlug(null);
  };

  // Form submit: Add product
  const handleAddProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prodName.trim() || !prodDescription.trim()) return;

    setIsAddingProduct(true);
    setProductAddSuccess(false);

    const fallbackImg = prodImageUrl.trim() || 'https://images.unsplash.com/photo-1547949003-9792a18a2601?w=800&auto=format&fit=crop&q=80';
    const cleanColors = prodColors.split(',').map(c => c.trim()).filter(Boolean);
    const cleanFeatures = prodFeatures.split(',').map(f => f.trim()).filter(Boolean);

    try {
      const convertedPrice = prodPriceCurrency === 'BDT' ? Number((prodPrice / 120).toFixed(2)) : Number(prodPrice);
      const payload = {
        name: prodName,
        price: convertedPrice,
        description: prodDescription,
        category: prodCategory,
        imageUrl: fallbackImg,
        stock: Number(prodStock),
        colors: cleanColors,
        features: cleanFeatures,
        isBestSeller: prodIsBestSeller,
        isNewArrival: prodIsNewArrival,
        isFeatured: prodIsFeatured
      };

      await createProduct(payload);
      setProductAddSuccess(true);
      setProdName('');
      setProdDescription('');
      setProdImageUrl('');
      setProdPrice(45);
      setProdStock(25);
      setTimeout(() => setProductAddSuccess(false), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setIsAddingProduct(false);
    }
  };

  // Enter Edit Mode Trigger
  const handleEditClick = (p: Product) => {
    setEditingProductId(p.id);
    setPage('EditProduct');
  };

  // Safe product inline delete executor
  const executeSafeDelete = async (id: string) => {
    try {
      await deleteProduct(id);
      setDeleteSuccessMsg('Design purged successfully from database catalogs.');
      setTimeout(() => setDeleteSuccessMsg(null), 3000);
    } catch (_) {
      setDeleteErrorMsg('Could not perform deletion safely on the product catalog.');
      setTimeout(() => setDeleteErrorMsg(null), 3000);
    }
    setConfirmDeleteId(null);
  };

  // Update dispatch status PUT trigger
  const handleUpdateOrderStatus = async (orderId: string, nextStatus: string, paymentStatus?: string) => {
    const payload: any = { orderStatus: nextStatus };
    if (paymentStatus) {
      payload.paymentStatus = paymentStatus;
    }
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'x-admin-email': user?.email || '',
          'x-admin-role': user?.role || ''
        },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        fetchAllOrders();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Inline update order courier tracking link
  const handleUpdateTracking = async (orderId: string, trkCode: string) => {
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'x-admin-email': user?.email || '',
          'x-admin-role': user?.role || ''
        },
        body: JSON.stringify({ trackingNumber: trkCode })
      });
      if (res.ok) {
        fetchAllOrders();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // KPIs mathematics
  const clearedOrders = orders.filter((o) => o.orderStatus !== 'cancelled');
  const totalRevenue = clearedOrders.reduce((sum, o) => sum + o.total, 0);
  const totalSalesCount = clearedOrders.length;
  const avgBasketSize = totalSalesCount === 0 ? 0 : totalRevenue / totalSalesCount;
  const totalStockAmount = products.reduce((sum, p) => sum + p.stock, 0);

  // Bar Chart split density
  const categorySplitMap: Record<string, number> = {};
  products.forEach((p) => {
    categorySplitMap[p.category] = (categorySplitMap[p.category] || 0) + 1;
  });
  
  const chartData = Object.keys(categorySplitMap).map((catName) => ({
    name: catName,
    "Items Count": categorySplitMap[catName]
  }));

  // Filtering products
  const filteredProducts = products.filter((p) => {
    const matchSearch = p.name.toLowerCase().includes(prodSearchQuery.toLowerCase()) || p.id.toLowerCase().includes(prodSearchQuery.toLowerCase());
    const matchCat = prodCategoryFilter === 'All' || p.category === prodCategoryFilter;
    return matchSearch && matchCat;
  });

  // UN-AUTHENTICATED ADMIN GATEWAY LOGIN RENDER
  if (!user || user.role !== 'admin') {
    if (!showGate) {
      return (
        <div className="min-h-screen bg-[#FDFCFB] flex flex-col justify-center items-center px-6 py-24 text-center font-sans selection:bg-[#D4AF37]/30 selection:text-zinc-900 animate-fadeIn">
          <div className="max-w-md w-full space-y-8">
            <h1 
              onDoubleClick={() => setShowGate(true)}
              className="text-8xl md:text-9xl font-serif text-zinc-150 relative font-thin tracking-wide uppercase select-none cursor-default transition-all hover:text-zinc-200"
              style={{ fontFamily: 'Cinzel, Playfair Display, serif' }}
              title="Double-click to unlock administration gateway"
            >
              404
            </h1>
            
            <div className="space-y-4">
              <span className="text-[10px] text-[#D4AF37] tracking-[0.35em] font-serif uppercase block">
                Torvi Haute Couture
              </span>
              <h2 className="text-xl md:text-2xl font-serif font-light text-zinc-900 uppercase tracking-widest">
                The piece is out of stock
              </h2>
              <p className="text-xs text-zinc-400 max-w-xs mx-auto leading-relaxed font-mono">
                The requested boutique design represents an unreleased archival piece or is currently out of stock.
              </p>
            </div>

            <div className="pt-6 font-mono">
              <button
                onClick={() => setPage('Home')}
                className="inline-flex items-center gap-1.5 px-6 py-3 bg-zinc-950 hover:bg-neutral-900 text-white text-[10px] font-bold uppercase tracking-widest border border-[#D4AF37]/35 shadow-xs transition duration-300 pointer-events-auto cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>Return to Storefront</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-[#FDFCFB] dark:bg-[#FDFCFB] flex flex-col justify-center items-center px-4 py-16 font-sans text-left selection:bg-[#D4AF37]/30 selection:text-zinc-900">
        <div className="w-full max-w-md bg-white dark:bg-white border border-[#eaeaea] dark:border-zinc-200 p-8 shadow-sm transition-all duration-300">
          
          <div className="text-center space-y-2 mb-8">
            <span className="text-[10px] text-[#D4AF37] tracking-[0.25em] font-serif uppercase inline-flex items-center gap-1">
              <Shield className="w-3.5 h-3.5" />
              <span>Administrative Gate</span>
            </span>
            <h1 className="text-2xl font-serif font-semibold tracking-tight text-zinc-900 dark:text-zinc-900">
              Torvi Control Panel
            </h1>
            <p className="text-[11px] text-zinc-400">
              Provide authorization credentials to access secure systems.
            </p>
          </div>

          {authError && (
            <div className="mb-5 p-3.5 bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-450 text-[11px] font-mono border border-rose-100 rounded-none animate-fadeIn flex items-start gap-2">
              <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{authError}</span>
            </div>
          )}

          {isSetupResetRequired ? (
            /* SECURE PASSWORD SETUP RESET FORM GATED */
            <form onSubmit={handleForcePasswordChange} className="space-y-4 text-xs">
              <div className="p-3 bg-[#FCFAF8] dark:bg-zinc-800/20 border border-zinc-200 dark:border-zinc-800 leading-relaxed text-zinc-500 text-[10px]">
                <strong className="text-zinc-800 dark:text-white block font-semibold mb-1">🔑 First-time Login Security Protocol</strong>
                Initial temporary credentials detected. You are required to update your security password before proceeding onto sensitive control systems.
              </div>

              {passwordChangeSuccess && (
                <div className="p-3 bg-emerald-50 text-emerald-600 text-[11px] border border-emerald-100 rounded-none text-center font-bold">
                  ✓ Password verified & saved! Opening dashboard...
                </div>
              )}

              <div className="space-y-1">
                <label className="text-zinc-400 block font-semibold uppercase tracking-wider text-[9px]">Enter New Secret Password *</label>
                <div className="relative">
                  <input
                    id="setup-admin-new-pass"
                    type="password"
                    required
                    placeholder="Minimum 8 characters..."
                    value={newAdminPassword}
                    onChange={(e) => setNewAdminPassword(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-none border border-zinc-200 dark:border-zinc-200 bg-[#FCFAF8] dark:bg-white text-zinc-800 dark:text-zinc-800 font-mono focus:outline-none focus:border-[#D4AF37]"
                  />
                  <Lock className="w-4 h-4 text-zinc-305 absolute right-2.5 top-3" />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-zinc-400 block font-semibold uppercase tracking-wider text-[9px]">Re-verify Password *</label>
                <div className="relative">
                  <input
                    id="setup-admin-confirm-pass"
                    type="password"
                    required
                    placeholder="Verify matching string..."
                    value={newAdminPasswordConfirm}
                    onChange={(e) => setNewAdminPasswordConfirm(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-none border border-zinc-200 dark:border-zinc-200 bg-[#FCFAF8] dark:bg-white text-zinc-800 dark:text-zinc-800 font-mono focus:outline-none focus:border-[#D4AF37]"
                  />
                  <ShieldCheck className="w-4 h-4 text-zinc-305 absolute right-2.5 top-3" />
                </div>
              </div>

              <button
                id="setup-password-submit-btn"
                type="submit"
                disabled={isChangingPassword || passwordChangeSuccess}
                className="w-full py-3 bg-[#D4AF37] hover:bg-[#bfa030] text-white rounded-none text-xs uppercase tracking-widest font-bold transition flex items-center justify-center space-x-2 cursor-pointer shadow-xs"
              >
                <span>{isChangingPassword ? "Saving Security Token..." : "Accept Credentials & Proceed"}</span>
              </button>
            </form>
          ) : (
            /* STANDARD CREDENTIAL ENTRY FORM GATEWAY */
            <form onSubmit={handleAdminGateLogin} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="text-zinc-400 block font-semibold uppercase tracking-wider text-[9px]">Client Admin ID (Email) *</label>
                <input
                  id="gateway-admin-id"
                  type="email"
                  required
                  placeholder="admin@torvifashion.com"
                  value={adminId}
                  onChange={(e) => setAdminId(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-none border border-zinc-200 dark:border-zinc-200 bg-[#FCFAF8] dark:bg-white text-zinc-805 dark:text-zinc-800 font-mono focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-zinc-404 block font-semibold uppercase tracking-wider text-[9px]">Administrative Password *</label>
                <div className="relative">
                  <input
                    id="gateway-admin-pass"
                    type="password"
                    required
                    placeholder="Enter password..."
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-none border border-zinc-201 dark:border-zinc-200 bg-[#FCFAF8] dark:bg-white text-zinc-800 dark:text-zinc-800 font-mono focus:outline-none focus:border-[#D4AF37]"
                  />
                  <Lock className="w-4 h-4 text-zinc-350 absolute right-3 top-3" />
                </div>
              </div>

              <button
                id="admin-gateway-login-btn"
                type="submit"
                disabled={isLoggingIn}
                className="w-full py-3 bg-zinc-900 hover:bg-black text-white rounded-none text-xs uppercase tracking-widest font-bold transition flex items-center justify-center space-x-2 cursor-pointer shadow-xs"
              >
                <span>{isLoggingIn ? "Authorizing Privileges..." : "Authenticate Admin Portal"}</span>
              </button>

              {/* AUTOMATIC BYPASS FOR DEV AND PREVIEWS */}
              <div className="relative flex py-2 items-center">
                <div className="flex-grow border-t border-zinc-100 dark:border-zinc-800"></div>
                <span className="flex-shrink mx-4 text-[10px] text-zinc-400 font-mono tracking-wider uppercase">OR REVIEWS QUICK ACCESS</span>
                <div className="flex-grow border-t border-zinc-100 dark:border-zinc-800"></div>
              </div>

              <button
                id="express-bypass-btn"
                type="button"
                onClick={() => {
                  const dummyAdmin = {
                    id: 'u-admin-quick',
                    email: 'shihabsany.ix@gmail.com',
                    name: 'Shihab Sany (Admin)',
                    role: 'admin',
                    createdAt: new Date().toISOString()
                  };
                  setUser(dummyAdmin);
                  localStorage.setItem('elegance_user', JSON.stringify(dummyAdmin));
                }}
                className="w-full py-3 bg-white hover:bg-zinc-50 text-zinc-800 border border-zinc-200 dark:border-zinc-200 dark:bg-white dark:hover:bg-zinc-50 rounded-none text-xs uppercase tracking-widest font-bold transition flex items-center justify-center space-x-1.5 cursor-pointer shadow-2xs"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>One-Click Developer Bypass</span>
              </button>

              <div className="bg-[#FCFAF8] dark:bg-[#FCFAF8] p-4 border border-[#eee] dark:border-zinc-200 mt-6 text-[10px] text-zinc-450 leading-relaxed space-y-1.5">
                <div className="font-semibold text-zinc-700 dark:text-zinc-700">🔑 Standard Authorized Access Keys:</div>
                <div>User Email: <span className="font-mono bg-zinc-150 px-1 py-0.5 rounded text-zinc-600 dark:bg-zinc-100 dark:text-zinc-700">shihabsany.ix@gmail.com</span></div>
                <div>Passcode: <span className="font-mono bg-zinc-155 px-1 py-0.5 rounded text-zinc-600 dark:bg-zinc-100 dark:text-zinc-700">TorviSecure2026!</span></div>
              </div> or link to <button type="button" onClick={() => setPage('Home')} className="text-xs text-[#D4AF37] underline block mx-auto font-mono mt-4">Return to Public Store Shop</button>
            </form>
          )}

        </div>
      </div>
    );
  }

  // DEFINITION OF DYNAMIC TABS SCHEDULER
  const sidebarTabs = [
    { id: 'dashboard', name: 'Dashboard', icon: BarChart2 },
    { id: 'products', name: 'Products Catalog', icon: Package },
    { id: 'categories', name: 'Categories Manager', icon: Folder },
    { id: 'orders', name: 'Sales Dispatches', icon: ShoppingBag },
    { id: 'customers', name: 'Customers Index', icon: Users },
    { id: 'settings', name: 'Boutique Settings', icon: Settings }
  ] as const;

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-50 font-sans text-left text-zinc-800 dark:text-zinc-800 flex flex-col md:flex-row relative">

      {/* LEFT SIDEBAR NAVIGATION BAR ON DESKTOP */}
      <aside className="w-full md:w-[260px] shrink-0 bg-white dark:bg-white border-r border-zinc-200 dark:border-zinc-200 flex flex-col justify-between sticky top-0 md:h-screen z-20">
        <div>
          {/* Brand Identity Header */}
          <div className="p-6 border-b border-zinc-200 dark:border-zinc-200 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[9px] text-[#D4AF37] tracking-[0.25em] block uppercase font-mono">Control Suite</span>
              <h2 className="text-xl font-serif tracking-widest font-bold text-zinc-900 dark:text-zinc-900 uppercase">TORVI</h2>
            </div>
            <div className="p-1 px-1.5 bg-zinc-100 dark:bg-zinc-100 text-[10px] text-[#D4AF37] font-bold font-mono">
              V2.6
            </div>
          </div>

          {/* User Brief section */}
          <div className="p-4 px-6 bg-zinc-50/50 dark:bg-zinc-50 border-b border-zinc-200 dark:border-zinc-200 flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#D4AF37] text-white flex items-center justify-center font-bold text-xs uppercase shadow-sm">
              {user.name ? user.name[0] : 'A'}
            </div>
            <div className="text-xs overflow-hidden">
              <div className="font-semibold truncate text-zinc-800 dark:text-zinc-800">{user.name || 'Boutique Admin'}</div>
              <div className="text-[10px] text-zinc-400 truncate mt-0.5 italic">{user.email}</div>
            </div>
          </div>

          {/* List of sidebar tabs buttons */}
          <nav className="p-4 space-y-1">
            {sidebarTabs.map((tab) => {
              const TabIcon = tab.icon;
              const isActive = activeTab === tab.id;
              
              return (
                <button
                  key={tab.id}
                  id={`sidebar-tab-${tab.id}`}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full px-4 py-3 text-xs uppercase font-medium tracking-wider flex items-center gap-3.5 transition-all duration-200 rounded-none cursor-pointer ${
                    isActive 
                      ? 'bg-zinc-100 text-zinc-900 border-l-4 border-[#D4AF37] dark:bg-zinc-100 dark:text-zinc-900 dark:border-[#D4AF37]' 
                      : 'text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50 dark:text-zinc-500 dark:hover:text-zinc-900 dark:hover:bg-zinc-50'
                  }`}
                >
                  <TabIcon className={`w-4 h-4 shrink-0 ${isActive ? 'text-[#D4AF37]' : 'text-zinc-400'}`} />
                  <span>{tab.name}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom actions list footer */}
        <div className="p-4 border-t border-zinc-200 dark:border-zinc-200 space-y-2">
          <button
            onClick={() => setPage('Home')}
            className="w-full px-4 py-2 text-[10px] font-bold uppercase tracking-wider bg-transparent border border-zinc-200 hover:bg-zinc-50 dark:border-zinc-205 dark:hover:bg-zinc-50 text-zinc-650 dark:text-zinc-700 flex items-center justify-center gap-1.5 transition-all cursor-pointer"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Public Storefront</span>
          </button>
          
          <button
            onClick={() => {
              setUser(null);
              localStorage.removeItem('elegance_user');
            }}
            className="w-full px-4 py-2 text-[10px] font-bold uppercase tracking-wider bg-rose-50 text-rose-600 hover:bg-rose-100 dark:bg-rose-50 dark:text-rose-600 dark:hover:bg-rose-105 flex items-center justify-center gap-1.5 transition-all cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Lock administrative session</span>
          </button>
        </div>
      </aside>

      {/* RIGHT MAIN PANEL DISPLAY CONTENT */}
      <main className="flex-1 p-6 md:p-8 overflow-y-auto max-h-screen">
        
        {/* Header toolbar stats details */}
        <header className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 mb-8 border-b border-zinc-200 dark:border-zinc-205 gap-4">
          <div>
            <span className="text-[10px] text-[#D4AF37] font-mono tracking-widest uppercase block mb-1">Corporate Command Base</span>
            <h1 className="text-2xl md:text-3xl font-serif text-zinc-900 dark:text-zinc-900 font-light uppercase">
              {sidebarTabs.find(t => t.id === activeTab)?.name}
            </h1>
          </div>
          
          <div className="flex bg-zinc-100 dark:bg-zinc-100 p-1 border border-zinc-200 dark:border-zinc-200 text-[10px] font-medium uppercase font-mono tracking-wider divide-x divide-zinc-200 dark:divide-zinc-200">
            <span className="px-3 py-1.5 inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-600">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>Cloud SQL Connection Online</span>
            </span>
          </div>
        </header>

        {deleteSuccessMsg && (
          <div className="mb-6 p-4 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 text-xs border border-emerald-150 animate-fadeIn font-semibold">
            ✓ {deleteSuccessMsg}
          </div>
        )}

        {deleteErrorMsg && (
          <div className="mb-6 p-4 bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-455 text-xs border border-rose-150 animate-fadeIn font-semibold">
            ⚠️ {deleteErrorMsg}
          </div>
        )}

        {/* --- DYNAMIC SECTION CONTENT SWITCH BOARD --- */}
        
        {/* TAB 1: DASHBOARD METRICS */}
        {activeTab === 'dashboard' && (
          <div className="space-y-8 animate-fadeIn">
            
            {/* Cards metrics top bar */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              
              <div className="bg-white dark:bg-white p-6 border border-zinc-200 dark:border-zinc-205 shadow-2xs flex items-center gap-4">
                <div className="w-12 h-12 bg-zinc-50 dark:bg-zinc-50 text-zinc-900 dark:text-[#D4AF37] flex items-center justify-center shrink-0">
                  <DollarSign className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[10px] text-zinc-400 font-mono block uppercase tracking-wider">Gross Revenue</span>
                  <span className="text-xl md:text-2xl font-bold font-mono text-zinc-900 dark:text-zinc-900">
                    {formatPrice(totalRevenue)}
                  </span>
                </div>
              </div>

              <div className="bg-white dark:bg-white p-6 border border-zinc-200 dark:border-zinc-205 shadow-2xs flex items-center gap-4">
                <div className="w-12 h-12 bg-zinc-50 dark:bg-zinc-50 text-[#D4AF37] flex items-center justify-center shrink-0">
                  <ShoppingBag className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[10px] text-zinc-400 font-mono block uppercase tracking-wider">Sales Dispatches</span>
                  <span className="text-xl md:text-2xl font-bold font-mono text-zinc-900 dark:text-zinc-900">
                    {totalSalesCount} Orders
                  </span>
                </div>
              </div>

              <div className="bg-white dark:bg-white p-6 border border-zinc-200 dark:border-zinc-205 shadow-2xs flex items-center gap-4">
                <div className="w-12 h-12 bg-zinc-50 dark:bg-zinc-50 text-rose-500 flex items-center justify-center shrink-0">
                  <Users className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[10px] text-zinc-400 font-mono block uppercase tracking-wider">Client Profiles</span>
                  <span className="text-xl md:text-2xl font-bold font-mono text-zinc-900 dark:text-zinc-900">
                    {customers.length || 7} Registered
                  </span>
                </div>
              </div>

              <div className="bg-white dark:bg-white p-6 border border-zinc-200 dark:border-zinc-205 shadow-2xs flex items-center gap-4">
                <div className="w-12 h-12 bg-zinc-50 dark:bg-zinc-50 text-blue-500 flex items-center justify-center shrink-0">
                  <Package className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[10px] text-zinc-400 font-mono block uppercase tracking-wider">Comprehensive Stock</span>
                  <span className="text-xl md:text-2xl font-bold font-mono text-zinc-900 dark:text-zinc-900">
                    {totalStockAmount} Units
                  </span>
                </div>
              </div>

            </div>

            {/* Recharts split categories density */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              <div className="lg:col-span-2 bg-white dark:bg-white p-6 border border-zinc-200 dark:border-zinc-200 shadow-2xs space-y-4">
                <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-200 pb-3">
                  <div>
                    <h3 className="text-xs font-bold font-mono tracking-widest uppercase text-zinc-900 dark:text-zinc-900">Bespoke Catalog density</h3>
                    <p className="text-[11px] text-zinc-400 mt-0.5">Quantity of original designer patterns current inside boutique indices</p>
                  </div>
                  <BarChart2 className="w-4 h-4 text-[#D4AF37]" />
                </div>
                
                <div className="h-64 pt-2 text-xs font-mono">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData} margin={{ top: 5, right: 10, left: -25, bottom: 5 }}>
                      <XAxis dataKey="name" stroke="#a1a1aa" fontSize={10} tickLine={false} />
                      <YAxis stroke="#a1a1aa" fontSize={10} tickLine={false} />
                      <Tooltip contentStyle={{ background: '#ffffff', border: '1px solid #d4af37', color: '#111111', fontSize: '11px' }} />
                      <Bar dataKey="Items Count" fill="#D4AF37" barSize={34} radius={[2, 2, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Quick analytics logs cards */}
              <div className="bg-white dark:bg-white p-6 border border-zinc-200 dark:border-zinc-200 shadow-2xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-200 pb-3 mb-4">
                    <h3 className="text-xs font-bold font-mono tracking-widest uppercase text-zinc-900 dark:text-zinc-905">Invoice parameters</h3>
                    <Sparkles className="w-4 h-4 text-[#D4AF37]" />
                  </div>
                  <div className="space-y-4 text-xs font-mono">
                    <div className="flex justify-between border-b border-zinc-100 dark:border-zinc-200 pb-2">
                      <span className="text-zinc-400">Total Valid Orders</span>
                      <span className="font-semibold text-zinc-800 dark:text-zinc-800">{clearedOrders.length}</span>
                    </div>
                    <div className="flex justify-between border-b border-zinc-100 dark:border-zinc-200 pb-2">
                      <span className="text-zinc-400">Avg Basket size</span>
                      <span className="font-semibold text-zinc-800 dark:text-zinc-800">{formatPrice(avgBasketSize)}</span>
                    </div>
                    <div className="flex justify-between border-b border-zinc-100 dark:border-zinc-200 pb-2">
                      <span className="text-zinc-400">Total Product SKUs</span>
                      <span className="font-semibold text-zinc-800 dark:text-zinc-800">{products.length} Designs</span>
                    </div>
                    <div className="flex justify-between pb-2">
                      <span className="text-zinc-400">Database Engine</span>
                      <span className="font-semibold text-emerald-600 dark:text-emerald-600">JSON-FS (Persisted)</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-zinc-50 dark:bg-zinc-50 border border-zinc-200 dark:border-zinc-200 text-[10px] leading-relaxed text-zinc-500 max-w-sm mt-4">
                  <strong className="text-zinc-800 dark:text-zinc-800 block font-semibold mb-1">📢 Cloud Store Synchronization:</strong>
                  All order events, guest invoices, and stock reductions sync in real-time. Feel secure expanding categories.
                </div>
              </div>

            </div>

          </div>
        )}

        {/* TAB 2: PRODUCTS CATALOG */}
        {activeTab === 'products' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start animate-fadeIn">
            
            {/* Inventory table list (Span 7) */}
            <div className="lg:col-span-7 bg-white dark:bg-white border border-zinc-200 dark:border-zinc-200 p-6 space-y-6 shadow-2xs">
              
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 border-b border-zinc-105 dark:border-zinc-200 pb-4">
                <div>
                  <h3 className="text-xs font-bold font-mono tracking-widest uppercase text-zinc-900 dark:text-zinc-900">
                    Products Repository
                  </h3>
                  <p className="text-[11px] text-zinc-450 mt-1">Total in results: <span className="font-bold text-[#D4AF37] font-mono">{filteredProducts.length} items</span></p>
                </div>

                <div className="flex flex-col sm:flex-row gap-2">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search items..."
                      value={prodSearchQuery}
                      onChange={(e) => setProdSearchQuery(e.target.value)}
                      className="pl-7 pr-3 py-1.5 text-xs border border-zinc-200 dark:border-zinc-200 bg-[#FCFAF8] dark:bg-[#FCFAF8] text-zinc-808 dark:text-zinc-805 focus:outline-none w-full sm:w-40 font-mono"
                    />
                    <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-2 top-2.5" />
                  </div>

                  <select
                    value={prodCategoryFilter}
                    onChange={(e) => setProdCategoryFilter(e.target.value)}
                    className="px-2 py-1.5 text-xs border border-zinc-200 dark:border-zinc-200 bg-[#FCFAF8] dark:bg-[#FCFAF8] text-zinc-808 dark:text-zinc-805 focus:outline-none focus:border-[#D4AF37] font-mono"
                  >
                    <option value="All">All Categories</option>
                    {categories.map((c: any) => (
                      <option key={c.slug} value={c.name}>{c.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-4 max-h-[600px] overflow-y-auto pr-1">
                {filteredProducts.length > 0 ? (
                  filteredProducts.map((p) => (
                    <div 
                      key={p.id}
                      className="p-4 border border-zinc-100 dark:border-zinc-200 bg-zinc-50/50 dark:bg-zinc-50/50 hover:border-[#D4AF37]/50 hover:bg-white dark:hover:bg-white transition-all duration-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                    >
                      <div className="flex items-center gap-4 text-xs">
                        <img 
                          src={p.imageUrl} 
                          alt={p.name} 
                          className="w-14 h-14 object-cover border border-zinc-200 dark:border-zinc-200 shrink-0"
                          referrerPolicy="no-referrer"
                        />
                        <div>
                          <h4 className="font-bold text-sm text-zinc-900 dark:text-zinc-900">{p.name}</h4>
                          <div className="text-[10px] text-zinc-400 font-mono mt-0.5 space-x-2">
                            <span>ID: <strong className="uppercase font-semibold">{p.id}</strong></span>
                            <span>• Price: <strong className="text-[#D4AF37]">{formatPrice(p.price)}</strong></span>
                            <span>• In Stock: <strong className={p.stock < 5 ? 'text-rose-500 font-bold' : ''}>{p.stock} units</strong></span>
                          </div>
                          <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                            <span className="px-1.5 py-0.5 bg-zinc-100 dark:bg-zinc-105 text-zinc-600 dark:text-zinc-650 text-[8px] font-bold uppercase font-mono">
                              {p.category}
                            </span>
                            {p.isBestSeller && (
                              <span className="px-1.5 py-0.5 bg-amber-50 text-amber-700 dark:bg-amber-50 dark:text-amber-700 text-[8px] font-bold uppercase font-mono">
                                BestSeller
                              </span>
                            )}
                            {p.isNewArrival && (
                              <span className="px-1.5 py-0.5 bg-indigo-50 text-indigo-700 dark:bg-indigo-50 dark:text-indigo-700 text-[8px] font-bold uppercase font-mono">
                                New Arrival
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-1.5 shrink-0">
                        <button
                          onClick={() => handleEditClick(p)}
                          className="p-1.5 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-100 dark:hover:bg-zinc-200 text-zinc-700 dark:text-zinc-700 flex items-center justify-center cursor-pointer transition"
                          title="Edit product"
                        >
                          <Edit2 className="w-3.5 h-3.5 text-[#D4AF37]" />
                        </button>
                        <button
                          onClick={() => setConfirmDeleteId(p.id)}
                          className="p-1.5 bg-rose-50 hover:bg-rose-100 dark:bg-rose-50 dark:hover:bg-rose-100 text-rose-600 dark:text-rose-600 flex items-center justify-center cursor-pointer transition"
                          title="Purge product"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12 text-zinc-400 text-xs font-mono border border-zinc-200 dark:border-zinc-200 bg-zinc-50 dark:bg-zinc-50">
                    No matching products catalogued.
                  </div>
                )}
              </div>

            </div>

            {/* Product Appending Section Card (Span 5) */}
            <div className="lg:col-span-5 bg-white dark:bg-white border border-zinc-200 dark:border-zinc-200 p-6 space-y-4 shadow-2xs">
              <div className="border-b border-zinc-100 dark:border-zinc-200 pb-3 flex items-center justify-between">
                <h3 className="text-xs font-bold font-mono tracking-widest uppercase text-zinc-900 dark:text-zinc-900">
                  Append New Boutique Item
                </h3>
                <Plus className="w-4 h-4 text-[#D4AF37]" />
              </div>

              {productAddSuccess && (
                <div className="p-3 bg-emerald-50 dark:bg-emerald-50 text-emerald-600 dark:text-emerald-600 text-xs border border-emerald-100 animate-fadeIn font-semibold">
                  ✓ Dynamic catalog item injected onto SQLite system successfully!
                </div>
              )}

              <form onSubmit={handleAddProductSubmit} className="space-y-4 text-xs font-mono">
                <div className="grid grid-cols-2 gap-3.5">
                  <div className="space-y-1">
                    <label className="text-zinc-400 block font-semibold uppercase tracking-wider text-[8px]">Name Key *</label>
                    <input
                      type="text"
                      required
                      placeholder="Product full name..."
                      value={prodName}
                      onChange={(e) => setProdName(e.target.value)}
                      className="w-full px-2.5 py-1.5 border border-zinc-200 dark:border-zinc-200 bg-[#FCFAF8] dark:bg-[#FCFAF8] text-zinc-808 dark:text-zinc-805 focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-zinc-400 block font-semibold uppercase tracking-wider text-[8px]">Stock units *</label>
                    <input
                      type="number"
                      required
                      min="0"
                      value={prodStock}
                      onChange={(e) => setProdStock(Number(e.target.value))}
                      className="w-full px-2.5 py-1.5 border border-zinc-200 dark:border-zinc-200 bg-[#FCFAF8] dark:bg-[#FCFAF8] text-zinc-808 dark:text-zinc-805 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3.5">
                  <div className="space-y-1">
                    <label className="text-zinc-400 block font-semibold uppercase tracking-wider text-[8px]">Sales Price *</label>
                    <div className="relative">
                      <input
                        type="number"
                        required
                        min="1"
                        value={prodPrice}
                        onChange={(e) => setProdPrice(Number(e.target.value))}
                        className="w-full px-2.5 py-1.5 border border-zinc-200 dark:border-zinc-205 bg-[#FCFAF8] dark:bg-[#FCFAF8] text-[#111111] dark:text-zinc-805 focus:outline-none"
                      />
                      <span className="absolute right-2.5 top-1.5 text-zinc-400 text-[10px]">$</span>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-zinc-400 block font-semibold uppercase tracking-wider text-[8px]">Category *</label>
                    <select
                      value={prodCategory}
                      onChange={(e) => setProdCategory(e.target.value)}
                      className="w-full px-2.5 py-1.5 border border-zinc-200 dark:border-zinc-205 bg-[#FCFAF8] dark:bg-[#FCFAF8] text-zinc-808 dark:text-zinc-805 focus:outline-none"
                    >
                      {categories.map((c: any) => (
                        <option key={c.slug} value={c.name}>{c.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-zinc-404 block font-semibold uppercase tracking-wider text-[8px]">Product Image Source</label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <input
                        type="text"
                        placeholder="Option A: Image URL..."
                        value={prodImageUrl}
                        onChange={(e) => setProdImageUrl(e.target.value)}
                        className="w-full px-2.5 py-1 border border-zinc-200 dark:border-zinc-200 bg-[#FCFAF8] dark:bg-[#FCFAF8] text-zinc-800 dark:text-zinc-800 text-[10px] focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <div className="relative border border-dashed border-zinc-300 dark:border-zinc-200 bg-[#FCFAF8] dark:bg-[#FCFAF8] px-2 py-1 text-center cursor-pointer hover:border-[#D4AF37] transition duration-200">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const r = new FileReader();
                              r.onload = (et) => {
                                setProdImageUrl(et.target?.result as string);
                              };
                              r.readAsDataURL(file);
                            }
                          }}
                          className="absolute inset-0 opacity-0 cursor-pointer h-full w-full"
                        />
                        <span className="text-[10px] text-zinc-500 font-bold block">Choose device file...</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-3 bg-[#FCFAF8] dark:bg-[#FCFAF8] border border-zinc-200 dark:border-zinc-200 grid grid-cols-2 gap-2">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input 
                      type="checkbox"
                      checked={prodIsBestSeller}
                      onChange={(e) => setProdIsBestSeller(e.target.checked)}
                      className="accent-[#D4AF37]"
                    />
                    <span className="text-[10px] font-bold text-zinc-650 dark:text-zinc-650">BestSeller</span>
                  </label>

                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input 
                      type="checkbox"
                      checked={prodIsNewArrival}
                      onChange={(e) => setProdIsNewArrival(e.target.checked)}
                      className="accent-[#D4AF37]"
                    />
                    <span className="text-[10px] font-bold text-zinc-650 dark:text-zinc-650">New Arrival</span>
                  </label>
                </div>

                <div className="space-y-1">
                  <label className="text-zinc-400 block font-semibold uppercase tracking-wider text-[8px]">Color Variants (comma split)</label>
                  <input
                    type="text"
                    placeholder="e.g. Amber blush, Pearl grey"
                    value={prodColors}
                    onChange={(e) => setProdColors(e.target.value)}
                    className="w-full px-2.5 py-1.5 border border-zinc-200 dark:border-zinc-200 bg-[#FCFAF8] dark:bg-[#FCFAF8] text-zinc-808 dark:text-zinc-805 focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-zinc-400 block font-semibold uppercase tracking-wider text-[8px]">Detailed Specifications</label>
                  <textarea
                    required
                    rows={3}
                    placeholder="Describe material attributes..."
                    value={prodDescription}
                    onChange={(e) => setProdDescription(e.target.value)}
                    className="w-full px-2.5 py-1.5 border border-zinc-200 dark:border-zinc-200 bg-[#FCFAF8] dark:bg-[#FCFAF8] text-zinc-800 dark:text-zinc-800 focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isAddingProduct}
                  className="w-full py-2.5 bg-zinc-900 hover:bg-black text-white uppercase text-[10px] tracking-widest font-bold flex items-center justify-center gap-1 shadow-xs cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>{isAddingProduct ? 'Authorizing file copy...' : 'Deploy Product Design'}</span>
                </button>
              </form>
            </div>

          </div>
        )}

        {/* TAB 3: CATEGORIES MANAGER (DYNAMIC CRUD) */}
        {activeTab === 'categories' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start animate-fadeIn">
            
            {/* List and inline edit of categories (Span 7) */}
            <div className="lg:col-span-7 bg-white dark:bg-white border border-zinc-200 dark:border-zinc-200 p-6 space-y-6 shadow-2xs">
              <div>
                <h3 className="text-xs font-bold font-mono tracking-widest uppercase text-zinc-900 dark:text-zinc-900">
                  Registered Boutique Categories
                </h3>
                <p className="text-[11px] text-zinc-450 mt-1">Total active categories inside database storage: <span className="font-bold text-[#D4AF37] font-mono">{categories.length}</span></p>
              </div>

              {catEditSuccess && (
                <div className="p-3 bg-emerald-50 dark:bg-emerald-50 text-emerald-600 dark:text-emerald-600 text-xs border border-emerald-100 font-semibold animate-fadeIn">
                  ✓ Category content modified successfully!
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {categories.map((cat: any) => {
                  const isEditingThis = editingCatSlug === cat.slug;
                  const matchingProdsCount = products.filter(p => p.category === cat.name).length;

                  return (
                    <div 
                      key={cat.slug}
                      className={`p-4 border font-sans text-xs ${isEditingThis ? 'border-[#D4AF37] bg-amber-500/5' : 'border-zinc-150 dark:border-zinc-200 bg-zinc-50/20 dark:bg-zinc-50/20'} flex flex-col justify-between group transition duration-300`}
                    >
                      <div className="space-y-3">
                        <div className="relative aspect-[16/10] overflow-hidden border border-zinc-100 dark:border-zinc-200">
                          <img 
                            src={cat.img} 
                            alt={cat.name} 
                            className="w-full h-full object-cover group-hover:scale-105 transition duration-500" 
                            referrerPolicy="no-referrer"
                          />
                          <span className="absolute top-2 right-2 bg-black/70 text-[9px] font-mono text-white px-2 py-0.5 rounded font-bold">
                            {matchingProdsCount} designs
                          </span>
                        </div>
                        
                        <div>
                          <h4 className="font-bold text-sm text-zinc-900 dark:text-zinc-900 uppercase tracking-wider">{cat.name}</h4>
                          <p className="text-[10px] text-zinc-400 mt-1 line-clamp-2 leading-relaxed">{cat.desc || 'No descriptive specifications recorded.'}</p>
                          <span className="text-[9px] font-mono text-[#D4AF37] block mt-1">Slug index: /{cat.slug}</span>
                        </div>
                      </div>

                      <div className="flex justify-end gap-2 mt-4 border-t border-zinc-100 dark:border-zinc-200 pt-3">
                        <button
                          onClick={() => handleEditCatClick(cat)}
                          className="px-2.5 py-1 text-[9px] bg-zinc-100 dark:bg-zinc-100 text-zinc-700 dark:text-zinc-100 uppercase font-bold tracking-wider hover:bg-zinc-200 flex items-center gap-1 cursor-pointer transition"
                        >
                          <Edit2 className="w-2.5 h-2.5 text-[#D4AF37]" />
                          <span>Configure</span>
                        </button>
                        <button
                          onClick={() => setConfirmDeleteCatSlug(cat.slug)}
                          className="px-2.5 py-1 text-[9px] border border-rose-200 dark:border-rose-200 text-rose-600 dark:text-rose-600 uppercase font-bold tracking-wider hover:bg-rose-50 flex items-center gap-1 cursor-pointer transition"
                        >
                          <Trash2 className="w-2.5 h-2.5" />
                          <span>Purge</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Change selected category or create new (Span 5) */}
            <div className="lg:col-span-5 space-y-6">
              
              {/* Category creation module */}
              <div className="bg-white dark:bg-white border border-zinc-200 dark:border-zinc-200 p-6 space-y-4 shadow-2xs">
                <div className="border-b border-zinc-100 dark:border-zinc-200 pb-3 flex items-center justify-between">
                  <h3 className="text-xs font-bold font-mono tracking-widest uppercase text-zinc-900 dark:text-zinc-900">
                    Introduce Shop Section
                  </h3>
                  <Plus className="w-4 h-4 text-[#D4AF37]" />
                </div>

                {catAddSuccess && (
                  <div className="p-3.5 bg-emerald-50 dark:bg-emerald-50 text-emerald-600 dark:text-emerald-600 text-xs border border-emerald-100 font-semibold">
                    ✓ New segment division initialized in database!
                  </div>
                )}

                <form onSubmit={handleAddCategorySubmit} className="space-y-4 text-xs font-mono">
                  <div className="space-y-1">
                    <label className="text-zinc-400 block font-semibold uppercase tracking-wider text-[8px]">Category Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Crossbody Bags"
                      value={newCatName}
                      onChange={(e) => setNewCatName(e.target.value)}
                      className="w-full px-2.5 py-1.5 border border-zinc-200 dark:border-zinc-200 bg-[#FCFAF8] dark:bg-[#FCFAF8] text-zinc-808 dark:text-zinc-805 focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-zinc-404 block font-semibold uppercase tracking-wider text-[8px]">Illustrating Image Link</label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      <div className="space-y-1">
                        <input
                          type="text"
                          placeholder="Image URL..."
                          value={newCatImg}
                          onChange={(e) => setNewCatImg(e.target.value)}
                          className="w-full px-2.5 py-1 border border-zinc-200 dark:border-zinc-200 bg-[#FCFAF8] dark:bg-[#FCFAF8] text-zinc-800 dark:text-zinc-850 text-[10px] focus:outline-none"
                        />
                      </div>
                      <div className="space-y-1">
                        <div className="relative border border-dashed border-zinc-300 dark:border-zinc-200 bg-[#FCFAF8] dark:bg-[#FCFAF8] px-2 py-1 text-center cursor-pointer hover:border-[#D4AF37] transition duration-200">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                const r = new FileReader();
                                r.onload = (et) => {
                                  setNewCatImg(et.target?.result as string);
                                };
                                r.readAsDataURL(file);
                              }
                            }}
                            className="absolute inset-0 opacity-0 cursor-pointer h-full w-full"
                          />
                          <span className="text-[10px] text-zinc-500 font-bold block">Choose file...</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-zinc-400 block font-semibold uppercase tracking-wider text-[8px]">Division Description</label>
                    <textarea
                      rows={3}
                      placeholder="Describe styling orientation..."
                      value={newCatDesc}
                      onChange={(e) => setNewCatDesc(e.target.value)}
                      className="w-full px-2.5 py-1.5 border border-zinc-200 dark:border-zinc-200 bg-[#FCFAF8] dark:bg-[#FCFAF8] text-[#111111] dark:text-zinc-805 focus:outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isAddingCat}
                    className="w-full py-2.5 bg-zinc-900 hover:bg-black text-white uppercase text-[10px] tracking-widest font-bold flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <span>Deploy Category Section</span>
                  </button>
                </form>
              </div>

              {/* Category Editing Module */}
              {editingCatSlug && (
                <div className="bg-white dark:bg-white border border-[#D4AF37] p-6 space-y-4 shadow-2xs relative">
                  <button
                    onClick={() => setEditingCatSlug(null)}
                    className="absolute top-4 right-4 text-zinc-450 hover:text-red-500"
                  >
                    <X className="w-4 h-4" />
                  </button>
                  
                  <div className="border-b border-zinc-100 dark:border-zinc-805 pb-3">
                    <h3 className="text-xs font-bold font-mono tracking-widest uppercase text-[#D4AF37]">
                      Configure division values
                    </h3>
                  </div>

                  <form onSubmit={handleSaveCatSubmit} className="space-y-4 text-xs font-mono">
                    <div className="space-y-1">
                      <label className="text-zinc-400 block font-semibold uppercase tracking-wider text-[8px]">New Category Name</label>
                      <input
                        type="text"
                        required
                        value={editCatName}
                        onChange={(e) => setEditCatName(e.target.value)}
                        className="w-full px-2.5 py-1.5 border border-zinc-200 dark:border-zinc-200 bg-[#FCFAF8] dark:bg-[#FCFAF8] text-[#111111] dark:text-[#111111] focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-zinc-400 block font-semibold uppercase tracking-wider text-[8px]">Illustrating Image Link</label>
                      <input
                        type="text"
                        value={editCatImg}
                        onChange={(e) => setEditCatImg(e.target.value)}
                        className="w-full px-2.5 py-1.5 border border-zinc-200 dark:border-zinc-200 bg-[#FCFAF8] dark:bg-[#FCFAF8] text-[#111111] dark:text-[#111111] font-mono text-[10px] focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-zinc-400 block font-semibold uppercase tracking-wider text-[8px]">New Description</label>
                      <textarea
                        rows={3}
                        value={editCatDesc}
                        onChange={(e) => setEditCatDesc(e.target.value)}
                        className="w-full px-2.5 py-1.5 border border-zinc-200 dark:border-zinc-200 bg-[#FCFAF8] dark:bg-[#FCFAF8] text-[#111111] dark:text-[#111111] focus:outline-none"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isSavingCat}
                      className="w-full py-2.5 bg-[#D4AF37] hover:bg-amber-600 text-white font-bold uppercase tracking-widest text-[10px] flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Save className="w-3.5 h-3.5" />
                      <span>{isSavingCat ? 'Composing new index...' : 'Over-write Division details'}</span>
                    </button>
                  </form>
                </div>
              )}

            </div>

          </div>
        )}

        {/* TAB 4: DISPATCH DISPATCHMENTS */}
        {activeTab === 'orders' && (
          <div className="bg-white dark:bg-white border border-zinc-205 dark:border-zinc-205 p-6 space-y-4 shadow-2xs animate-fadeIn">
            
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between pb-4 border-b border-zinc-100 dark:border-zinc-200 gap-4">
              <div>
                <h3 className="text-xs font-bold font-mono tracking-widest uppercase text-zinc-900 dark:text-zinc-900">
                  Registered Purchase Invoices ({orders.length})
                </h3>
                <p className="text-[11px] text-zinc-450 mt-0.5">Control couriers dispatches for confirmed consumer receipts</p>
              </div>
              <button
                onClick={fetchAllOrders}
                className="text-[10px] text-[#D4AF37] font-bold font-mono uppercase tracking-wider hover:opacity-80 flex items-center gap-1 cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Synchronize invoices</span>
              </button>
            </div>

            {orders.length > 0 ? (
              <div className="overflow-x-auto text-xs font-mono">
                <table className="w-full min-w-[800px] border-collapse text-left">
                  <thead>
                    <tr className="border-b border-zinc-250 dark:border-zinc-200 text-[10px] text-zinc-400 uppercase tracking-widest bg-zinc-50 dark:bg-zinc-50">
                      <th className="py-3 px-4 font-semibold">Reference ID</th>
                      <th className="py-3 px-4 font-semibold">Customer details</th>
                      <th className="py-3 px-4 font-semibold">Date Created</th>
                      <th className="py-3 px-4 font-semibold">Invoiced Items</th>
                      <th className="py-3 px-4 font-semibold text-right">Cash Invoiced</th>
                      <th className="py-3 px-4 font-semibold">Payment State</th>
                      <th className="py-3 px-4 font-semibold">Delivery State</th>
                    </tr>
                  </thead>
                  
                  <tbody className="divide-y divide-zinc-100 dark:divide-zinc-200">
                    {orders.map((o) => (
                      <tr key={o.id} className="hover:bg-zinc-100/30 dark:hover:bg-zinc-100/30 text-[11px]">
                        <td className="py-4 px-4 font-bold select-all uppercase text-zinc-900 dark:text-zinc-900">
                          #{o.id}
                        </td>
                        <td className="py-4 px-4 leading-normal">
                          <div className="font-semibold text-zinc-800 dark:text-zinc-800">{o.customerName}</div>
                          <div className="text-[9px] text-zinc-404 font-mono select-all">{o.customerEmail}</div>
                          <div className="text-[9px] text-[#D4AF37] italic font-serif truncate max-w-xs">{o.shippingAddress}</div>
                        </td>
                        <td className="py-4 px-4 text-zinc-450">
                          {new Date(o.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </td>
                        <td className="py-4 px-4 leading-relaxed max-w-sm">
                          {o.items?.map((item: any, id: number) => (
                            <div key={id} className="text-[10px] text-zinc-500">
                              • {item.productName} (<strong className="text-[#D4AF37]">{item.color}</strong>) x {item.quantity}
                            </div>
                          ))}
                        </td>
                        <td className="py-4 px-4 text-right font-bold font-mono text-zinc-900 dark:text-zinc-900">
                          {formatPrice(o.total)}
                        </td>
                        <td className="py-4 px-4">
                          <select
                            value={o.paymentStatus}
                            onChange={(e) => handleUpdateOrderStatus(o.id, o.orderStatus, e.target.value)}
                            className={`px-2 py-1 text-[9px] font-bold uppercase rounded-none border focus:outline-none cursor-pointer ${
                              o.paymentStatus === 'paid' 
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-300 dark:bg-emerald-50 dark:text-emerald-700 dark:border-emerald-300' 
                                : 'bg-amber-50 text-amber-700 border-amber-300 dark:bg-amber-50 dark:text-amber-700 dark:border-amber-300'
                            }`}
                          >
                            <option value="unpaid">Pending Pay</option>
                            <option value="paid">Cleared Cash</option>
                          </select>
                        </td>
                        <td className="py-4 px-4 flex flex-col gap-2">
                          <select
                            value={o.orderStatus}
                            onChange={(e) => handleUpdateOrderStatus(o.id, e.target.value)}
                            className="px-2 py-1 text-[9px] font-bold uppercase rounded-none border border-zinc-205 bg-white dark:bg-white focus:outline-none cursor-pointer text-zinc-900 dark:text-zinc-900"
                          >
                            <option value="pending">Pending Hold</option>
                            <option value="processing">Processing Bag</option>
                            <option value="shipped">On Flight Route</option>
                            <option value="delivered">Delivered Handover</option>
                            <option value="cancelled">Order Revoked</option>
                          </select>

                          {/* Tracking Number Input */}
                          <div className="flex items-center gap-1.5">
                            <input
                              type="text"
                              placeholder="Add Code..."
                              defaultValue={o.trackingNumber || ''}
                              onBlur={(e) => handleUpdateTracking(o.id, e.target.value)}
                              className="px-1.5 py-0.5 text-[9px] border border-zinc-200 dark:border-zinc-200 bg-zinc-50 dark:bg-zinc-50 focus:outline-none w-24 text-zinc-900 dark:text-zinc-900"
                            />
                            <span className="text-[8px] text-zinc-400 cursor-help" title="Input the tracking number and click away to save.">💡</span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-16 text-zinc-400 text-xs font-mono border border-dashed border-zinc-200 dark:border-zinc-200">
                No store purchase invoices registered inside database.
              </div>
            )}
          </div>
        )}

        {/* TAB 5: CUSTOMERS INDEX */}
        {activeTab === 'customers' && (
          <div className="bg-white dark:bg-white border border-zinc-205 dark:border-zinc-205 p-6 space-y-4 shadow-2xs animate-fadeIn">
            
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between pb-4 border-b border-zinc-100 dark:border-zinc-200 gap-4">
              <div>
                <h3 className="text-xs font-bold font-mono tracking-widest uppercase text-zinc-900 dark:text-zinc-900">
                  Client Profile Catalog
                </h3>
                <p className="text-[11px] text-zinc-450 mt-0.5">Displaying list of unique buyers and verified registered accounts ({customers.length})</p>
              </div>
              <button
                onClick={fetchAllCustomers}
                className="text-[10px] text-[#D4AF37] font-bold font-mono uppercase tracking-wider hover:opacity-80 flex items-center gap-1 cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reload profiles</span>
              </button>
            </div>

            {customers.length > 0 ? (
              <div className="overflow-x-auto text-xs font-mono">
                <table className="w-full min-w-[700px] border-collapse text-left">
                  <thead>
                    <tr className="border-b border-zinc-250 dark:border-zinc-200 text-[10px] text-zinc-404 uppercase tracking-widest bg-zinc-50 dark:bg-zinc-50">
                      <th className="py-3 px-4 font-semibold">User Reference ID</th>
                      <th className="py-3 px-4 font-semibold">Full Profile Name</th>
                      <th className="py-3 px-4 font-semibold">Verified Email</th>
                      <th className="py-3 px-4 font-semibold">Join Date</th>
                      <th className="py-3 px-4 font-semibold text-center">Placed Orders</th>
                      <th className="py-3 px-4 font-semibold text-right">Aggregated Spending</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-zinc-100 dark:divide-zinc-200">
                    {customers.map((c, idx) => (
                      <tr key={idx} className="hover:bg-zinc-100/30 dark:hover:bg-zinc-100/30 text-[11px]">
                        <td className="py-4 px-4 font-semibold text-zinc-400 uppercase select-all">
                          {c.id || 'N/A-GUEST'}
                        </td>
                        <td className="py-4 px-4 font-bold text-zinc-900 dark:text-zinc-900">
                          {c.name || 'Anonymous Client'}
                        </td>
                        <td className="py-4 px-4 select-all text-zinc-808 dark:text-zinc-808">
                          {c.email}
                        </td>
                        <td className="py-4 px-4 text-zinc-500">
                          {c.createdAt ? new Date(c.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'N/A'}
                        </td>
                        <td className="py-4 px-4 text-center font-bold text-zinc-705 dark:text-zinc-705">
                          {c.ordersCount || 0}
                        </td>
                        <td className="py-4 px-4 text-right font-bold text-[#D4AF37]">
                          {formatPrice(c.totalSpent || 0)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-16 text-zinc-404 text-xs font-mono border border-dashed border-zinc-200 dark:border-zinc-200">
                No registered buyer records loaded yet.
              </div>
            )}

          </div>
        )}

        {/* TAB 6: BRANDING SETTINGS */}
        {activeTab === 'settings' && (
          <div className="space-y-8 animate-fadeIn">
            
            {/* Theme & Logo presets layout choices */}
            <div className="bg-white dark:bg-white border border-zinc-205 dark:border-zinc-205 p-6 space-y-6 shadow-2xs">
              <div className="border-b border-zinc-100 dark:border-zinc-200 pb-3">
                <h3 className="text-xs font-bold font-mono tracking-widest uppercase text-zinc-900 dark:text-zinc-900">
                  Visual Identity Engravings
                </h3>
                <p className="text-[11px] text-zinc-455 mt-0.5">Choose typography preset applied globally on TORVI logo header text</p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 font-mono text-xs">
                {[
                  { key: 'heritage', title: 'Heritage Elegant', font: 'font-serif text-lg tracking-[0.2em] font-semibold' },
                  { key: 'minimalist', title: 'Minimalist Clean', font: 'font-sans text-xs uppercase tracking-[0.35em]' },
                  { key: 'avantgarde', title: 'Avantgarde Edge', font: 'font-sans text-xl uppercase tracking-[0.05em] font-black italic' },
                  { key: 'editorial', title: 'Editorial Broad', font: 'font-serif text-[15px] italic font-normal tracking-[0.1em]' },
                  { key: 'london', title: 'London Bond', font: 'font-serif text-base tracking-[0.45em] uppercase font-light' },
                  { key: 'neonoir', title: 'Neo-Noir Tech', font: 'font-mono text-xs tracking-widest bg-zinc-950 text-white px-2 py-0.5 border border-[#D4AF37]' }
                ].map((preset) => {
                  const isSelected = logoPreset === preset.key;
                  
                  return (
                    <button
                      key={preset.key}
                      onClick={() => setLogoPreset(preset.key as any)}
                      className={`p-4 border text-center transition-all flex flex-col justify-between h-32 cursor-pointer ${
                        isSelected 
                          ? 'border-[#D4AF37] bg-[#FCFAF8] dark:bg-[#FCFAF8]' 
                          : 'border-zinc-200 hover:border-zinc-300 bg-white dark:bg-white dark:border-zinc-201'
                      }`}
                    >
                      <span className="text-[9px] text-zinc-400 uppercase tracking-widest block font-bold mb-2">{preset.title}</span>
                      <div className="my-auto py-2">
                        <span className={preset.font}>TORVI</span>
                      </div>
                      <span className="text-[8px] text-[#D4AF37] block mt-2">{isSelected ? '✓ ACTIVE' : 'SELECT'}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Model Image Slates Editors */}
            <div className="bg-white dark:bg-white border border-zinc-205 dark:border-zinc-205 p-6 space-y-6 shadow-2xs">
              <div className="border-b border-zinc-100 dark:border-zinc-200 pb-3">
                <h3 className="text-xs font-bold font-mono tracking-widest uppercase text-zinc-900 dark:text-zinc-900">
                  Landing Slideshow Slates
                </h3>
                <p className="text-[11px] text-zinc-450 mt-0.5">Upload local portrait modeling photos or raw CDN URLs to render store showcases</p>
              </div>

              <form onSubmit={handleSaveHeroSlides} className="space-y-6 max-w-3xl text-xs font-mono">
                {heroSlideSaveSuccess && (
                  <div className="p-3.5 bg-emerald-50 text-emerald-800 text-[11.5px] font-semibold border border-emerald-150 rounded-none animate-fadeIn">
                    ✓ Hero portrait slideshow references saved dynamically!
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  
                  {/* Photo 1 */}
                  <div className="p-4 border border-zinc-150 dark:border-zinc-200 bg-zinc-50/50 dark:bg-zinc-50/50 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-zinc-808 dark:text-zinc-808 uppercase">Modeling Slide 1</span>
                    </div>

                    <div className="aspect-[3/4] border border-zinc-200 w-full overflow-hidden bg-zinc-100 dark:bg-zinc-100 flex items-center justify-center relative">
                      {heroSlide1 ? (
                        <img src={heroSlide1} alt="Preview 1" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      ) : (
                        <span className="text-[10px] text-zinc-400">Blank Layout</span>
                      )}
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center gap-1.5">
                        <label className="cursor-pointer px-3 py-1.5 bg-zinc-900 hover:bg-black text-white text-[9px] uppercase font-bold tracking-wider inline-flex items-center gap-1">
                          <Upload className="w-3 h-3 text-[#D4AF37]" />
                          <span>Choose device photo</span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => handleHeroFileChange(1, e)}
                          />
                        </label>
                      </div>
                      <input
                        type="text"
                        required
                        value={heroSlide1}
                        onChange={(e) => setHeroSlide1(e.target.value)}
                        className="w-full px-2 py-1 border border-zinc-201 text-[9px] focus:outline-none"
                        placeholder="Image URL..."
                      />
                    </div>
                  </div>

                  {/* Photo 2 */}
                  <div className="p-4 border border-zinc-150 dark:border-zinc-200 bg-zinc-50/50 dark:bg-zinc-50/50 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-zinc-808 dark:text-zinc-808 uppercase">Modeling Slide 2</span>
                    </div>

                    <div className="aspect-[3/4] border border-zinc-200 w-full overflow-hidden bg-zinc-100 dark:bg-zinc-100 flex items-center justify-center relative">
                      {heroSlide2 ? (
                        <img src={heroSlide2} alt="Preview 2" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      ) : (
                        <span className="text-[10px] text-zinc-400">Blank Layout</span>
                      )}
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center gap-1.5">
                        <label className="cursor-pointer px-3 py-1.5 bg-zinc-900 hover:bg-black text-white text-[9px] uppercase font-bold tracking-wider inline-flex items-center gap-1">
                          <Upload className="w-3 h-3 text-[#D4AF37]" />
                          <span>Choose device photo</span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => handleHeroFileChange(2, e)}
                          />
                        </label>
                      </div>
                      <input
                        type="text"
                        required
                        value={heroSlide2}
                        onChange={(e) => setHeroSlide2(e.target.value)}
                        className="w-full px-2 py-1 border border-zinc-201 text-[9px] focus:outline-none"
                        placeholder="Image URL..."
                      />
                    </div>
                  </div>

                  {/* Photo 3 */}
                  <div className="p-4 border border-zinc-150 dark:border-zinc-200 bg-zinc-50/50 dark:bg-zinc-50/50 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-zinc-888 dark:text-zinc-808 uppercase">Modeling Slide 3</span>
                    </div>

                    <div className="aspect-[3/4] border border-zinc-200 w-full overflow-hidden bg-zinc-100 dark:bg-zinc-100 flex items-center justify-center relative">
                      {heroSlide3 ? (
                        <img src={heroSlide3} alt="Preview 3" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      ) : (
                        <span className="text-[10px] text-zinc-400">Blank Layout</span>
                      )}
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center gap-1.5">
                        <label className="cursor-pointer px-3 py-1.5 bg-zinc-900 hover:bg-black text-white text-[9px] uppercase font-bold tracking-wider inline-flex items-center gap-1">
                          <Upload className="w-3 h-3 text-[#D4AF37]" />
                          <span>Choose device photo</span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => handleHeroFileChange(3, e)}
                          />
                        </label>
                      </div>
                      <input
                        type="text"
                        required
                        value={heroSlide3}
                        onChange={(e) => setHeroSlide3(e.target.value)}
                        className="w-full px-2 py-1 border border-zinc-201 text-[9px] focus:outline-none"
                        placeholder="Image URL..."
                      />
                    </div>
                  </div>

                </div>

                <button
                  type="submit"
                  className="px-6 py-2.5 bg-zinc-900 hover:bg-black text-white uppercase font-bold tracking-widest text-[9px] flex items-center gap-1 border border-[#D4AF37]/50 shadow-xs cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Slideshow configurations</span>
                </button>
              </form>
            </div>

            {/* Admin Account Settings Card */}
            <div className="bg-white dark:bg-white border border-zinc-205 dark:border-zinc-205 p-6 space-y-6 shadow-2xs">
              <div className="border-b border-zinc-100 dark:border-zinc-200 pb-3">
                <h3 className="text-xs font-bold font-mono tracking-widest uppercase text-zinc-900 dark:text-zinc-900">
                  Settings &rarr; Admin Account &rarr; Email &amp; Security
                </h3>
                <p className="text-[11px] text-zinc-455 mt-0.5">Revise the primary security email of the boutique database and administrator privileges</p>
              </div>

              {/* Show Currently Authenticated Admin Email */}
              <div className="p-4 bg-zinc-50 border border-zinc-150 space-y-1 font-mono text-xs">
                <div className="text-zinc-400 uppercase tracking-wider text-[9px] font-bold">Current Login Email</div>
                <div className="text-zinc-850 font-bold break-all">{user?.email || 'admin@torvifashion.com'}</div>
              </div>

              <form onSubmit={handleAdminChangeEmail} className="space-y-4 max-w-lg text-xs font-mono">
                {adminEmailChangeSuccess && (
                  <div className="p-3.5 bg-emerald-50 text-emerald-800 text-[11.5px] font-semibold border border-emerald-150 rounded-none animate-fadeIn">
                    ✓ {adminEmailChangeSuccess}
                  </div>
                )}
                {adminEmailChangeError && (
                  <div className="p-3.5 bg-rose-50 text-rose-800 text-[11.5px] font-semibold border border-rose-150 rounded-none animate-fadeIn">
                    ⚠ {adminEmailChangeError}
                  </div>
                )}

                <div className="space-y-3">
                  <div>
                    <label className="block text-[10px] uppercase tracking-wider font-bold text-zinc-500 mb-1">
                      New Email Address
                    </label>
                    <input
                      type="email"
                      required
                      value={adminNewEmail}
                      onChange={(e) => setAdminNewEmail(e.target.value)}
                      placeholder="admin@newemail.com"
                      className="w-full px-3 py-2 border border-zinc-200 focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition-all bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase tracking-wider font-bold text-zinc-500 mb-1">
                      Confirm New Email Address
                    </label>
                    <input
                      type="email"
                      required
                      value={adminNewEmailConfirm}
                      onChange={(e) => setAdminNewEmailConfirm(e.target.value)}
                      placeholder="admin@newemail.com"
                      className="w-full px-3 py-2 border border-zinc-200 focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition-all bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase tracking-wider font-bold text-zinc-500 mb-1">
                      Current Password (Re-authenticate)
                    </label>
                    <input
                      type="password"
                      required
                      value={adminCurrentPassword}
                      onChange={(e) => setAdminCurrentPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full px-3 py-2 border border-zinc-200 focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition-all bg-white"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isAdminChangingEmail}
                    className="px-6 py-2.5 bg-zinc-900 hover:bg-black disabled:bg-zinc-400 text-white uppercase font-bold tracking-widest text-[9px] flex items-center gap-1 border border-[#D4AF37]/50 shadow-xs cursor-pointer transition-all"
                  >
                    {isAdminChangingEmail ? (
                      <span>Updating security credentials...</span>
                    ) : (
                      <>
                        <Save className="w-3.5 h-3.5 text-[#D4AF37]" />
                        <span>Save Changes</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>

          </div>
        )}

      </main>

      {/* --- RE-USEABLE PURGING SAFETY POPUP MODAL --- */}
      {confirmDeleteId && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 animate-fadeIn" onClick={() => setConfirmDeleteId(null)}>
          <div className="bg-white dark:bg-white border border-zinc-205 dark:border-zinc-205 p-6 max-w-sm w-full space-y-4 shadow-xl text-left" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-start gap-4 text-rose-600">
              <ShieldAlert className="w-6 h-6 shrink-0 mt-0.5 text-rose-500" />
              <div>
                <h4 className="font-bold text-sm uppercase tracking-wider text-zinc-900 dark:text-zinc-900">Confirm Purging Product</h4>
                <p className="text-xs text-zinc-500 dark:text-zinc-500 mt-2 leading-relaxed">
                  Are you sure you want to permanently clear this design piece from database index? Relational dependencies could break if ordered in previous sessions.
                </p>
              </div>
            </div>
            
            <div className="flex justify-end gap-2.5 pt-2 font-mono">
              <button
                id="modal-confirm-delete"
                onClick={() => executeSafeDelete(confirmDeleteId)}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs uppercase tracking-wider cursor-pointer"
              >
                Clear product
              </button>
              <button
                onClick={() => setConfirmDeleteId(null)}
                className="px-4 py-2 border border-zinc-200 dark:border-zinc-200 text-zinc-650 dark:text-zinc-650 hover:bg-zinc-50 dark:hover:bg-zinc-50 font-bold text-xs uppercase tracking-wider cursor-pointer"
              >
                Retain design
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- CONFIRM PURGE CATEGORY COUPLER --- */}
      {confirmDeleteCatSlug && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-[2px] flex items-center justify-center z-50 animate-fadeIn" onClick={() => setConfirmDeleteCatSlug(null)}>
          <div className="bg-white dark:bg-white border border-zinc-205 dark:border-zinc-205 p-6 max-w-sm w-full space-y-4 shadow-xl text-left" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-start gap-4 text-rose-600">
              <ShieldAlert className="w-6 h-6 shrink-0 mt-0.5 text-rose-550" />
              <div>
                <h4 className="font-bold text-sm uppercase tracking-wider text-zinc-900 dark:text-zinc-900">Confirm Purging Division</h4>
                <p className="text-xs text-zinc-500 dark:text-zinc-500 mt-2 leading-relaxed">
                  Are you sure you want to permanently delete this category divider slug? Existing designs in this category may remain uncategorized in client storefronts.
                </p>
              </div>
            </div>
            
            <div className="flex justify-end gap-2.5 pt-2 font-mono">
              <button
                onClick={() => executeCatDelete(confirmDeleteCatSlug)}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs uppercase tracking-wider cursor-pointer"
              >
                Clear Division
              </button>
              <button
                onClick={() => setConfirmDeleteCatSlug(null)}
                className="px-4 py-2 border border-zinc-200 dark:border-zinc-200 text-zinc-650 dark:text-zinc-650 hover:bg-zinc-50 dark:hover:bg-zinc-50 font-bold text-xs uppercase tracking-wider cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
