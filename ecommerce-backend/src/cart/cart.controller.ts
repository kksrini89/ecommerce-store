import {
  Controller,
  Get,
  Post,
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
import { CartService } from './cart.service';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { JwtAuthGuard } from '../auth/guards';
import { CurrentUser } from '../common';

@ApiTags('Cart')
@ApiBearerAuth('JWT-auth')
@Controller('cart')
@UseGuards(JwtAuthGuard)
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  @ApiOperation({ summary: 'Get current user cart' })
  @ApiResponse({
    status: 200,
    description: 'Cart retrieved successfully',
  })
  getCart(@CurrentUser('userId') userId: string) {
    return {
      success: true,
      cart: this.cartService.getCart(userId),
    };
  }

  @Post('add')
  @ApiOperation({ summary: 'Add item to cart' })
  @ApiResponse({
    status: 200,
    description: 'Item added to cart',
  })
  @ApiResponse({ status: 404, description: 'Product not found' })
  @ApiResponse({ status: 400, description: 'Insufficient stock' })
  addToCart(
    @CurrentUser('userId') userId: string,
    @Body() addToCartDto: AddToCartDto,
  ) {
    const cart = this.cartService.addToCart(userId, addToCartDto);
    return {
      success: true,
      message: 'Item added to cart',
      cart,
    };
  }

  @Delete(':productId')
  @ApiOperation({ summary: 'Remove item from cart' })
  @ApiResponse({
    status: 200,
    description: 'Item removed from cart',
  })
  @ApiResponse({ status: 404, description: 'Product not found in cart' })
  removeFromCart(
    @CurrentUser('userId') userId: string,
    @Param('productId') productId: string,
  ) {
    const cart = this.cartService.removeFromCart(userId, productId);
    return {
      success: true,
      message: 'Item removed from cart',
      cart,
    };
  }
}
