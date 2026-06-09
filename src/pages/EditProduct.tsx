import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Product } from '../types';
import { 
  ArrowLeft, 
  Save, 
  Trash2, 
  Sparkles, 
  Package, 
  CheckCircle, 
  Info,
  Layers,
  Palette,
  FileText
} from 'lucide-react';

export default function EditProduct() {
  const { 
    products, 
    updateProduct, 
    deleteProduct, 
    setPage, 
    editingProductId, 
    setEditingProductId, 
    formatPrice 
  } = useApp();

  const product = products.find((p) => p.id === editingProductId);

  // Form states
  const [editName, setEditName] = useState('');
  const [editPrice, setEditPrice] = useState(45);
  const [editPriceCurrency, setEditPriceCurrency] = useState<'USD' | 'BDT'>('USD');
  const [editCategory, setEditCategory] = useState('Handbags');
  const [editDescription, setEditDescription] = useState('');
  const [editImageUrl, setEditImageUrl] = useState('');
  const [editStock, setEditStock] = useState(20);
  const [editColors, setEditColors] = useState('');
  const [editFeatures, setEditFeatures] = useState('');
  
  const [editIsBestSeller, setEditIsBestSeller] = useState(false);
  const [editIsNewArrival, setEditIsNewArrival] = useState(false);
  const [editIsFeatured, setEditIsFeatured] = useState(true);

  // UX states
  const [isSavingEdit, setIsSavingEdit] = useState(false);
  const [productEditSuccess, setProductEditSuccess] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const availableCategories = [
    'Handbags', 'Shoulder Bags', 'Tote Bags', 'Crossbody Bags', 
    'Cosmetic Bags', 'Jewelry Accessories', 'Fashion Accessories'
  ];

  // Initialize values when product loads
  useEffect(() => {
    if (product) {
      setEditName(product.name);
      setEditPrice(product.price);
      setEditPriceCurrency('USD'); // Default inputs are rendered in USD base initially
      setEditCategory(product.category || 'Handbags');
      setEditDescription(product.description);
      setEditImageUrl(product.imageUrl);
      setEditStock(product.stock !== undefined ? product.stock : 20);
      setEditColors(product.colors ? product.colors.join(', ') : '');
      setEditFeatures(product.features ? product.features.join(', ') : '');
      setEditIsBestSeller(!!product.isBestSeller);
      setEditIsNewArrival(!!product.isNewArrival);
      setEditIsFeatured(product.isFeatured !== undefined ? product.isFeatured : true);
      setProductEditSuccess(false);
      setErrorMessage(null);
    }
  }, [product, editingProductId]);

  if (!product) {
    return (
      <div className="max-w-xl mx-auto py-20 px-4 text-center space-y-4">
        <Package className="w-12 h-12 text-zinc-300 mx-auto" />
        <h2 className="text-xl font-bold text-zinc-900 dark:text-white">Product Not Selected</h2>
        <p className="text-xs text-zinc-500">
          No product reference was identified for editing. Head back to the control suite dashboard.
        </p>
        <button
          onClick={() => {
            setEditingProductId(null);
            setPage('torvi-control-suite-x9k27');
          }}
          className="px-4 py-2 bg-brand-charcoal hover:bg-black text-white text-xs uppercase tracking-wider font-bold transition duration-200"
        >
          Return to Admin Panel
        </button>
      </div>
    );
  }

  const handleBack = () => {
    setEditingProductId(null);
    setPage('torvi-control-suite-x9k27');
  };

  const handleSaveEditProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editName || editPrice <= 0 || !editDescription) {
      setErrorMessage('Kindly verify that the title, price, and description details are completed.');
      return;
    }

    setIsSavingEdit(true);
    setErrorMessage(null);
    setProductEditSuccess(false);

    const cleanColors = editColors.split(',').map((c) => c.trim()).filter(Boolean);
    const cleanFeatures = editFeatures.split(',').map((f) => f.trim()).filter(Boolean);

    try {
      // Replicate pricing engine conversion: if entered in BDT, standard 1 USD = 120 BDT
      const convertedPrice = editPriceCurrency === 'BDT' ? Number((editPrice / 120).toFixed(2)) : Number(editPrice);
      
      const payload = {
        name: editName,
        price: convertedPrice,
        category: editCategory,
        description: editDescription,
        imageUrl: editImageUrl.trim() || product.imageUrl,
        stock: Number(editStock),
        colors: cleanColors,
        features: cleanFeatures,
        isBestSeller: editIsBestSeller,
        isNewArrival: editIsNewArrival,
        isFeatured: editIsFeatured
      };

      await updateProduct(product.id, payload);
      setProductEditSuccess(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      
      // Update local states values to sync with changed currency representation
      if (editPriceCurrency === 'BDT') {
        setEditPrice(Number((convertedPrice * 120).toFixed(2)));
      } else {
        setEditPrice(convertedPrice);
      }
      
      setTimeout(() => setProductEditSuccess(false), 5000);
    } catch (err) {
      console.error('Failed to update product details:', err);
      setErrorMessage('Communication error updating boutique products metadata on backend ledger.');
    } finally {
      setIsSavingEdit(false);
    }
  };

  const executeSafeDelete = async () => {
    try {
      await deleteProduct(product.id);
      localStorage.setItem('torvi_delete_success', 'Product deleted successfully');
      setEditingProductId(null);
      setPage('torvi-control-suite-x9k27');
    } catch (err: any) {
      console.error('Failed to delete product:', err);
      setErrorMessage(err?.message || 'Server rejected requests to wipe active catalog references.');
    }
  };

  // Preview Product definition computed dynamically on every input update
  const previewProduct: Product = {
    ...product,
    name: editName || 'Boutique Product Title',
    price: editPriceCurrency === 'BDT' ? Number((editPrice / 120).toFixed(2)) : Number(editPrice),
    category: editCategory,
    description: editDescription || 'Detailed specifications description will print here when populated.',
    imageUrl: editImageUrl.trim() || product.imageUrl,
    stock: Number(editStock),
    colors: editColors.split(',').map((c) => c.trim()).filter(Boolean),
    features: editFeatures.split(',').map((f) => f.trim()).filter(Boolean),
    isBestSeller: editIsBestSeller,
    isNewArrival: editIsNewArrival,
    isFeatured: editIsFeatured
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 font-sans text-left space-y-6">
      
      {/* Back to admin navigation controls */}
      <div className="flex items-center justify-between">
        <button
          onClick={handleBack}
          className="group px-3 py-1.5 text-xs text-zinc-600 dark:text-zinc-400 hover:text-brand-charcoal dark:hover:text-white inline-flex items-center space-x-1 border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-brand-dark-card transition duration-250 hover:shadow-xs"
        >
          <ArrowLeft className="w-4 h-4 text-brand-gold transition-transform group-hover:-translate-x-0.5" />
          <span>Exit Workspace (Go Back)</span>
        </button>
        <span className="text-[10px] text-zinc-400 dark:text-zinc-500 font-mono uppercase tracking-widest">
          Catalog Workspace / Edit Mode
        </span>
      </div>

      {/* Hero-like Title panel */}
      <div className="border-b border-brand-border dark:border-brand-dark-border pb-6 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <span className="text-xs uppercase tracking-widest text-[#D4AF37] font-bold">Torvi Product Editing Terminal</span>
          <h1 className="text-3xl font-sans tracking-tight text-brand-charcoal dark:text-white font-light mt-1">
            Edit: <span className="font-serif italic text-brand-gold">{product.name}</span>
          </h1>
        </div>
        <p className="text-xs text-zinc-400 font-mono py-1 px-2.5 bg-[#FCFAF8] dark:bg-brand-dark-card border border-brand-border dark:border-brand-dark-border">
          Status: <span className="text-emerald-500 font-bold uppercase tracking-wider text-[10px]">Active Listing</span>
        </p>
      </div>

      {/* Page Content layout: Form left, Preview right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN: The Dedicated Form */}
        <div className="lg:col-span-7 bg-white dark:bg-brand-dark-card border border-zinc-200 dark:border-zinc-850 p-6 space-y-6">
          
          <div className="flex items-center justify-between border-b border-brand-border dark:border-brand-dark-border pb-3.5">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-4.5 h-4.5 text-[#D4AF37]" />
              <h2 className="text-sm font-bold tracking-widest uppercase text-brand-charcoal dark:text-zinc-250">
                Update Asset Metadata
              </h2>
            </div>
            <span className="text-[9px] text-[#D4AF37] border border-[#D4AF37]/20 px-2 py-0.5 bg-amber-500/5 font-mono">
              ID: <strong className="uppercase">{product.id}</strong>
            </span>
          </div>

          {/* Toast/Notification alerts */}
          {productEditSuccess && (
            <div className="p-3.5 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 text-xs border border-emerald-200 flex items-center space-x-2.5 font-medium animate-fadeIn">
              <CheckCircle className="w-4.5 h-4.5 text-emerald-500 shrink-0" />
              <span>✓ Boutique detail modifications successfully pushed on public servers!</span>
            </div>
          )}

          {errorMessage && (
            <div className="p-3.5 bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400 text-xs border border-rose-200 flex items-center space-x-2 font-medium">
              <Info className="w-4.5 h-4.5 text-rose-500 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSaveEditProduct} className="space-y-5 text-xs text-left">
            
            {/* Title / Name */}
            <div className="space-y-1">
              <label className="text-zinc-500 dark:text-zinc-400 block font-bold uppercase tracking-wider text-[9px]">
                Product Name Key *
              </label>
              <input
                id="edit-page-name"
                type="text"
                required
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                placeholder="e.g. Vintage Leather Hobo"
                className="w-full px-3 py-2.5 rounded-none border border-brand-border dark:border-brand-dark-border bg-[#FCFAF8] dark:bg-zinc-900 text-brand-charcoal dark:text-white font-medium focus:outline-none focus:border-brand-gold"
              />
            </div>

            {/* Segment Category and Stock Rate Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              <div className="space-y-1">
                <label className="text-zinc-500 dark:text-zinc-400 block font-bold uppercase tracking-wider text-[9px]">
                  Boutique Segment
                </label>
                <select
                  id="edit-page-category"
                  value={editCategory}
                  onChange={(e) => setEditCategory(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-none border border-brand-border dark:border-brand-dark-border bg-[#FCFAF8] dark:bg-zinc-900 text-brand-charcoal dark:text-white focus:outline-none focus:border-brand-gold"
                >
                  {availableCategories.map((catKey) => (
                    <option key={catKey} value={catKey}>{catKey}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-zinc-500 dark:text-zinc-400 block font-bold uppercase tracking-wider text-[9px]">
                  Stock Units Remaining *
                </label>
                <input
                  id="edit-page-stock"
                  type="number"
                  required
                  min="0"
                  value={editStock}
                  onChange={(e) => setEditStock(Number(e.target.value))}
                  className="w-full px-3 py-2.5 rounded-none border border-brand-border dark:border-brand-dark-border bg-[#FCFAF8] dark:bg-zinc-900 text-brand-charcoal dark:text-white focus:outline-none focus:border-brand-gold font-mono"
                />
              </div>

            </div>

            {/* Price with convertible Currency toggle tool */}
            <div className="space-y-1.5 p-3.5 bg-zinc-50 dark:bg-zinc-950 border border-zinc-150 dark:border-zinc-850">
              <div className="flex items-center justify-between">
                <label className="text-zinc-500 dark:text-zinc-400 block font-bold uppercase tracking-wider text-[9px]">
                  Sales Pricing Strategy *
                </label>
                
                <div className="flex bg-zinc-200 dark:bg-zinc-850 p-0.5 rounded text-[9px] font-mono border border-zinc-300 dark:border-zinc-800">
                  <button
                    type="button"
                    onClick={() => setEditPriceCurrency('USD')}
                    className={`px-2 py-0.5 transition-all duration-150 ${
                      editPriceCurrency === 'USD' 
                        ? 'bg-zinc-900 text-white dark:bg-zinc-200 dark:text-zinc-950 font-bold' 
                        : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-700'
                    }`}
                  >
                    USD ($)
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditPriceCurrency('BDT')}
                    className={`px-2 py-0.5 transition-all duration-150 ${
                      editPriceCurrency === 'BDT' 
                        ? 'bg-zinc-900 text-white dark:bg-zinc-200 dark:text-zinc-950 font-bold' 
                        : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-700'
                    }`}
                  >
                    BDT (৳)
                  </button>
                </div>
              </div>

              <div className="relative">
                <input
                  id="edit-page-price"
                  type="number"
                  required
                  min="1"
                  step="any"
                  value={editPrice}
                  onChange={(e) => setEditPrice(Number(e.target.value))}
                  className="w-full pl-3 pr-10 py-2 rounded-none border border-brand-border dark:border-brand-dark-border bg-white dark:bg-zinc-900 text-brand-charcoal dark:text-white focus:outline-none focus:border-brand-gold font-mono text-sm font-semibold"
                />
                <span className="absolute right-3.5 top-2 text-xs text-zinc-500 dark:text-zinc-400 font-bold font-mono">
                  {editPriceCurrency === 'USD' ? 'USD ($)' : 'BDT (৳)'}
                </span>
              </div>

              <div className="flex items-center justify-between text-[10px] text-zinc-400 font-mono italic">
                <span>Calculated system value:</span>
                <span>
                  {editPriceCurrency === 'USD' 
                    ? `≈ ৳${(editPrice * 120).toFixed(2)} BDT` 
                    : `≈ $${(editPrice / 120).toFixed(2)} USD (at 1 USD = 120 BDT exchange factor)`
                  }
                </span>
              </div>
            </div>

            {/* Sourcing Image with Device Upload option */}
            <div className="space-y-1">
              <label className="text-zinc-500 dark:text-zinc-400 block font-bold uppercase tracking-wider text-[9px]">
                Product Image Source (ইমেজ সোর্স)
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                <div className="space-y-1">
                  <span className="text-[8px] text-zinc-400 uppercase tracking-widest block font-bold font-mono">Option A: Sourcing URL</span>
                  <input
                    id="edit-page-image"
                    type="text"
                    placeholder="Unsplash URL or remote hosted path"
                    value={editImageUrl}
                    onChange={(e) => setEditImageUrl(e.target.value)}
                    className="w-full px-3 py-2 rounded-none border border-brand-border dark:border-brand-dark-border bg-[#FCFAF8] dark:bg-zinc-900 text-brand-charcoal dark:text-white text-[10px] focus:outline-none focus:border-brand-gold font-mono"
                  />
                </div>
                <div className="space-y-1">
                  <span className="text-[8px] text-zinc-400 uppercase tracking-widest block font-bold font-mono font-bold">Option B: Upload from Device</span>
                  <div className="relative border border-dashed border-zinc-300 dark:border-zinc-700 bg-[#FCFAF8] dark:bg-zinc-900 px-3 py-2 text-center cursor-pointer hover:border-[#D4AF37] transition duration-200">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = (event) => {
                            const dataUrl = event.target?.result as string;
                            setEditImageUrl(dataUrl);
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                      className="absolute inset-0 opacity-0 cursor-pointer h-full w-full"
                    />
                    <span className="text-[10px] text-zinc-500 font-medium font-mono">Choose Image File...</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Flags checkbox strip */}
            <div className="p-3 bg-zinc-50 dark:bg-zinc-950 border border-brand-border dark:border-brand-dark-border grid grid-cols-3 gap-2.5">
              <label className="flex items-center space-x-1.5 cursor-pointer selection:bg-transparent">
                <input 
                  type="checkbox"
                  checked={editIsBestSeller}
                  onChange={(e) => setEditIsBestSeller(e.target.checked)}
                  className="accent-brand-pink-dark w-3.5 h-3.5"
                />
                <span className="text-[10px] font-bold text-zinc-650 dark:text-zinc-350">BestSeller</span>
              </label>

              <label className="flex items-center space-x-1.5 cursor-pointer selection:bg-transparent">
                <input 
                  type="checkbox"
                  checked={editIsNewArrival}
                  onChange={(e) => setEditIsNewArrival(e.target.checked)}
                  className="accent-brand-pink-dark w-3.5 h-3.5"
                />
                <span className="text-[10px] font-bold text-zinc-650 dark:text-zinc-350">New Arrival</span>
              </label>

              <label className="flex items-center space-x-1.5 cursor-pointer selection:bg-transparent">
                <input 
                  type="checkbox"
                  checked={editIsFeatured}
                  onChange={(e) => setEditIsFeatured(e.target.checked)}
                  className="accent-brand-pink-dark w-3.5 h-3.5"
                />
                <span className="text-[10px] font-bold text-zinc-650 dark:text-zinc-350">Featured Selection</span>
              </label>
            </div>

            {/* Colors */}
            <div className="space-y-1">
              <div className="flex items-center space-x-1">
                <Palette className="w-3.5 h-3.5 text-zinc-400" />
                <label className="text-zinc-500 dark:text-zinc-400 block font-bold uppercase tracking-wider text-[9px]">
                  Color Palette Variants (Comma Separated)
                </label>
              </div>
              <input
                id="edit-page-colors"
                type="text"
                placeholder="e.g. Onyx, Crimson Rose, Pastel Ivory"
                value={editColors}
                onChange={(e) => setEditColors(e.target.value)}
                className="w-full px-3 py-2.5 rounded-none border border-brand-border dark:border-brand-dark-border bg-[#FCFAF8] dark:bg-zinc-900 text-brand-charcoal dark:text-white focus:outline-none focus:border-brand-gold"
              />
            </div>

            {/* Features list */}
            <div className="space-y-1">
              <div className="flex items-center space-x-1">
                <Layers className="w-3.5 h-3.5 text-zinc-400" />
                <label className="text-zinc-500 dark:text-zinc-400 block font-bold uppercase tracking-wider text-[9px]">
                  Material Attributes / Highlights List (Comma Separated)
                </label>
              </div>
              <textarea
                id="edit-page-features"
                rows={2}
                placeholder="e.g. Premium top grain hide, Solid brass rivets, Dual storage pockets"
                value={editFeatures}
                onChange={(e) => setEditFeatures(e.target.value)}
                className="w-full px-3 py-2.5 rounded-none border border-brand-border dark:border-brand-dark-border bg-[#FCFAF8] dark:bg-zinc-900 text-brand-charcoal dark:text-white focus:outline-none focus:border-brand-gold"
              />
            </div>

            {/* Description */}
            <div className="space-y-1">
              <div className="flex items-center space-x-1">
                <FileText className="w-3.5 h-3.5 text-zinc-400" />
                <label className="text-zinc-500 dark:text-zinc-400 block font-bold uppercase tracking-wider text-[9px]">
                  Detailed Specifications Overview *
                </label>
              </div>
              <textarea
                id="edit-page-desc"
                required
                rows={4}
                placeholder="Full marketing description..."
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                className="w-full px-3 py-2.5 rounded-none border border-brand-border dark:border-brand-dark-border bg-[#FCFAF8] dark:bg-zinc-900 text-brand-charcoal dark:text-white focus:outline-none focus:border-brand-gold font-sans leading-relaxed text-xs"
              />
            </div>

            {/* Actions button group */}
            <div className="border-t border-zinc-150 dark:border-zinc-850 pt-5 flex flex-col sm:flex-row gap-3.5">
              
              <button
                id="edit-page-submit-btn"
                type="submit"
                disabled={isSavingEdit}
                className="flex-1 py-3 bg-[#D4AF37] hover:bg-amber-600 active:bg-amber-700 text-white rounded-none font-bold uppercase tracking-widest text-[11px] transition shadow-xs flex items-center justify-center space-x-1.5"
              >
                <Save className="w-4 h-4" />
                <span>{isSavingEdit ? 'Deploying and Syncing...' : 'Deploy Asset Core modifications'}</span>
              </button>

              <button
                type="button"
                onClick={handleBack}
                className="px-6 py-3 bg-zinc-200 hover:bg-zinc-300 dark:bg-zinc-800 dark:hover:bg-zinc-750 text-zinc-700 dark:text-zinc-200 rounded-none uppercase tracking-widest font-bold text-[10px] transition"
              >
                Cancel Changes
              </button>

            </div>

          </form>

          {/* DANGER ESCALATION ACTION SECTION */}
          <div className="mt-8 border-t border-rose-200/50 pt-6 space-y-4">
            <h3 className="text-[10px] font-bold tracking-widest text-rose-500 uppercase">
              Danger Administrative Actions
            </h3>
            
            {!confirmDelete ? (
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 bg-rose-500/5 border border-rose-200/40 rounded-none">
                <div className="text-left">
                  <p className="text-xs font-semibold text-rose-700 dark:text-rose-400">Purge Listing From Catalog</p>
                  <p className="text-[10px] text-zinc-400 mt-0.5">This action immediately wipes this product out of checkout and shop views permanently.</p>
                </div>
                <button
                  id="edit-page-trigger-delete"
                  type="button"
                  onClick={() => setConfirmDelete(true)}
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-[10px] uppercase tracking-wider rounded-none shrink-0 transition"
                >
                  <Trash2 className="w-3.5 h-3.5 inline mr-1" />
                  Wipe Product
                </button>
              </div>
            ) : (
              <div className="p-4 bg-rose-600 text-white border border-rose-700 rounded-none space-y-3 animate-fadeIn text-left">
                <div className="flex items-start space-x-3">
                  <Trash2 className="w-5 h-5 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-xs uppercase tracking-wider">Irreversible Action Warning Alert</h4>
                    <p className="text-[10px] leading-relaxed text-zinc-100 mt-1">
                      Wiping <strong className="underline">{product.name}</strong> can break outstanding orders referential links. Are you sure you want to delete this product?
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2.5 pt-1.5 pl-8">
                  <button
                    id="edit-page-confirm-delete"
                    type="button"
                    onClick={executeSafeDelete}
                    className="px-3.5 py-1 text-[10px] bg-black text-rose-300 font-bold uppercase tracking-wider hover:bg-zinc-950 transition"
                  >
                    Yes, Delete Forever
                  </button>
                  <button
                    type="button"
                    onClick={() => setConfirmDelete(false)}
                    className="px-3.5 py-1 text-[10px] bg-white/20 text-white font-bold uppercase tracking-wider hover:bg-white/30 transition"
                  >
                    Cancel Action
                  </button>
                </div>
              </div>
            )}
          </div>

        </div>

        {/* RIGHT COLUMN: Real-Time Store Preview Simulator */}
        <div className="lg:col-span-5 space-y-6">
          
          <div className="sticky top-6 space-y-6">
            
            <div className="bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-4">
              <span className="text-[9px] text-[#D4AF37] tracking-widest uppercase font-mono block">
                Store Simulation HUD
              </span>
              <h3 className="text-xs font-bold text-zinc-900 dark:text-zinc-200 mt-0.5">
                Real-Time Premium Preview
              </h3>
            </div>

            {/* Product Card Simulator */}
            <div className="bg-white dark:bg-brand-dark-card border border-brand-border dark:border-brand-dark-border p-4 space-y-4 max-w-sm mx-auto shadow-xs">
              
              <div className="relative aspect-square w-full bg-[#FAF7F2] dark:bg-zinc-950 overflow-hidden border border-brand-border/10">
                <img 
                  src={previewProduct.imageUrl} 
                  alt={previewProduct.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover transition duration-300 hover:scale-105"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1547949003-9792a18a2601?w=800&auto=format&fit=crop&q=80';
                  }}
                />
                
                {/* Simulated Tags */}
                {previewProduct.isBestSeller && (
                  <span className="absolute top-2 left-2 px-1.5 py-0.5 bg-amber-100 text-amber-700 text-[8px] font-bold uppercase tracking-wide">
                    BestSeller
                  </span>
                )}
                {previewProduct.isNewArrival && (
                  <span className="absolute top-2 right-2 px-1.5 py-0.5 bg-indigo-150 text-indigo-700 text-[8px] font-bold uppercase tracking-wide">
                    New Arrival
                  </span>
                )}
              </div>

              <div className="space-y-2 text-left">
                
                {/* Category tag */}
                <span className="text-[8px] uppercase tracking-widest text-[#D4AF37] font-bold font-mono">
                  {previewProduct.category}
                </span>

                <h4 className="text-sm font-semibold text-brand-charcoal dark:text-white line-clamp-1">
                  {previewProduct.name}
                </h4>

                {/* Rating mockup */}
                <div className="flex items-center space-x-1">
                  <div className="flex text-[#D4AF37] text-[10px]">★★★★★</div>
                  <span className="text-[10px] text-zinc-400 font-mono">({previewProduct.reviewCount || 0})</span>
                </div>

                {/* Pricing row with current app view currency format styling! */}
                <div className="pt-2 border-t border-brand-border/10 flex items-center justify-between">
                  <div>
                    <span className="text-[8px] uppercase text-zinc-400 font-mono block">Estimated Cost</span>
                    <span className="text-sm font-bold text-brand-charcoal dark:text-white font-mono">
                      {formatPrice(previewProduct.price)}
                    </span>
                  </div>
                  
                  {/* Stock status indicator badge */}
                  <div className="text-right">
                    <span className="text-[8px] uppercase text-zinc-400 font-mono block">Inventory count</span>
                    <span className={`text-[10px] font-bold font-mono ${previewProduct.stock <= 0 ? 'text-red-500' : previewProduct.stock < 5 ? 'text-amber-500' : 'text-zinc-500'}`}>
                      {previewProduct.stock <= 0 ? 'Out of stock' : `${previewProduct.stock} units`}
                    </span>
                  </div>
                </div>

              </div>
            </div>

            {/* Spec Details Preview Sheet */}
            <div className="bg-white dark:bg-brand-dark-card border border-brand-border dark:border-brand-dark-border p-5 text-left space-y-4">
              <span className="text-[9px] text-[#D4AF37] tracking-widest font-mono uppercase block">
                Detailed Specs Preview (From Detail Page)
              </span>

              <div className="space-y-2">
                <h4 className="text-xs font-bold text-zinc-850 dark:text-zinc-200">Material Attributes Tagged</h4>
                {previewProduct.features && previewProduct.features.length > 0 ? (
                  <div className="flex flex-wrap gap-1.5">
                    {previewProduct.features.map((feat, i) => (
                      <span key={i} className="px-2 py-0.5 bg-zinc-100 dark:bg-zinc-800 text-zinc-650 dark:text-zinc-400 text-[10px]">
                        {feat}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-[10px] text-zinc-400 italic">No material attributes listed.</p>
                )}
              </div>

              <div className="space-y-1.5">
                <h4 className="text-xs font-bold text-zinc-850 dark:text-zinc-200">Color Palette Variants</h4>
                {previewProduct.colors && previewProduct.colors.length > 0 ? (
                  <div className="flex items-center space-x-1 flex-wrap gap-y-1">
                    {previewProduct.colors.map((col, i) => (
                      <span key={i} className="px-2 py-0.5 bg-[#FAF7F2] dark:bg-zinc-900 border border-brand-border/15 shrink-0 text-zinc-650 dark:text-zinc-350 text-[10px] rounded-none">
                        {col}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-[10px] text-zinc-400 italic">No colors cataloged.</p>
                )}
              </div>

              <div className="space-y-1 pt-2 border-t border-brand-border/10">
                <h4 className="text-xs font-bold text-zinc-850 dark:text-zinc-200">Specifications Overview</h4>
                <p className="text-[11px] text-zinc-500 leading-relaxed font-sans line-clamp-4">
                  {previewProduct.description}
                </p>
              </div>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
