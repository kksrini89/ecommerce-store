import { IsNumber, IsOptional, Min, Max } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateConfigDto {
  @ApiPropertyOptional({
    description: 'Nth order number that triggers discount generation',
    example: 3,
    minimum: 1,
  })
  @IsNumber()
  @Min(1)
  @IsOptional()
  discountNValue?: number;

  @ApiPropertyOptional({
    description: 'Discount percentage for generated codes',
    example: 10,
    minimum: 1,
    maximum: 100,
  })
  @IsNumber()
  @Min(1)
  @Max(100)
  @IsOptional()
  discountPercentage?: number;
}
