import { SetMetadata } from '@nestjs/common';
import { UserRole } from '../../store/interfaces';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles);

// Role-based convenience decorators
export const IsCustomer = () => Roles('customer');
export const IsSeller = () => Roles('seller');
export const IsAdmin = () => Roles('admin');
