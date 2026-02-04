import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { StoreService } from '../store/store.service';
import { CartService } from '../cart/cart.service';
import {
  Order,
  OrderItem,
  DiscountCode,
  OrderStatus,
} from '../store/interfaces';
import { CheckoutDto } from './dto/checkout.dto';

export interface CheckoutResult {
  order: Order;
  items: OrderItem[];
  appliedDiscount?: {
    code: string;
    discountAmount: number;
  };
}

@Injectable()
export class OrdersService {
  constructor(
    private readonly storeService: StoreService,
    private readonly cartService: CartService,
  ) {}

  getOrdersByUser(userId: string): Order[] {
    return this.storeService.getOrdersByUser(userId);
  }

  getAllOrders(): Order[] {
    return this.storeService.getAllOrders();
  }

  getOrderById(orderId: string): { order: Order; items: OrderItem[] } | null {
    const order = this.storeService.getOrder(orderId);
    if (!order) {
      return null;
    }
    const items = this.storeService.getOrderItems(orderId);
    return { order, items };
  }

  checkout(userId: string, checkoutDto: CheckoutDto): CheckoutResult {
    // Get cart
    const cart = this.cartService.getCart(userId);

    if (cart.items.length === 0) {
      throw new BadRequestException('Cart is empty');
    }

    // Validate stock availability
    for (const item of cart.items) {
      const product = this.storeService.getProduct(item.productId);
      if (!product) {
        throw new NotFoundException(`Product ${item.productId} not found`);
      }
      if (product.stockQuantity < item.quantity) {
        throw new BadRequestException(
          `Insufficient stock for ${product.name}. Available: ${product.stockQuantity}, Requested: ${item.quantity}`,
        );
      }
    }

    // Calculate totals
    const subtotal = cart.subtotal;
    let discountAmount = 0;
    let appliedDiscountCode: DiscountCode | undefined;

    // Apply discount if provided
    if (checkoutDto.discountCode) {
      const discountCode = this.storeService.getDiscountCodeByCode(
        checkoutDto.discountCode,
      );

      if (!discountCode) {
        throw new BadRequestException('Invalid discount code');
      }

      if (discountCode.customerId !== userId) {
        throw new BadRequestException(
          'This discount code is not assigned to you',
        );
      }

      if (discountCode.isUsed) {
        throw new BadRequestException('Discount code has already been used');
      }

      if (new Date() > discountCode.expiresAt) {
        throw new BadRequestException('Discount code has expired');
      }

      // Calculate discount
      discountAmount = (subtotal * discountCode.discountPercentage) / 100;
      appliedDiscountCode = discountCode;
    }

    const totalAmount = subtotal - discountAmount;

    // Create order
    const order: Order = {
      id: this.storeService.generateId('order'),
      userId,
      subtotal,
      discountAmount,
      totalAmount,
      status: 'pending',
      discountCodeId: appliedDiscountCode?.code,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.storeService.saveOrder(order);

    // Create order items and deduct stock
    const orderItems: OrderItem[] = [];
    for (const cartItem of cart.items) {
      const product = this.storeService.getProduct(cartItem.productId)!;

      // Deduct stock
      product.stockQuantity -= cartItem.quantity;
      this.storeService.saveProduct(product);

      // Create order item
      const orderItem: OrderItem = {
        id: this.storeService.generateId('item'),
        orderId: order.id,
        productId: cartItem.productId,
        quantity: cartItem.quantity,
        unitPrice: product.price,
        totalPrice: product.price * cartItem.quantity,
      };
      orderItems.push(orderItem);
    }

    this.storeService.saveOrderItems(order.id, orderItems);

    // Mark discount code as used if applied
    if (appliedDiscountCode) {
      appliedDiscountCode.isUsed = true;
      appliedDiscountCode.usedOnOrderId = order.id;
    }

    // Clear cart
    this.cartService.clearCart(userId);

    return {
      order,
      items: orderItems,
      appliedDiscount: appliedDiscountCode
        ? {
            code: appliedDiscountCode.code,
            discountAmount,
          }
        : undefined,
    };
  }

  getOrdersForSeller(sellerId: string): { order: Order; items: OrderItem[] }[] {
    const allOrders = this.storeService.getAllOrders();
    const sellerOrders: { order: Order; items: OrderItem[] }[] = [];

    for (const order of allOrders) {
      const items = this.storeService.getOrderItems(order.id);
      const hasSellerProduct = items.some((item) => {
        const product = this.storeService.getProduct(item.productId);
        return product?.sellerId === sellerId;
      });

      if (hasSellerProduct) {
        sellerOrders.push({ order, items });
      }
    }

    return sellerOrders;
  }

  private readonly validStatusTransitions: Record<
    OrderStatus,
    OrderStatus[]
  > = {
    pending: ['confirmed', 'cancelled'],
    confirmed: ['shipped', 'cancelled'],
    shipped: ['delivered', 'cancelled'],
    delivered: ['completed'],
    completed: [],
    cancelled: [],
  };

  updateOrderStatus(
    orderId: string,
    sellerId: string,
    status: OrderStatus,
  ): { order: Order; discountGenerated?: DiscountCode } {
    const order = this.storeService.getOrder(orderId);

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    // Verify seller owns products in this order
    const items = this.storeService.getOrderItems(orderId);
    const hasSellerProduct = items.some((item) => {
      const product = this.storeService.getProduct(item.productId);
      return product?.sellerId === sellerId;
    });

    if (!hasSellerProduct) {
      throw new ForbiddenException(
        'You can only update orders containing your products',
      );
    }

    // Validate status transition
    const validTransitions = this.validStatusTransitions[order.status];
    if (!validTransitions.includes(status)) {
      throw new BadRequestException(
        `Invalid status transition from ${order.status} to ${status}. Valid transitions: ${validTransitions.join(', ') || 'none'}`,
      );
    }

    order.status = status;
    order.updatedAt = new Date();
    this.storeService.saveOrder(order);

    let discountGenerated: DiscountCode | undefined;

    // Auto-generate discount code when status becomes 'completed'
    if (status === 'completed') {
      discountGenerated = this.generateDiscountForCustomer(
        order.userId,
        sellerId,
      );
    }

    return { order, discountGenerated };
  }

  private generateDiscountForCustomer(
    customerId: string,
    sellerId: string,
  ): DiscountCode | undefined {
    // Count customer's completed orders
    const completedOrders = this.storeService
      .getOrdersByUser(customerId)
      .filter((o) => o.status === 'completed');

    const config = this.storeService.getStoreConfig();
    const n = config.discountNValue;

    // Check if this is the nth completed order
    if (completedOrders.length % n === 0 && completedOrders.length > 0) {
      // Generate discount code
      const discountCode: DiscountCode = {
        id: this.storeService.generateId('disc'),
        code: `SAVE${config.discountPercentage}-${Date.now()}`,
        discountPercentage: config.discountPercentage,
        customerId,
        generatedBySellerId: sellerId,
        isUsed: false,
        createdAt: new Date(),
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      };

      this.storeService.saveDiscountCode(discountCode);
      return discountCode;
    }

    return undefined;
  }
}
