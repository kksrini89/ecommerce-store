import { Test, TestingModule } from '@nestjs/testing';
import { CartService } from './cart.service';
import { StoreService } from '../store/store.service';
import { NotFoundException } from '@nestjs/common';

describe('CartService', () => {
  let service: CartService;

  const mockStoreService = {
    getCart: jest.fn(),
    saveCart: jest.fn(),
    getProduct: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CartService,
        { provide: StoreService, useValue: mockStoreService },
      ],
    }).compile();

    service = module.get<CartService>(CartService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getCart', () => {
    it('should return cart (happy path)', () => {
      const mockCartItems = [
        { id: 'item-1', userId: 'customer1', productId: 'prod-1', quantity: 2 },
      ];
      const mockProduct = {
        id: 'prod-1',
        name: 'Product 1',
        price: 100,
      };

      mockStoreService.getCart.mockReturnValue(mockCartItems);
      mockStoreService.getProduct.mockReturnValue(mockProduct);

      const result = service.getCart('customer1');

      expect(result).toBeDefined();
      expect(result.items).toHaveLength(1);
      expect(result.totalItems).toBe(2);
      expect(result.subtotal).toBe(200);
    });
  });

  describe('addToCart', () => {
    it('should add item to cart (happy path)', () => {
      const mockProduct = {
        id: 'prod-1',
        name: 'Product 1',
        price: 100,
        stockQuantity: 10,
      };

      mockStoreService.getProduct.mockReturnValue(mockProduct);
      mockStoreService.getCart.mockReturnValue([]);

      const result = service.addToCart('customer1', { productId: 'prod-1', quantity: 2 });

      expect(result.items).toHaveLength(1);
      expect(result.items[0].quantity).toBe(2);
      expect(result.totalItems).toBe(2);
    });

    it('should throw NotFoundException for non-existent product', () => {
      mockStoreService.getProduct.mockReturnValue(undefined);

      expect(() => service.addToCart('customer1', { productId: 'invalid', quantity: 1 })).toThrow(
        NotFoundException,
      );
    });
  });

  describe('removeFromCart', () => {
    it('should remove item from cart (happy path)', () => {
      const mockCartItems = [
        { id: 'item-1', userId: 'customer1', productId: 'prod-1', quantity: 2 },
      ];
      const mockProduct = {
        id: 'prod-1',
        name: 'Product 1',
        price: 100,
      };

      mockStoreService.getCart.mockReturnValue(mockCartItems);
      mockStoreService.getProduct.mockReturnValue(mockProduct);

      const result = service.removeFromCart('customer1', 'prod-1');

      expect(result.items).toHaveLength(0);
      expect(result.totalItems).toBe(0);
    });
  });
});
