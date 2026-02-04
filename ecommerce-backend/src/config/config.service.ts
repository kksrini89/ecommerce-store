import { Injectable } from '@nestjs/common';
import { StoreService } from '../store/store.service';
import { StoreConfig } from '../store/interfaces';

@Injectable()
export class ConfigService {
  constructor(private readonly storeService: StoreService) {}

  getConfig(): StoreConfig {
    return this.storeService.getStoreConfig();
  }

  updateConfig(updates: Partial<StoreConfig>): StoreConfig {
    const currentConfig = this.storeService.getStoreConfig();
    const newConfig = { ...currentConfig, ...updates };
    this.storeService.updateStoreConfig(newConfig);
    return newConfig;
  }

  getDiscountNValue(): number {
    return this.storeService.getStoreConfig().discountNValue;
  }

  setDiscountNValue(value: number): void {
    this.storeService.updateStoreConfig({
      ...this.storeService.getStoreConfig(),
      discountNValue: value,
    });
  }

  getDiscountPercentage(): number {
    return this.storeService.getStoreConfig().discountPercentage;
  }

  setDiscountPercentage(value: number): void {
    this.storeService.updateStoreConfig({
      ...this.storeService.getStoreConfig(),
      discountPercentage: value,
    });
  }
}
