import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Product, CartItem, User, Order, Coupon, SalesAnalytics, ContactMessage, Review } from '../types';

interface AppContextType {
  products: Product[];
  cart: CartItem[];
  wishlist: Product[];
  user: User | null;
  darkMode: boolean;
  currentPage: string;
  selectedProductId: string | null;
  editingProductId: string | null;
  searchQuery: string;
  categoryFilter: string;
  priceRange: [number, number];
  appliedCoupon: Coupon | null;
  activeTrackingOrder: Order | null;
  customers: any[];
  contacts: ContactMessage[];
  orders: Order[];
  analytics: SalesAnalytics | null;
  isLoading: boolean;
  currency: 'USD' | 'BDT';
  
  // Actions
  setCurrency: (currency: 'USD' | 'BDT') => void;
  formatPrice: (amountInUSD: number) => string;
  setPage: (page: string) => void;
  setSelectedProductId: (id: string | null) => void;
  setEditingProductId: (id: string | null) => void;
  setSearchQuery: (query: string) => void;
  setCategoryFilter: (category: string) => void;
  setPriceRange: (range: [number, number]) => void;
  toggleDarkMode: () => void;
  addToCart: (product: Product, quantity: number, color: string) => void;
  removeFromCart: (productId: string, color: string) => void;
  updateCartQuantity: (productId: string, color: string, quantity: number) => void;
  clearCart: () => void;
  toggleWishlist: (product: Product) => void;
  isInWishlist: (productId: string) => boolean;
  login: (email: string, name?: string) => Promise<boolean>;
  logout: () => void;
  setUser: (user: User | null) => void;
  applyCoupon: (code: string) => Promise<string | null>;
  removeCoupon: () => void;
  submitOrder: (orderData: Partial<Order>) => Promise<Order>;
  trackOrder: (trackingCode: string) => Promise<Order | null>;
  postReview: (productId: string, rating: number, comment: string) => Promise<void>;
  submitContactForm: (name: string, email: string, subject: string, message: string) => Promise<boolean>;
  
  // Admin Operations
  fetchAdminData: () => Promise<void>;
  createProduct: (productData: Partial<Product>) => Promise<void>;
  updateProduct: (id: string, productData: Partial<Product>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  updateOrderStatus: (orderId: string, status: string, paymentStatus?: string) => Promise<void>;
  fetchProducts: () => Promise<void>;
  categories: any[];
  fetchCategories: () => Promise<void>;
  createCategory: (cat: any) => Promise<boolean>;
  updateCategory: (slug: string, cat: any) => Promise<boolean>;
  deleteCategory: (slug: string) => Promise<boolean>;
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
  logoPreset: 'heritage' | 'minimalist' | 'avantgarde' | 'editorial' | 'london' | 'neonoir';
  setLogoPreset: (preset: 'heritage' | 'minimalist' | 'avantgarde' | 'editorial' | 'london' | 'neonoir') => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<Product[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [currentPage, setCurrentPageState] = useState<string>('Home');
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 300]);
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [activeTrackingOrder, setActiveTrackingOrder] = useState<Order | null>(null);
  const [currency, setCurrencyState] = useState<'USD' | 'BDT'>('USD');
  
  // Admin datasets
  const [customers, setCustomers] = useState<any[]>([]);
  const [contacts, setContacts] = useState<ContactMessage[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [analytics, setAnalytics] = useState<SalesAnalytics | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [categories, setCategories] = useState<any[]>([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [logoPreset, setLogoPresetState] = useState<'heritage' | 'minimalist' | 'avantgarde' | 'editorial' | 'london' | 'neonoir'>('heritage');

  const setLogoPreset = (val: 'heritage' | 'minimalist' | 'avantgarde' | 'editorial' | 'london' | 'neonoir') => {
    setLogoPresetState(val);
    localStorage.setItem('torvi_logo_preset', val);
  };

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.classList.add('menu-open');
    } else {
      document.body.classList.remove('menu-open');
    }
    return () => {
      document.body.classList.remove('menu-open');
    };
  }, [mobileMenuOpen]);

  // Manage navigation scrolling easily
  const setPage = (pageName: string) => {
    setCurrentPageState(pageName);
    window.scrollTo({ top: 0, behavior: 'instant' });
    try {
      if (pageName === 'torvi-control-suite-x9k27') {
        navigate('/torvi-control-suite-x9k27');
      } else if (pageName === 'Home') {
        navigate('/');
      } else if (pageName === 'Login') {
        navigate('/login');
      } else if (pageName === 'ProductDetails') {
        if (selectedProductId) {
          navigate(`/product/${selectedProductId}`);
        } else {
          navigate('/shop');
        }
      } else if (pageName === 'EditProduct') {
        if (editingProductId) {
          navigate(`/editproduct/${editingProductId}`);
        } else {
          navigate('/editproduct');
        }
      } else {
        navigate('/' + pageName.toLowerCase());
      }
    } catch (_) {}
  };

  // Sync products on mount
  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/products');
      if (res.ok) {
        const data = await res.json();
        setProducts(data);
      }
    } catch (err) {
      console.error('Error fetching products:', err);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/categories');
      if (res.ok) {
        const data = await res.json();
        setCategories(data);
      }
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  };

  const createCategory = async (catData: any) => {
    try {
      const res = await fetch('/api/categories', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'x-admin-email': user?.email || '',
          'x-admin-role': user?.role || ''
        },
        body: JSON.stringify(catData)
      });
      if (res.ok) {
        await fetchCategories();
        await fetchProducts();
        return true;
      }
    } catch (_) {}
    return false;
  };

  const updateCategory = async (slug: string, catData: any) => {
    try {
      const res = await fetch(`/api/categories/${slug}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'x-admin-email': user?.email || '',
          'x-admin-role': user?.role || ''
        },
        body: JSON.stringify(catData)
      });
      if (res.ok) {
        await fetchCategories();
        await fetchProducts();
        return true;
      }
    } catch (_) {}
    return false;
  };

  const deleteCategory = async (slug: string) => {
    try {
      const res = await fetch(`/api/categories/${slug}`, {
        method: 'DELETE',
        headers: {
          'x-admin-email': user?.email || '',
          'x-admin-role': user?.role || ''
        }
      });
      if (res.ok) {
        await fetchCategories();
        await fetchProducts();
        return true;
      }
    } catch (_) {}
    return false;
  };

  // Check LocalStorage and initial boot parameters
  useEffect(() => {
    const bootApp = async () => {
      setIsLoading(true);
      await fetchProducts();
      await fetchCategories();
      
      const storedUser = localStorage.getItem('elegance_user');
      if (storedUser) {
        try {
          setUser(JSON.parse(storedUser));
        } catch (_) {}
      }

      const storedCart = localStorage.getItem('elegance_cart');
      if (storedCart) {
        try {
          setCart(JSON.parse(storedCart));
        } catch (_) {}
      }

      const storedWishlist = localStorage.getItem('elegance_wishlist');
      if (storedWishlist) {
        try {
          setWishlist(JSON.parse(storedWishlist));
        } catch (_) {}
      }

      const storedTheme = localStorage.getItem('elegance_theme');
      if (storedTheme === 'dark') {
        setDarkMode(true);
        document.documentElement.classList.add('dark');
      }

      const storedCurrency = localStorage.getItem('elegance_currency');
      if (storedCurrency === 'BDT' || storedCurrency === 'USD') {
        setCurrencyState(storedCurrency as 'USD' | 'BDT');
      }

      const storedLogoPreset = localStorage.getItem('torvi_logo_preset');
      const validPresets = ['heritage', 'minimalist', 'avantgarde', 'editorial', 'london', 'neonoir'];
      if (storedLogoPreset && validPresets.includes(storedLogoPreset)) {
        setLogoPresetState(storedLogoPreset as 'heritage' | 'minimalist' | 'avantgarde' | 'editorial' | 'london' | 'neonoir');
      }

      setIsLoading(false);
    };

    bootApp();
  }, []);

  // Sync router navigation with Context pageState
  useEffect(() => {
    const currentPath = location.pathname;
    const securePath = atob('L3RvcnZpLWNvbnRyb2wtc3VpdGUteDlrMjc=');
    
    if (currentPath === securePath || currentPath.toLowerCase() === '/admin') {
      setCurrentPageState('torvi-control-suite-x9k27');
    } else if (currentPath === '/' || currentPath === '') {
      setCurrentPageState('Home');
    } else if (currentPath.toLowerCase().startsWith('/product/')) {
      const parts = currentPath.split('/');
      const id = parts[parts.length - 1];
      if (id) {
        setSelectedProductId(id);
      }
      setCurrentPageState('ProductDetails');
    } else if (currentPath.toLowerCase().startsWith('/editproduct/')) {
      const parts = currentPath.split('/');
      const id = parts[parts.length - 1];
      if (id) {
        setEditingProductId(id);
      }
      setCurrentPageState('EditProduct');
    } else if (currentPath.toLowerCase() === '/editproduct') {
      setCurrentPageState('EditProduct');
    } else {
      const validPages = [
        'Shop', 'Categories', 'Cart', 'Checkout', 
        'Login', 'Profile', 'OrderTracking', 'Contact', 'About', 'Wishlist'
      ];
      const matched = validPages.find(p => 
        '/' + p.toLowerCase() === currentPath.toLowerCase() || 
        (currentPath.toLowerCase() === '/login' && p === 'Login') ||
        (currentPath.toLowerCase() === '/ordertracking' && p === 'OrderTracking')
      );
      if (matched) {
        setCurrentPageState(matched);
      }
    }
  }, [location.pathname]);

  // Save Cart & Wishlist to LocalStorage on changes
  useEffect(() => {
    localStorage.setItem('elegance_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('elegance_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  const setCurrency = (nextCurr: 'USD' | 'BDT') => {
    setCurrencyState(nextCurr);
    localStorage.setItem('elegance_currency', nextCurr);
  };

  const formatPrice = (amountInUSD: number) => {
    if (currency === 'BDT') {
      const amountInBDT = Math.round(amountInUSD * 120);
      return `৳${amountInBDT.toLocaleString('en-US')}`;
    }
    return `$${amountInUSD.toFixed(2)}`;
  };

  // Dark mode handler
  const toggleDarkMode = () => {
    const nextVal = !darkMode;
    setDarkMode(nextVal);
    if (nextVal) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('elegance_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('elegance_theme', 'light');
    }
  };

  // Cart operations
  const addToCart = (product: Product, quantity: number, color: string) => {
    setCart((prev) => {
      const idx = prev.findIndex(
        (item) => item.product.id === product.id && item.selectedColor === color
      );
      if (idx !== -1) {
        const next = [...prev];
        next[idx].quantity += quantity;
        return next;
      }
      return [...prev, { product, quantity, selectedColor: color }];
    });
  };

  const removeFromCart = (productId: string, color: string) => {
    setCart((prev) => prev.filter((item) => !(item.product.id === productId && item.selectedColor === color)));
  };

  const updateCartQuantity = (productId: string, color: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId, color);
      return;
    }
    setCart((prev) => {
      return prev.map((item) => {
        if (item.product.id === productId && item.selectedColor === color) {
          return { ...item, quantity };
        }
        return item;
      });
    });
  };

  const clearCart = () => {
    setCart([]);
    setAppliedCoupon(null);
  };

  // Wishlist operations
  const toggleWishlist = (product: Product) => {
    setWishlist((prev) => {
      const exists = prev.some((item) => item.id === product.id);
      if (exists) {
        return prev.filter((item) => item.id !== product.id);
      } else {
        return [...prev, product];
      }
    });
  };

  const isInWishlist = (productId: string) => {
    return wishlist.some((item) => item.id === productId);
  };

  // Auth actions
  const login = async (email: string, name?: string) => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, name })
      });
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
        localStorage.setItem('elegance_user', JSON.stringify(data.user));
        return true;
      }
    } catch (err) {
      console.error('Error logging in:', err);
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('elegance_user');
    // If the user was in Admin or Profile, push them home
    if (currentPage === 'torvi-control-suite-x9k27' || currentPage === 'Admin' || currentPage === 'Profile') {
      setPage('Home');
    }
  };

  // Coupon handling
  const applyCoupon = async (code: string): Promise<string | null> => {
    try {
      const res = await fetch('/api/discounts');
      if (res.ok) {
        const coupons: Coupon[] = await res.json();
        const found = coupons.find((c) => c.code.toUpperCase() === code.toUpperCase() && c.isActive);
        if (found) {
          setAppliedCoupon(found);
          return null; // success
        }
      }
    } catch (_) {}
    return 'Invalid or expired discount coupon';
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
  };

  // Checkout submission
  const submitOrder = async (orderData: Partial<Order>): Promise<Order> => {
    const finalPayload = {
      ...orderData,
      userId: user?.id || 'guest-user',
      items: cart.map((item) => ({
        productId: item.product.id,
        productName: item.product.name,
        productImage: item.product.imageUrl,
        price: item.product.price,
        quantity: item.quantity,
        color: item.selectedColor
      }))
    };

    const res = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(finalPayload)
    });

    if (!res.ok) {
      throw new Error('Failed to submission order via API.');
    }

    const createdOrder: Order = await res.json();
    clearCart();
    await fetchProducts(); // refresh stock numbers
    return createdOrder;
  };

  // Tracking API
  const trackOrder = async (trackingCode: string): Promise<Order | null> => {
    try {
      const res = await fetch(`/api/orders/track/${trackingCode}`);
      if (res.ok) {
        const orderData = await res.json();
        setActiveTrackingOrder(orderData);
        return orderData;
      }
    } catch (err) {
      console.error('Error tracking order:', err);
    }
    setActiveTrackingOrder(null);
    return null;
  };

  // Reviews submission
  const postReview = async (productId: string, rating: number, comment: string) => {
    if (!user) return;
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId,
          userName: user.name,
          rating,
          comment
        })
      });
      if (res.ok) {
        await fetchProducts(); // refresh reviews state inside products
      }
    } catch (err) {
      console.error('Error posting review:', err);
    }
  };

  // Contact Message
  const submitContactForm = async (name: string, email: string, subject: string, message: string): Promise<boolean> => {
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, subject, message })
      });
      return res.ok;
    } catch (_) {
      return false;
    }
  };

  // Admin operational syncs
  const fetchAdminData = async () => {
    try {
      const headers = {
        'x-admin-email': user?.email || '',
        'x-admin-role': user?.role || ''
      };
      const [resOrders, resCustomers, resAnalytics] = await Promise.all([
        fetch('/api/orders', { headers }),
        fetch('/api/customers', { headers }),
        fetch('/api/admin/analytics', { headers })
      ]);

      if (resOrders.ok) {
        const data = await resOrders.json();
        setOrders(data);
      }
      if (resCustomers.ok) {
        const data = await resCustomers.json();
        setCustomers(data);
      }
      if (resAnalytics.ok) {
        const data = await resAnalytics.json();
        setAnalytics(data);
      }
    } catch (err) {
      console.error('Error fetching admin metadata:', err);
    }
  };

  const createProduct = async (productData: Partial<Product>) => {
    const res = await fetch('/api/products', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'x-admin-email': user?.email || '',
        'x-admin-role': user?.role || ''
      },
      body: JSON.stringify(productData)
    });
    if (res.ok) {
      await fetchProducts();
    }
  };

  const updateProduct = async (id: string, productData: Partial<Product>) => {
    const res = await fetch(`/api/products/${id}`, {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json',
        'x-admin-email': user?.email || '',
        'x-admin-role': user?.role || ''
      },
      body: JSON.stringify(productData)
    });
    if (res.ok) {
      await fetchProducts();
    }
  };

  const deleteProduct = async (id: string) => {
    const res = await fetch(`/api/products/${id}`, {
      method: 'DELETE',
      headers: {
        'x-admin-email': user?.email || '',
        'x-admin-role': user?.role || ''
      }
    });
    if (res.ok) {
      setProducts((prev) => prev.filter((p) => p.id !== id));
      await fetchProducts();
    } else {
      const errBody = await res.json().catch(() => ({}));
      throw new Error(errBody.error || 'Product deletion failed.');
    }
  };

  const updateOrderStatus = async (orderId: string, status: string, paymentStatus?: string) => {
    const payload: any = { orderStatus: status };
    if (paymentStatus) {
      payload.paymentStatus = paymentStatus;
    }
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
      await fetchAdminData();
    }
  };

  return (
    <AppContext.Provider
      value={{
        products,
        cart,
        wishlist,
        user,
        darkMode,
        currentPage,
        selectedProductId,
        editingProductId,
        searchQuery,
        categoryFilter,
        priceRange,
        appliedCoupon,
        activeTrackingOrder,
        customers,
        contacts,
        orders,
        analytics,
        isLoading,
        currency,
        setCurrency,
        formatPrice,
        setPage,
        setSelectedProductId,
        setEditingProductId,
        setSearchQuery,
        setCategoryFilter,
        setPriceRange,
        toggleDarkMode,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        toggleWishlist,
        isInWishlist,
        login,
        logout,
        setUser,
        applyCoupon,
        removeCoupon,
        submitOrder,
        trackOrder,
        postReview,
        submitContactForm,
        fetchAdminData,
        createProduct,
        updateProduct,
        deleteProduct,
        updateOrderStatus,
        fetchProducts,
        categories,
        fetchCategories,
        createCategory,
        updateCategory,
        deleteCategory,
        mobileMenuOpen,
        setMobileMenuOpen,
        logoPreset,
        setLogoPreset
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used inside an AppProvider');
  }
  return context;
};
