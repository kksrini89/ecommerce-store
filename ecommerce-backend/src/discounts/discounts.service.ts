import { Injectable } from '@nestjs/common';
import { StoreService } from '../store/store.service';
import { DiscountCode } from '../store/interfaces';

@Injectable()
export class DiscountsService {
  constructor(private readonly storeService: StoreService) {}

  validateDiscountCode(
    code: string,
    customerId: string,
  ): { valid: boolean; discountCode?: DiscountCode; message?: string } {
    const discountCode = this.storeService.getDiscountCodeByCode(code);

    if (!discountCode) {
      return { valid: false, message: 'Invalid discount code' };
    }

    if (discountCode.isUsed) {
      return { valid: false, message: 'Discount code has already been used' };
    }

    if (new Date() > discountCode.expiresAt) {
      return { valid: false, message: 'Discount code has expired' };
    }

    if (discountCode.customerId && discountCode.customerId !== customerId) {
      return { valid: false, message: 'This discount code is not valid for your account' };
    }

    return {
      valid: true,
      discountCode,
    };
  }

  calculateDiscountAmount(discountCode: DiscountCode, subtotal: number): number {
    return (subtotal * discountCode.discountPercentage) / 100;
  }

  getCustomerDiscountCodes(customerId: string): DiscountCode[] {
    return this.storeService.getDiscountCodesByCustomer(customerId);
  }

  generateDiscountCode(
    sellerId: string,
    discountPercentage: number,
    customerId?: string,
    expiresAt?: Date,
  ): DiscountCode {
    const code: DiscountCode = {
      id: this.storeService.generateId('disc'),
      code: `SAVE${discountPercentage}-${Date.now()}`,
      discountPercentage,
      customerId,
      generatedBySellerId: sellerId,
      isUsed: false,
      createdAt: new Date(),
      expiresAt: expiresAt || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    };

    this.storeService.saveDiscountCode(code);
    return code;
  }

  getSellerDiscountCodes(sellerId: string): DiscountCode[] {
    return this.storeService.getDiscountCodesBySeller(sellerId);
  }

  getAllDiscountCodes(): DiscountCode[] {
    return this.storeService.getAllDiscountCodes();
  }
}
