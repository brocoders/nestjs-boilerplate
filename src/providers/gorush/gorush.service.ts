import {
  Injectable,
  Inject,
  Logger,
  HttpStatus,
  SerializeOptions,
} from '@nestjs/common';
import {
  GoRushCoreStatusResponseDto,
  GoRushVersionResponseDto,
} from './dto/gorush-info.dto';
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
import { ConfigService } from '@nestjs/config';
import { AllConfigType } from '../../config/config.type';
import { ApiFunction } from 'src/api-gateway/types/api-gateway.type';
import { ApiGatewayService } from '../../api-gateway/api-gateway.service';
import { GORUSH_DEFAULT_ENABLE } from './types/gorush-const.type';
import { parseMetrics } from './gorush.helper';
import { stringifyJson } from '../../logger/logger.helper';
import {
  mapPushNotificationRequest,
  mapPushNotificationResponse,
} from './infrastructure/persistence/relational/mappers/gorush.mapper';

@SerializeOptions({
  groups: ['admin'],
})
@Injectable()
export class GorushService {
  private readonly logger = new Logger(GorushService.name);
  private apiClient: Record<string, ApiFunction> = {};
  private isEnabled: boolean = false; // Flag to enable/disable service

  constructor(
    private readonly apiSdkService: ApiGatewayService,
    private readonly configService: ConfigService<AllConfigType>,
    @Inject('API_GATEWAY_GORUSH') apiClient?: Record<string, ApiFunction>,
  ) {
    if (apiClient) {
      this.apiClient = apiClient;
    }
  }

  async onModuleInit() {
    this.isEnabled =
      this.configService.get<boolean>('gorush.enabled', { infer: true }) ??
      GORUSH_DEFAULT_ENABLE;

    if (!this.isEnabled) {
      this.logger.warn('Gorush is disabled. Skipping initialization.');
      return;
    }

    this.logger.log('Gorush service is enabled.');

    if (this.apiClient) {
      this.logger.log('Using injected API client for Gorush.');
    } else {
      this.logger.warn(
        'Injected API client is missing, retrieving from ApiSdkService.',
      );
      this.apiClient = this.apiSdkService.getClient('GORUSH');

      if (!this.apiClient) {
        this.logger.error('Failed to initialize API client for Gorush.');
        return;
      }
    }

    const baseUrl = this.configService.get<string>('gorush.baseUrl', {
      infer: true,
    });
    if (baseUrl) {
      this.updateGorushBaseUrl(baseUrl);
    }
    await this.checkConnection();
  }

  /**
   * Check if Gorush server is available
   */
  async checkConnection(): Promise<boolean> {
    try {
      const healthCheck = await this.checkHealth();
      this.logger.log(`Checking connection... ${healthCheck.status}`);
      if (healthCheck.status === HttpStatus.OK) {
        this.logger.debug('Gorush server is reachable.');
        return true;
      } else {
        this.logger.warn(
          `Gorush server is not available: ${JSON.stringify(healthCheck)}`,
        );
        return false;
      }
    } catch (error) {
      this.logger.error(`Failed to connect to Gorush server: ${error.message}`);
      return false;
    }
  }

  /**
   * Update Gorush base URL dynamically
   */
  updateGorushBaseUrl(newBaseUrl: string) {
    this.logger.log(`Updating Gorush base URL to: ${newBaseUrl}`);
    this.apiSdkService.updateBaseUrl('GORUSH', newBaseUrl);
    this.apiClient = this.apiSdkService.getClient('GORUSH');
    if (!this.apiClient) {
      this.logger.error(`API client is still undefined after base URL update.`);
    } else {
      this.logger.log(`API client updated successfully with new base URL.`);
    }
  }

  /**
   * Get Gorush global statistics
   */
  async globalStats(): Promise<GoRushCoreStatusResponseDto> {
    return this.apiClient.getGoStats();
  }

  /**
   * Get Gorush app statistics
   */
  async appStats(): Promise<GoRushAppStatusResponseDto> {
    return this.apiClient.getAppStats();
  }

  /**
   * Get system statistics
   */
  async systemStats(): Promise<GoRushSystemStatsResponseDto> {
    return this.apiClient.getSysStats();
  }

  /**
   * Send a push notification
   */
  /**
   * Send a push notification
   */
  async sendPushNotification(
    payload: PushNotificationRequestDto,
  ): Promise<PushNotificationResponseDto> {
    this.logger.verbose(
      `Sending push notification: ${JSON.stringify(payload)}`,
    );

    try {
      const mappedPayload = mapPushNotificationRequest(payload);
      const response = await this.apiClient.sendPushNotification(mappedPayload);
      const mappedResponse = mapPushNotificationResponse(response);

      this.logger.verbose(
        `Push notification sent successfully. Count: ${mappedResponse.count}`,
      );

      return mappedResponse;
    } catch (error) {
      this.logger.error(
        `Push notification failed: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  /**
   * Get Gorush metrics
   */
  async metrics(
    asJson: boolean = false,
  ): Promise<GoRushMetricsResponseDto | GoRushMetricsJsonResponseDto> {
    try {
      const response = await this.apiClient.getMetrics();
      if (!response || !response.data) {
        throw new Error('Empty response from Gorush metrics endpoint.');
      }

      if (asJson) {
        const parsedMetrics = parseMetrics(response.data);
        return { metrics: parsedMetrics };
      }

      return { metrics: response.data };
    } catch (error) {
      this.logger.error('Failed to fetch Gorush metrics', error.message);
      throw error;
    }
  }

  /**
   * Check health status
   */
  async checkHealth(): Promise<{ status: number; message: string }> {
    try {
      const response: any = await this.apiClient.checkHealth();
      this.logger.verbose(`Checking ${stringifyJson(response)}`);
      if (response.statusCode === HttpStatus.OK) {
        return { status: HttpStatus.OK, message: 'Gorush server is healthy' };
      }
      return {
        status: HttpStatus.SERVICE_UNAVAILABLE,
        message: 'Gorush health check failed',
      };
    } catch (error) {
      return {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        message: `Gorush Server not Available: ${error.message}`,
      };
    }
  }

  /**
   * Get Gorush version
   */
  async version(): Promise<GoRushVersionResponseDto> {
    if (!this.apiClient || !this.apiClient.getVersion) {
      this.logger.error('getVersion function is missing in API client.');
      throw new Error('Gorush API client is not initialized properly.');
    }
    return this.apiClient.getVersion();
  }
}
