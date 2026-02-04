import { IsString, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ApplyDiscountDto {
  @ApiProperty({
    description: 'Discount code to apply',
    example: 'SAVE10-1234567890',
  })
  @IsString()
  code: string;

  @ApiProperty({
    description: 'Order subtotal before discount',
    example: 100.0,
  })
  @IsNumber()
  subtotal: number;
}
