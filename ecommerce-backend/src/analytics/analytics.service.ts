import { Injectable } from '@nestjs/common';
import { StoreService } from '../store/store.service';
import { Order, User } from '../store/interfaces';

export interface AnalyticsData {
  totalRevenue: number;
  totalItemsSold: number;
  totalOrders: number;
  totalDiscountCodesGenerated: number;
  totalDiscountAmount: number;
  averageOrderValue: number;
}

export interface SellerAnalytics {
  sellerId: string;
  totalRevenue: number;
  itemsSold: number;
  ordersCount: number;
  productsSold: { productId: string; name: string; quantity: number; revenue: number }[];
}

export interface DateRange {
  startDate?: Date;
  endDate?: Date;
}

@Injectable()
export class AnalyticsService {
  constructor(private readonly storeService: StoreService) {}

  private filterOrdersByDate(orders: Order[], dateRange?: DateRange): Order[] {
    if (!dateRange) return orders;
    
    return orders.filter((order) => {
      const orderDate = new Date(order.createdAt);
      if (dateRange.startDate && orderDate < dateRange.startDate) return false;
      if (dateRange.endDate && orderDate > dateRange.endDate) return false;
      return true;
    });
  }

  getStoreAnalytics(dateRange?: DateRange): AnalyticsData {
    const allOrders = this.storeService.getAllOrders();
    const filteredOrders = this.filterOrdersByDate(allOrders, dateRange);
    
    // Only count completed/delivered orders for revenue
    const completedOrders = filteredOrders.filter(
      (o) => o.status === 'completed' || o.status === 'delivered'
    );

    const totalRevenue = completedOrders.reduce(
      (sum, o) => sum + o.totalAmount,
      0
    );
    const totalDiscountAmount = completedOrders.reduce(
      (sum, o) => sum + (o.discountAmount || 0),
      0
    );
    
    // Count items sold
    let totalItemsSold = 0;
    for (const order of completedOrders) {
      const items = this.storeService.getOrderItems(order.id);
      totalItemsSold += items.reduce((sum, item) => sum + item.quantity, 0);
    }

    const discountCodes = this.storeService.getAllDiscountCodes();

    return {
      totalRevenue,
      totalItemsSold,
      totalOrders: filteredOrders.length,
      totalDiscountCodesGenerated: discountCodes.length,
      totalDiscountAmount,
      averageOrderValue: completedOrders.length > 0 ? totalRevenue / completedOrders.length : 0,
    };
  }

  getSellerAnalytics(sellerId: string, dateRange?: DateRange): SellerAnalytics {
    const allOrders = this.storeService.getAllOrders();
    const filteredOrders = this.filterOrdersByDate(allOrders, dateRange);
    
    const sellerOrders: Order[] = [];
    const productSales: Map<string, { name: string; quantity: number; revenue: number }> = new Map();

    for (const order of filteredOrders) {
      const items = this.storeService.getOrderItems(order.id);
      const hasSellerProduct = items.some((item) => {
        const product = this.storeService.getProduct(item.productId);
        return product?.sellerId === sellerId;
      });

      if (hasSellerProduct) {
        sellerOrders.push(order);
        
        // Only count completed/delivered orders for revenue
        if (order.status === 'completed' || order.status === 'delivered') {
          for (const item of items) {
            const product = this.storeService.getProduct(item.productId);
            if (product?.sellerId === sellerId) {
              const current = productSales.get(item.productId) || { 
                name: product.name, 
                quantity: 0, 
                revenue: 0,
              };
              current.quantity += item.quantity;
              current.revenue += item.totalPrice;
              productSales.set(item.productId, current);
            }
          }
        }
      }
    }

    const completedOrders = sellerOrders.filter(
      (o) => o.status === 'completed' || o.status === 'delivered'
    );

    const totalRevenue = completedOrders.reduce((sum, o) => {
      const items = this.storeService.getOrderItems(o.id);
      const sellerItems = items.filter((item) => {
        const product = this.storeService.getProduct(item.productId);
        return product?.sellerId === sellerId;
      });
      return (
        sum +
        sellerItems.reduce((itemSum, item) => itemSum + item.totalPrice, 0)
      );
    }, 0);

    const itemsSold = Array.from(productSales.values()).reduce(
      (sum, p) => sum + p.quantity,
      0
    );

    return {
      sellerId,
      totalRevenue,
      itemsSold,
      ordersCount: sellerOrders.length,
      productsSold: Array.from(productSales.entries()).map(([productId, data]) => ({
        productId,
        ...data,
      })),
    };
  }

  getAllSellersAnalytics(dateRange?: DateRange): SellerAnalytics[] {
    const allUsers = this.storeService.getAllUsers();
    const sellers = allUsers.filter((user: User) => user.role === 'seller');
    return sellers.map((seller: User) => this.getSellerAnalytics(seller.id, dateRange));
  }
}
