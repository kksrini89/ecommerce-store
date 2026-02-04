import {
  Controller,
  Get,
  Post,
  Put,
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
import { OrdersService } from './orders.service';
import { CheckoutDto } from './dto/checkout.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { JwtAuthGuard, RolesGuard } from '../auth/guards';
import { CurrentUser, IsSeller, IsAdmin } from '../common';

@ApiTags('Orders')
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get my orders' })
  @ApiResponse({
    status: 200,
    description: 'Orders retrieved successfully',
  })
  getMyOrders(@CurrentUser('userId') userId: string) {
    const orders = this.ordersService.getOrdersByUser(userId);
    return {
      success: true,
      orders,
    };
  }

  @Post('checkout')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Checkout cart and create order' })
  @ApiResponse({
    status: 201,
    description: 'Order created successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Cart is empty or insufficient stock',
  })
  @ApiResponse({ status: 400, description: 'Invalid discount code' })
  checkout(
    @CurrentUser('userId') userId: string,
    @Body() checkoutDto: CheckoutDto,
  ) {
    const result = this.ordersService.checkout(userId, checkoutDto);
    return {
      success: true,
      message: 'Order created successfully',
      order: result.order,
      items: result.items,
      appliedDiscount: result.appliedDiscount,
    };
  }

  @Get('seller/orders')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @IsSeller()
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get orders containing seller products' })
  @ApiResponse({
    status: 200,
    description: 'Orders retrieved successfully',
  })
  getSellerOrders(@CurrentUser('userId') sellerId: string) {
    const orders = this.ordersService.getOrdersForSeller(sellerId);
    return {
      success: true,
      orders,
    };
  }

  @Put('seller/orders/:id/status')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @IsSeller()
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Update order status' })
  @ApiResponse({
    status: 200,
    description: 'Order status updated',
  })
  @ApiResponse({ status: 403, description: 'Not authorized' })
  updateOrderStatus(
    @CurrentUser('userId') sellerId: string,
    @Param('id') orderId: string,
    @Body() updateDto: UpdateOrderStatusDto,
  ) {
    const result = this.ordersService.updateOrderStatus(
      orderId,
      sellerId,
      updateDto.status,
    );
    return {
      success: true,
      message: 'Order status updated',
      order: result.order,
      discountGenerated: result.discountGenerated,
    };
  }

  @Get('admin/orders')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @IsAdmin()
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get all orders (Admin)' })
  @ApiResponse({
    status: 200,
    description: 'All orders retrieved successfully',
  })
  getAllOrders() {
    const orders = this.ordersService.getAllOrders();
    return {
      success: true,
      orders,
    };
  }
}
