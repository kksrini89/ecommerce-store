import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { StoreService } from '../store/store.service';
import { CartItem, Product } from '../store/interfaces';
import { AddToCartDto } from './dto/add-to-cart.dto';

export interface CartItemWithProduct extends CartItem {
  product: Product;
  totalPrice: number;
}

export interface CartResponse {
  items: CartItemWithProduct[];
  totalItems: number;
  subtotal: number;
}

@Injectable()
export class CartService {
  constructor(private readonly storeService: StoreService) {}

  getCart(userId: string): CartResponse {
    const cartItems = this.storeService.getCart(userId);
    const itemsWithProducts: CartItemWithProduct[] = [];
    let subtotal = 0;

    for (const item of cartItems) {
      const product = this.storeService.getProduct(item.productId);
      if (product) {
        const totalPrice = product.price * item.quantity;
        itemsWithProducts.push({
          ...item,
          product,
          totalPrice,
        });
        subtotal += totalPrice;
      }
    }

    const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

    return {
      items: itemsWithProducts,
      totalItems,
      subtotal,
    };
  }

  addToCart(userId: string, addToCartDto: AddToCartDto): CartResponse {
    const product = this.storeService.getProduct(addToCartDto.productId);

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    if (product.stockQuantity < addToCartDto.quantity) {
      throw new BadRequestException(
        `Insufficient stock. Available: ${product.stockQuantity}`,
      );
    }

    const cart = this.storeService.getCart(userId);
    const existingItemIndex = cart.findIndex(
      (item) => item.productId === addToCartDto.productId,
    );

    if (existingItemIndex > -1) {
      // Update existing item quantity
      const newQuantity =
        cart[existingItemIndex].quantity + addToCartDto.quantity;
      if (product.stockQuantity < newQuantity) {
        throw new BadRequestException(
          `Insufficient stock. Available: ${product.stockQuantity}, In cart: ${cart[existingItemIndex].quantity}`,
        );
      }
      cart[existingItemIndex].quantity = newQuantity;
    } else {
      // Add new item
      const cartItem: CartItem = {
        id: this.storeService.generateId('cart'),
        userId,
        productId: addToCartDto.productId,
        quantity: addToCartDto.quantity,
      };
      cart.push(cartItem);
    }

    this.storeService.saveCart(userId, cart);
    return this.getCart(userId);
  }

  removeFromCart(userId: string, productId: string): CartResponse {
    const cart = this.storeService.getCart(userId);
    const updatedCart = cart.filter((item) => item.productId !== productId);

    if (updatedCart.length === cart.length) {
      throw new NotFoundException('Product not found in cart');
    }

    this.storeService.saveCart(userId, updatedCart);
    return this.getCart(userId);
  }

  clearCart(userId: string): void {
    this.storeService.saveCart(userId, []);
  }
}
