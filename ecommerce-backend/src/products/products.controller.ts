import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { JwtAuthGuard, RolesGuard } from '../auth/guards';
import { IsSeller, CurrentUser } from '../common';

@ApiTags('Products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all products' })
  @ApiResponse({
    status: 200,
    description: 'List of all products',
  })
  getAllProducts() {
    const products = this.productsService.getAllProducts();
    return {
      success: true,
      products,
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get product by ID' })
  @ApiResponse({
    status: 200,
    description: 'Product found',
  })
  @ApiResponse({ status: 404, description: 'Product not found' })
  getProductById(@Param('id') id: string) {
    const product = this.productsService.getProductById(id);
    if (!product) {
      return {
        success: false,
        message: 'Product not found',
      };
    }
    return {
      success: true,
      product,
    };
  }

  @Post('seller/products')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @IsSeller()
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Create a new product (Seller only)' })
  @ApiResponse({
    status: 201,
    description: 'Product created successfully',
  })
  createProduct(
    @CurrentUser('userId') sellerId: string,
    @Body() createProductDto: CreateProductDto,
  ) {
    const product = this.productsService.createProduct(
      sellerId,
      createProductDto,
    );
    return {
      success: true,
      message: 'Product created successfully',
      product,
    };
  }

  @Put('seller/products/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @IsSeller()
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Update a product (Seller only)' })
  @ApiResponse({
    status: 200,
    description: 'Product updated successfully',
  })
  @ApiResponse({ status: 404, description: 'Product not found' })
  updateProduct(
    @CurrentUser('userId') sellerId: string,
    @Param('id') productId: string,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    const product = this.productsService.updateProduct(
      productId,
      sellerId,
      updateProductDto,
    );
    return {
      success: true,
      message: 'Product updated successfully',
      product,
    };
  }

  @Delete('seller/products/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @IsSeller()
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Delete a product (Seller only)' })
  @ApiResponse({
    status: 200,
    description: 'Product deleted successfully',
  })
  @ApiResponse({ status: 404, description: 'Product not found' })
  deleteProduct(
    @CurrentUser('userId') sellerId: string,
    @Param('id') productId: string,
  ) {
    this.productsService.deleteProduct(productId, sellerId);
    return {
      success: true,
      message: 'Product deleted successfully',
    };
  }

  @Get('seller/my-products')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @IsSeller()
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: "Get seller's products (Seller only)" })
  @ApiResponse({
    status: 200,
    description: 'List of seller products',
  })
  getMyProducts(@CurrentUser('userId') sellerId: string) {
    const products = this.productsService.getProductsBySeller(sellerId);
    return {
      success: true,
      products,
    };
  }
}
