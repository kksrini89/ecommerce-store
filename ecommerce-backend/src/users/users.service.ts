import { Injectable } from '@nestjs/common';
import { StoreService } from '../store/store.service';
import { User } from '../store/interfaces';

@Injectable()
export class UsersService {
  constructor(private readonly storeService: StoreService) {}

  getUserById(id: string): User | undefined {
    return this.storeService.getUser(id);
  }

  getAllUsers(): User[] {
    return this.storeService.getAllUsers();
  }

  validateCredentials(userId: string, password: string): User | null {
    const user = this.storeService.getUser(userId);
    if (user && user.password === password) {
      return user;
    }
    return null;
  }
}
