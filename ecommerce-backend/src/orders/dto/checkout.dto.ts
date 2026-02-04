import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

export class CheckoutDto {
  @ApiPropertyOptional({
    description: 'Discount code to apply',
    example: 'SAVE10-ABC123',
  })
  @IsString()
  @IsOptional()
  discountCode?: string;
}
