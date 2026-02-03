export type UserRole = 'customer' | 'seller' | 'admin';
export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'shipped'
  | 'delivered'
  | 'completed'
  | 'cancelled';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  password: string;
}

export interface Product {
  id: string;
  sellerId: string;
  name: string;
  description: string;
  price: number;
  stockQuantity: number;
  createdAt: Date;
}

export interface CartItem {
  id: string;
  userId: string;
  productId: string;
  quantity: number;
}

export interface Order {
  id: string;
  userId: string;
  subtotal: number;
  discountAmount: number;
  totalAmount: number;
  status: OrderStatus;
  discountCodeId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface DiscountCode {
  id: string;
  code: string;
  discountPercentage: number;
  customerId: string;
  generatedBySellerId: string;
  isUsed: boolean;
  usedOnOrderId?: string;
  createdAt: Date;
  expiresAt: Date;
}

export interface StoreConfig {
  discountNValue: number;
  discountPercentage: number;
}

export interface Counters {
  product: number;
  order: number;
  discountCode: number;
  cartItem: number;
  orderItem: number;
}
