import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { AnalyticsService, DateRange } from './analytics.service';
import { JwtAuthGuard, RolesGuard } from '../auth/guards';
import { CurrentUser, IsSeller, IsAdmin } from '../common';

@ApiTags('Analytics')
@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  private parseDateRange(startDate?: string, endDate?: string): DateRange | undefined {
    if (!startDate && !endDate) return undefined;
    return {
      startDate: startDate ? new Date(startDate) : undefined,
      endDate: endDate ? new Date(endDate) : undefined,
    };
  }

  @Get('seller/analytics')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @IsSeller()
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'View seller analytics metrics' })
  @ApiQuery({ name: 'startDate', required: false, type: String })
  @ApiQuery({ name: 'endDate', required: false, type: String })
  @ApiResponse({
    status: 200,
    description: 'Seller analytics retrieved successfully',
  })
  getSellerAnalytics(
    @CurrentUser('userId') sellerId: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    const dateRange = this.parseDateRange(startDate, endDate);
    const analytics = this.analyticsService.getSellerAnalytics(sellerId, dateRange);
    return {
      success: true,
      analytics,
    };
  }

  @Get('admin/analytics')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @IsAdmin()
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'View store-wide analytics metrics' })
  @ApiQuery({ name: 'startDate', required: false, type: String })
  @ApiQuery({ name: 'endDate', required: false, type: String })
  @ApiResponse({
    status: 200,
    description: 'Store analytics retrieved successfully',
  })
  getAdminAnalytics(
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    const dateRange = this.parseDateRange(startDate, endDate);
    const analytics = this.analyticsService.getStoreAnalytics(dateRange);
    const sellersAnalytics = this.analyticsService.getAllSellersAnalytics(dateRange);
    return {
      success: true,
      analytics,
      sellersBreakdown: sellersAnalytics,
    };
  }
}
