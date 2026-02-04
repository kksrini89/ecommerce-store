import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsIn } from 'class-validator';
import type { OrderStatus } from '../../store/interfaces';

export class UpdateOrderStatusDto {
  @ApiProperty({
    description: 'New order status',
    enum: ['pending', 'confirmed', 'shipped', 'delivered', 'completed', 'cancelled'],
    example: 'completed',
  })
  @IsString()
  @IsNotEmpty()
  @IsIn(['pending', 'confirmed', 'shipped', 'delivered', 'completed', 'cancelled'])
  status: OrderStatus;
}
