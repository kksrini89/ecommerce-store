import { Test, TestingModule } from '@nestjs/testing';
import { ProductsService } from './products.service';
import { StoreService } from '../store/store.service';

describe('ProductsService', () => {
  let service: ProductsService;

  const mockStoreService = {
    getAllProducts: jest.fn(),
    getProduct: jest.fn(),
    saveProduct: jest.fn(),
    deleteProduct: jest.fn(),
    generateId: jest.fn().mockReturnValue('prod-test-id'),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        { provide: StoreService, useValue: mockStoreService },
      ],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllProducts', () => {
    it('should return all products (happy path)', () => {
      const mockProducts = [
        { id: 'prod-1', name: 'Product 1', price: 100 },
        { id: 'prod-2', name: 'Product 2', price: 200 },
      ];

      mockStoreService.getAllProducts.mockReturnValue(mockProducts);

      const result = service.getAllProducts();

      expect(result).toHaveLength(2);
      expect(result[0].name).toBe('Product 1');
    });
  });

  describe('getProductById', () => {
    it('should return product by id (happy path)', () => {
      const mockProduct = {
        id: 'prod-1',
        name: 'Product 1',
        price: 100,
        sellerId: 'seller1',
      };

      mockStoreService.getProduct.mockReturnValue(mockProduct);

      const result = service.getProductById('prod-1');

      expect(result).toBeDefined();
      expect(result?.id).toBe('prod-1');
    });
  });

  describe('createProduct', () => {
    it('should create product (happy path)', () => {
      const createDto = {
        name: 'New Product',
        description: 'Description',
        price: 150,
        stockQuantity: 10,
      };

      mockStoreService.saveProduct.mockImplementation((product) => product);

      const result = service.createProduct('seller1', createDto);

      expect(result).toBeDefined();
      expect(result.name).toBe('New Product');
      expect(result.sellerId).toBe('seller1');
      expect(mockStoreService.saveProduct).toHaveBeenCalled();
    });
  });

  describe('updateProduct', () => {
    it('should update product (happy path)', () => {
      const existingProduct = {
        id: 'prod-1',
        name: 'Old Name',
        price: 100,
        sellerId: 'seller1',
      };

      mockStoreService.getProduct.mockReturnValue(existingProduct);
      mockStoreService.saveProduct.mockImplementation((product) => product);

      const updateDto = { name: 'Updated Name', price: 150 };
      const result = service.updateProduct('prod-1', 'seller1', updateDto);

      expect(result).toBeDefined();
      expect(result.name).toBe('Updated Name');
      expect(result.price).toBe(150);
    });
  });
});
