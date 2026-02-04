import { Injectable, NotFoundException } from '@nestjs/common';
import { StoreService } from '../store/store.service';
import { Product } from '../store/interfaces';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
  constructor(private readonly storeService: StoreService) {}

  getAllProducts(): Product[] {
    return this.storeService.getAllProducts();
  }

  getProductById(id: string): Product | undefined {
    return this.storeService.getProduct(id);
  }

  getProductsBySeller(sellerId: string): Product[] {
    return this.storeService.getProductsBySeller(sellerId);
  }

  createProduct(sellerId: string, createProductDto: CreateProductDto): Product {
    const product: Product = {
      id: this.storeService.generateId('prod'),
      sellerId,
      name: createProductDto.name,
      description: createProductDto.description,
      price: createProductDto.price,
      stockQuantity: createProductDto.stockQuantity,
      createdAt: new Date(),
    };

    this.storeService.saveProduct(product);
    return product;
  }

  updateProduct(
    productId: string,
    sellerId: string,
    updateProductDto: UpdateProductDto,
  ): Product {
    const product = this.storeService.getProduct(productId);

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    if (product.sellerId !== sellerId) {
      throw new NotFoundException('Product not found');
    }

    const updatedProduct: Product = {
      ...product,
      ...updateProductDto,
    };

    this.storeService.saveProduct(updatedProduct);
    return updatedProduct;
  }

  deleteProduct(productId: string, sellerId: string): void {
    const product = this.storeService.getProduct(productId);

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    if (product.sellerId !== sellerId) {
      throw new NotFoundException('Product not found');
    }

    this.storeService.deleteProduct(productId);
  }
}
