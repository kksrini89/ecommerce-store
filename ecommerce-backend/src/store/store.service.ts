import { Injectable, OnModuleInit } from '@nestjs/common';
import {
  User,
  Product,
  CartItem,
  Order,
  OrderItem,
  DiscountCode,
  StoreConfig,
  Counters,
} from './interfaces';

@Injectable()
export class StoreService implements OnModuleInit {
  // Data storage using Maps for O(1) lookups
  private users = new Map<string, User>();
  private products = new Map<string, Product>();
  private carts = new Map<string, CartItem[]>(); // userId -> CartItem[]
  private orders = new Map<string, Order>();
  private orderItems = new Map<string, OrderItem[]>(); // orderId -> OrderItem[]
  private discountCodes = new Map<string, DiscountCode>();

  // Configuration
  private storeConfig: StoreConfig = {
    discountNValue: 3,
    discountPercentage: 10,
  };

  // ID counters
  private counters: Counters = {
    product: 0,
    order: 0,
    discountCode: 0,
    cartItem: 0,
    orderItem: 0,
  };

  onModuleInit() {
    this.seedStaticUsers();
  }

  // Seed 5 static users
  private seedStaticUsers() {
    const staticUsers: User[] = [
      {
        id: 'customer1',
        name: 'Customer One',
        email: 'customer1@store.com',
        role: 'customer',
        password: 'password123',
      },
      {
        id: 'customer2',
        name: 'Customer Two',
        email: 'customer2@store.com',
        role: 'customer',
        password: 'password123',
      },
      {
        id: 'seller1',
        name: 'Seller One',
        email: 'seller1@store.com',
        role: 'seller',
        password: 'password123',
      },
      {
        id: 'seller2',
        name: 'Seller Two',
        email: 'seller2@store.com',
        role: 'seller',
        password: 'password123',
      },
      {
        id: 'admin1',
        name: 'Admin One',
        email: 'admin1@store.com',
        role: 'admin',
        password: 'password123',
      },
    ];

    staticUsers.forEach((user) => this.users.set(user.id, user));
  }

  // User operations
  getUser(id: string): User | undefined {
    return this.users.get(id);
  }

  getAllUsers(): User[] {
    return Array.from(this.users.values());
  }

  // Product operations
  getProduct(id: string): Product | undefined {
    return this.products.get(id);
  }

  getAllProducts(): Product[] {
    return Array.from(this.products.values());
  }

  getProductsBySeller(sellerId: string): Product[] {
    return this.getAllProducts().filter((p) => p.sellerId === sellerId);
  }

  saveProduct(product: Product): void {
    this.products.set(product.id, product);
  }

  deleteProduct(id: string): void {
    this.products.delete(id);
  }

  // Cart operations
  getCart(userId: string): CartItem[] {
    return this.carts.get(userId) || [];
  }

  saveCart(userId: string, cart: CartItem[]): void {
    this.carts.set(userId, cart);
  }

  // Order operations
  getOrder(id: string): Order | undefined {
    return this.orders.get(id);
  }

  getAllOrders(): Order[] {
    return Array.from(this.orders.values());
  }

  getOrdersByUser(userId: string): Order[] {
    return this.getAllOrders().filter((o) => o.userId === userId);
  }

  saveOrder(order: Order): void {
    this.orders.set(order.id, order);
  }

  // OrderItem operations
  getOrderItems(orderId: string): OrderItem[] {
    return this.orderItems.get(orderId) || [];
  }

  saveOrderItems(orderId: string, items: OrderItem[]): void {
    this.orderItems.set(orderId, items);
  }

  // DiscountCode operations
  getDiscountCode(id: string): DiscountCode | undefined {
    return this.discountCodes.get(id);
  }

  getDiscountCodeByCode(code: string): DiscountCode | undefined {
    return this.getAllDiscountCodes().find((dc) => dc.code === code);
  }

  getAllDiscountCodes(): DiscountCode[] {
    return Array.from(this.discountCodes.values());
  }

  getDiscountCodesByCustomer(customerId: string): DiscountCode[] {
    return this.getAllDiscountCodes().filter(
      (dc) => dc.customerId === customerId,
    );
  }

  getDiscountCodesBySeller(sellerId: string): DiscountCode[] {
    return this.getAllDiscountCodes().filter(
      (dc) => dc.generatedBySellerId === sellerId,
    );
  }

  saveDiscountCode(discountCode: DiscountCode): void {
    this.discountCodes.set(discountCode.id, discountCode);
  }

  // StoreConfig operations
  getStoreConfig(): StoreConfig {
    return { ...this.storeConfig };
  }

  updateStoreConfig(config: Partial<StoreConfig>): void {
    this.storeConfig = { ...this.storeConfig, ...config };
  }

  // ID generation
  generateId(prefix: string): string {
    return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  getNextCounter(type: keyof Counters): number {
    this.counters[type]++;
    return this.counters[type];
  }
}
