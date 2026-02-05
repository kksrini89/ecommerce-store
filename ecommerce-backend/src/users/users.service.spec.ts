import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { StoreService } from '../store/store.service';

describe('UsersService', () => {
  let service: UsersService;

  const mockStoreService = {
    getUser: jest.fn(),
    getAllUsers: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: StoreService, useValue: mockStoreService },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getUserById', () => {
    it('should return user by id (happy path)', () => {
      const mockUser = {
        id: 'customer1',
        name: 'Customer One',
        email: 'customer1@store.com',
        role: 'customer',
        password: 'password123',
      };

      mockStoreService.getUser.mockReturnValue(mockUser);

      const result = service.getUserById('customer1');

      expect(result).toBeDefined();
      expect(result?.id).toBe('customer1');
      expect(mockStoreService.getUser).toHaveBeenCalledWith('customer1');
    });

    it('should return undefined for non-existent user', () => {
      mockStoreService.getUser.mockReturnValue(undefined);

      const result = service.getUserById('nonexistent');

      expect(result).toBeUndefined();
    });
  });

  describe('validateCredentials', () => {
    it('should return user when credentials are valid (happy path)', () => {
      const mockUser = {
        id: 'customer1',
        name: 'Customer One',
        email: 'customer1@store.com',
        role: 'customer',
        password: 'password123',
      };

      mockStoreService.getUser.mockReturnValue(mockUser);

      const result = service.validateCredentials('customer1', 'password123');

      expect(result).toBeDefined();
      expect(result?.id).toBe('customer1');
    });

    it('should return null for wrong password', () => {
      const mockUser = {
        id: 'customer1',
        password: 'correctpassword',
      };

      mockStoreService.getUser.mockReturnValue(mockUser);

      const result = service.validateCredentials('customer1', 'wrongpassword');

      expect(result).toBeNull();
    });
  });

  describe('getAllUsers', () => {
    it('should return all users (happy path)', () => {
      const mockUsers = [
        { id: 'customer1', name: 'Customer One', role: 'customer' },
        { id: 'customer2', name: 'Customer Two', role: 'customer' },
      ];

      mockStoreService.getAllUsers.mockReturnValue(mockUsers);

      const result = service.getAllUsers();

      expect(result).toHaveLength(2);
      expect(result[0].id).toBe('customer1');
    });
  });
});
