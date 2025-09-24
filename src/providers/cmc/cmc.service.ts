// src/providers/cmc/cmc.service.ts
import {
  Injectable,
  Inject,
  OnModuleInit,
  SerializeOptions,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AllConfigType } from 'src/config/config.type';
import { ApiGatewayService } from 'src/common/api-gateway/api-gateway.service';
import { ApiFunction } from 'src/common/api-gateway/types/api-gateway.type';
import { ConfigurableService } from 'src/config/config.service';
import { CmcEnvironmenType } from './types/cmc-enum.type';
import { getCmcBaseUrl } from './cmc.helper';
import { CMC_DEFAULT_FIAT_CURRENCY, CMC_ENABLE } from './types/cmc-const.type';
import { ConfigGet, ConfigGetOrThrow } from '../../config/config.decorator';

@SerializeOptions({ groups: ['admin'] })
@Injectable()
export class CmcService
  extends ConfigurableService<AllConfigType>
  implements OnModuleInit
{
  private readonly logger = new Logger(CmcService.name);
  private apiClient: Record<string, ApiFunction> = {};
  private baseUrl: string;

  @ConfigGet('cmc.enable', { inferEnvVar: true, defaultValue: CMC_ENABLE })
  private readonly enabled!: boolean;

  @ConfigGet('cmc.envType', {
    inferEnvVar: true,
    defaultValue: CmcEnvironmenType.PRODUCTION,
  })
  private readonly envType!: CmcEnvironmenType;

  @ConfigGetOrThrow('cmc.apiKey', { inferEnvVar: true })
  private readonly apiKey!: string;

  @ConfigGet('cmc.defaultFiatCurrency', {
    inferEnvVar: true,
    defaultValue: CMC_DEFAULT_FIAT_CURRENCY,
  })
  private readonly defaultFiat!: string;

  constructor(
    private readonly apiSdkService: ApiGatewayService,
    configService: ConfigService<AllConfigType>,
    @Inject('API_GATEWAY_CMC') apiClient?: Record<string, ApiFunction>,
  ) {
    super(configService);
    this.baseUrl = getCmcBaseUrl(this.envType);

    if (apiClient) this.apiClient = apiClient;
  }

  private checkEnabled() {
    if (!this.enabled) {
      throw new Error('CMC service is disabled');
    }
  }

  async onModuleInit() {
    if (!this.enabled) {
      this.logger.warn('CMC service is DISABLED. Skipping initialization.');
      return;
    }

    this.logger.log('CMC service is ENABLED. Initializing…');

    // Prefer injected client; otherwise pull from ApiGatewayService
    if (!this.apiClient || Object.keys(this.apiClient).length === 0) {
      this.logger.warn(
        'No injected CMC client. Getting from ApiGatewayService…',
      );
      this.apiClient = this.apiSdkService.getClient('CMC');
    }

    if (!this.apiClient) {
      this.logger.error('CMC API client is not available.');
      return;
    }

    // Ensure gateway base URL is correct
    if (this.baseUrl) {
      this.logger.log(`Setting CMC base URL to: ${this.baseUrl}`);
      this.apiSdkService.updateBaseUrl('CMC', this.baseUrl);
      this.apiClient = this.apiSdkService.getClient('CMC');
    }

    this.apiSdkService.updateHeaders('CMC', {
      'X-CMC_PRO_API_KEY': this.apiKey,
    });
    this.logger.log(
      'CMC API key header set via ApiGatewayService.updateHeaders',
    );

    // Connectivity probe using /v1/key/info endpoint
    try {
      await this.getKeyInfo();
      this.logger.log('CMC key info connectivity OK.');
    } catch (e) {
      this.logger.warn(
        `CMC key info connectivity check failed: ${(e as Error)?.message}`,
      );
    }
  }

  /** Wrap `global-metrics/quotes/latest` */
  async getGlobalMetrics(params: { convert?: string }) {
    this.checkEnabled();
    return this.apiClient.getGlobalMetrics({ params });
  }

  /** Wrap `cryptocurrency/quotes/latest` */
  async getQuotesLatest(params: {
    symbol?: string;
    id?: string;
    slug?: string;
    convert?: string;
  }) {
    this.checkEnabled();
    return this.apiClient.getQuotesLatest({ params });
  }

  /** Wrap `cryptocurrency/ohlcv/historical` */
  async getOhlcvHistorical(params: {
    symbol?: string;
    id?: string;
    time_start?: string;
    time_end?: string;
    count?: number;
    interval?: string;
    convert?: string;
  }) {
    this.checkEnabled();
    return this.apiClient.getOhlcvHistorical({ params });
  }

  /** Wrap `cryptocurrency/info` */
  async getMetadata(params: { symbol?: string; id?: string; slug?: string }) {
    this.checkEnabled();
    return this.apiClient.getMetadata({ params });
  }
  /** Wrap `/v1/key/info` */
  async getKeyInfo() {
    this.checkEnabled();
    return this.apiClient.getKeyInfo();
  }
}
