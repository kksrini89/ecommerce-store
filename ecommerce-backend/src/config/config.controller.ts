import { Controller, Get, Put, Body, UseGuards } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { ConfigService } from './config.service';
import { UpdateConfigDto } from './dto/update-config.dto';
import { JwtAuthGuard, RolesGuard } from '../auth/guards';
import { IsAdmin } from '../common';

@ApiTags('Config')
@Controller('config')
export class ConfigController {
  constructor(private readonly configService: ConfigService) {}

  @Get()
  @ApiOperation({ summary: 'Get store configuration' })
  @ApiResponse({
    status: 200,
    description: 'Store configuration retrieved successfully',
  })
  getConfig() {
    const config = this.configService.getConfig();
    return {
      success: true,
      config,
    };
  }

  @Put('admin/config')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @IsAdmin()
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Update store configuration (Admin)' })
  @ApiResponse({
    status: 200,
    description: 'Store configuration updated successfully',
  })
  updateConfig(@Body() updateDto: UpdateConfigDto) {
    const config = this.configService.updateConfig(updateDto);
    return {
      success: true,
      message: 'Store configuration updated successfully',
      config,
    };
  }
}
