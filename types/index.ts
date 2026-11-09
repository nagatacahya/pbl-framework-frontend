// types/index.ts

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: "USER" | "ADMIN";
}

export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  description?: string;
  sku: string;
  imageUrl?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface OrderItem {
  productName: string;
  qty: number;
  price: string;
  imageUrl?: string;
}

export interface Transaction {
  id: string;
  orderId: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  items: string; // JSON string dari backend
  totalPrice: number;
  paymentMethod: string;
  paymentProof?: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  category: "Pesanan" | "Pengiriman" | "Stok Produk" | "Sistem";
  isRead: boolean;
  relatedId?: string;
  createdAt: string;
}

export interface Setting {
  id: string;
  appName: string;
  businessName: string;
  description: string;
}

export interface DashboardStats {
  totalProducts: number;
  lowStock: number;
  totalTransactions: number;
  revenue: number;
}