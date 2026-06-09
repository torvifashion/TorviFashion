export interface Review {
  id: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  category: string; // 'Handbags' | 'Shoulder Bags' | 'Tote Bags' | 'Crossbody Bags' | 'Cosmetic Bags' | 'Jewelry Accessories' | 'Fashion Accessories'
  price: number;
  rating: number;
  reviewCount: number;
  imageUrl: string;
  isBestSeller: boolean;
  isNewArrival: boolean;
  isFeatured: boolean;
  stock: number;
  reviews: Review[];
  colors: string[];
  features: string[];
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedColor: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'customer';
  createdAt: string;
  avatar?: string;
}

export interface Order {
  id: string;
  userId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: string;
  paymentMethod: 'sslcommerz' | 'bkash' | 'nagad' | 'rocket' | 'cod';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'cod_pending';
  orderStatus: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  items: {
    productId: string;
    productName: string;
    productImage: string;
    price: number;
    quantity: number;
    color: string;
  }[];
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  couponCode?: string;
  createdAt: string;
  trackingNumber: string;
  notes?: string;
}

export interface Coupon {
  code: string;
  type: 'percentage' | 'fixed';
  value: number;
  minSpend: number;
  isActive: boolean;
  description: string;
}

export interface SalesAnalytics {
  revenue: number;
  totalOrders: number;
  totalProducts: number;
  totalCustomers: number;
  salesByDay: { day: string; amount: number }[];
  categorySales: { category: string; value: number }[];
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: string;
  isRead: boolean;
}
