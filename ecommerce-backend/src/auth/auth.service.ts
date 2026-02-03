import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { StoreService } from '../store/store.service';
import { User } from '../store/interfaces';

@Injectable()
export class AuthService {
  constructor(
    private readonly storeService: StoreService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(userId: string, password: string): Promise<User | null> {
    const user = this.storeService.getUser(userId);
    if (user && user.password === password) {
      return user;
    }
    return null;
  }

  async login(userId: string, password: string) {
    const user = await this.validateUser(userId, password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { userId: user.id, role: user.role };
    const token = this.jwtService.sign(payload);

    return {
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    };
  }
}
