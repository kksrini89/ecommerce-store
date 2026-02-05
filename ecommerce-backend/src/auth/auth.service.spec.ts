import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { StoreService } from '../store/store.service';
import { UnauthorizedException } from '@nestjs/common';

describe('AuthService', () => {
  let service: AuthService;

  const mockStoreService = {
    getUser: jest.fn(),
  };

  const mockJwtService = {
    sign: jest.fn().mockReturnValue('mock-token'),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: StoreService, useValue: mockStoreService },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('login', () => {
    it('should login with valid credentials', async () => {
      const mockUser = {
        id: 'customer1',
        name: 'Customer One',
        email: 'customer1@store.com',
        role: 'customer',
        password: 'password123',
      };

      mockStoreService.getUser.mockReturnValue(mockUser);

      const result = await service.login('customer1', 'password123');

      expect(result.success).toBe(true);
      expect(result.token).toBe('mock-token');
      expect(result.user.id).toBe('customer1');
      expect(mockJwtService.sign).toHaveBeenCalledWith({
        userId: mockUser.id,
        role: mockUser.role,
      });
    });

    it('should throw UnauthorizedException with invalid user', async () => {
      mockStoreService.getUser.mockReturnValue(undefined);

      await expect(service.login('invalid', 'password')).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should throw UnauthorizedException with invalid password', async () => {
      const mockUser = {
        id: 'customer1',
        password: 'correctpassword',
      };

      mockStoreService.getUser.mockReturnValue(mockUser);

      await expect(service.login('customer1', 'wrongpassword')).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });

  describe('validateUser', () => {
    it('should return user when credentials are valid', async () => {
      const mockUser = {
        id: 'customer1',
        name: 'Customer One',
        email: 'customer1@store.com',
        role: 'customer',
        password: 'password123',
      };

      mockStoreService.getUser.mockReturnValue(mockUser);

      const result = await service.validateUser('customer1', 'password123');

      expect(result).toBeDefined();
      expect(result?.id).toBe('customer1');
    });

    it('should return null when credentials are invalid', async () => {
      mockStoreService.getUser.mockReturnValue(undefined);

      const result = await service.validateUser('invalid', 'password');

      expect(result).toBeNull();
    });
  });
});
