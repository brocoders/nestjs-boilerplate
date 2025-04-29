import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { GorushService } from './gorush.service';
import { RolesGuard } from 'src/roles/roles.guard';
import { RoleEnum } from 'src/roles/roles.enum';
import { AuthGuard } from '@nestjs/passport';
import { ServiceEnabledGuard } from 'src/common/guards/service-enabled.guard';
import { SetMetadata } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Roles } from '../../roles/roles.decorator';
import {
  GoRushAppStatusResponseDto,
  GoRushMetricsJsonResponseDto,
  GoRushMetricsResponseDto,
  GoRushSystemStatsResponseDto,
} from './dto/gorush-monitor.dto';
import {
  PushNotificationRequestDto,
  PushNotificationResponseDto,
} from './dto/gorush-notify.dto';

import {
  GoRushCoreStatusResponseDto,
  GoRushVersionResponseDto,
} from './dto/gorush-info.dto';
import { GORUSH_SDK_VERSION } from './types/gorush-const.type';

@ApiBearerAuth()
@Roles(RoleEnum.admin)
@UseGuards(AuthGuard('jwt'), RolesGuard, ServiceEnabledGuard)
@SetMetadata('configPath', 'gorush.enable')
@ApiTags('GoRush')
@Controller({
  path: 'gorush',
  version: GORUSH_SDK_VERSION,
})
export class GorushController {
  constructor(private readonly gorushService: GorushService) {}

  /**
   * Get global Gorush statistics
   */
  @ApiOperation({ summary: 'Get global Gorush statistics' })
  @ApiOkResponse({
    description: 'Returns Gorush global statistics',
    type: GoRushCoreStatusResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error',
  })
  @ApiResponse({
    status: HttpStatus.GATEWAY_TIMEOUT,
    description: 'Gorush service is unreachable',
  })
  @ApiResponse({
    status: HttpStatus.SERVICE_UNAVAILABLE,
    description: 'Gorush service is unavailable',
  })
  @HttpCode(HttpStatus.OK)
  @Get('/stats/core')
  async getGlobalStats(): Promise<GoRushCoreStatusResponseDto> {
    return this.gorushService.globalStats();
  }

  /**
   * Get Gorush service statistics
   */
  @ApiOperation({ summary: 'Get Gorush service statistics' })
  @ApiOkResponse({
    description: 'Returns Gorush service statistics',
    type: GoRushAppStatusResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error',
  })
  @ApiResponse({
    status: HttpStatus.GATEWAY_TIMEOUT,
    description: 'Gorush service is unreachable',
  })
  @ApiResponse({
    status: HttpStatus.SERVICE_UNAVAILABLE,
    description: 'Gorush service is unavailable',
  })
  @HttpCode(HttpStatus.OK)
  @Get('/stats/service')
  async getAppStats(): Promise<GoRushAppStatusResponseDto> {
    return this.gorushService.appStats();
  }

  /**
   * Get Gorush system statistics
   */
  @ApiOperation({ summary: 'Get system statistics from Gorush' })
  @ApiOkResponse({
    description: 'Returns Gorush system statistics',
    type: GoRushSystemStatsResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error',
  })
  @ApiResponse({
    status: HttpStatus.GATEWAY_TIMEOUT,
    description: 'Gorush service is unreachable',
  })
  @ApiResponse({
    status: HttpStatus.SERVICE_UNAVAILABLE,
    description: 'Gorush service is unavailable',
  })
  @HttpCode(HttpStatus.OK)
  @Get('/stats/system')
  async getSystemStats(): Promise<GoRushSystemStatsResponseDto> {
    return this.gorushService.systemStats();
  }

  /**
   * Send a push notification
   */
  @ApiOperation({ summary: 'Send push notifications' })
  @ApiBody({
    description: 'Notification payload',
    type: PushNotificationRequestDto,
  })
  @ApiCreatedResponse({
    description: 'Push notification request accepted',
    type: PushNotificationResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid request payload',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error',
  })
  @ApiResponse({
    status: HttpStatus.GATEWAY_TIMEOUT,
    description: 'Gorush service is unreachable',
  })
  @ApiResponse({
    status: HttpStatus.SERVICE_UNAVAILABLE,
    description: 'Gorush service is unavailable',
  })
  @HttpCode(HttpStatus.CREATED)
  @Post('/push')
  async sendPushNotification(
    @Body() payload: PushNotificationRequestDto,
  ): Promise<PushNotificationResponseDto> {
    return this.gorushService.sendPushNotification(payload);
  }

  /**
   * Get Gorush metrics
   */
  @ApiOperation({ summary: 'Get Gorush performance metrics' })
  @ApiOkResponse({
    description: 'Returns Gorush metrics',
    type: GoRushMetricsResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error',
  })
  @ApiResponse({
    status: HttpStatus.GATEWAY_TIMEOUT,
    description: 'Gorush service is unreachable',
  })
  @ApiResponse({
    status: HttpStatus.SERVICE_UNAVAILABLE,
    description: 'Gorush service is unavailable',
  })
  @ApiQuery({
    name: 'json',
    required: false,
    description: 'Return metrics in JSON format if set to true',
    schema: { type: 'boolean' },
  })
  @HttpCode(HttpStatus.OK)
  @Get('/monitor/metrics')
  async getMetrics(
    @Query('json') json?: string,
  ): Promise<GoRushMetricsResponseDto | GoRushMetricsJsonResponseDto> {
    return this.gorushService.metrics(json === 'true');
  }

  /**
   * Health check for Gorush service
   */
  @ApiOperation({ summary: 'Check Gorush service health' })
  @ApiOkResponse({ description: 'Gorush service health status' })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error',
  })
  @ApiResponse({
    status: HttpStatus.GATEWAY_TIMEOUT,
    description: 'Gorush service is unreachable',
  })
  @ApiResponse({
    status: HttpStatus.SERVICE_UNAVAILABLE,
    description: 'Gorush service is unavailable',
  })
  @HttpCode(HttpStatus.OK)
  @Get('healthz')
  async checkHealth(): Promise<any> {
    return this.gorushService.checkHealth();
  }

  /**
   * Get Gorush version
   */
  @ApiOperation({ summary: 'Get Gorush version information' })
  @ApiOkResponse({
    description: 'Returns Gorush version details',
    type: GoRushVersionResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error',
  })
  @ApiResponse({
    status: HttpStatus.GATEWAY_TIMEOUT,
    description: 'Gorush service is unreachable',
  })
  @ApiResponse({
    status: HttpStatus.SERVICE_UNAVAILABLE,
    description: 'Gorush service is unavailable',
  })
  @HttpCode(HttpStatus.OK)
  @Get('version')
  async getVersion(): Promise<GoRushVersionResponseDto> {
    return this.gorushService.version();
  }
}
