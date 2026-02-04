import { IsNumber, IsString, IsOptional, Min, Max } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class GenerateDiscountDto {
  @ApiProperty({
    description: 'Discount percentage (1-100)',
    example: 10,
    minimum: 1,
    maximum: 100,
  })
  @IsNumber()
  @Min(1)
  @Max(100)
  discountPercentage: number;

  @ApiPropertyOptional({
    description: 'Target customer ID (if not provided, can be used by any customer)',
    example: 'user-001',
  })
  @IsString()
  @IsOptional()
  customerId?: string;

  @ApiPropertyOptional({
    description: 'Expiry date (if not provided, defaults to 30 days)',
    example: '2026-03-04T12:00:00.000Z',
  })
  @IsOptional()
  expiresAt?: Date;
}
