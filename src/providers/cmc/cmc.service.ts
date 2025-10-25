import { Injectable, Inject, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AllConfigType } from 'src/config/config.type';
import { ApiGatewayService } from 'src/common/api-gateway/api-gateway.service';
import { ApiFunction } from 'src/common/api-gateway/types/api-gateway.type';
import { BaseToggleableService } from 'src/common/base/base-toggleable.service';
import { getCmcBaseUrl } from './cmc.helper';
import { CmcEnvironmenType } from './types/cmc-enum.type';
import { CMC_DEFAULT_FIAT_CURRENCY, CMC_ENABLE } from './types/cmc-const.type';
import { ConfigGet, ConfigGetOrThrow } from '../../config/config.decorator';
import { RoleEnum } from 'src/roles/roles.enum';
import { GroupPlainToInstance } from 'src/utils/transformers/class.transformer';

// DTOs
import { CmcKeyInfoDto } from './dto/cmc-info.dto';
import {
  CmcGlobalMetricsQueryDto,
  CmcGlobalMetricsHistoricalQueryDto,
} from './dto/cmc-base.query.dto';
import {
  CmcGlobalMetricsQuotesLatestDto,
  CmcGlobalMetricsQuotesHistoricalDto,
} from './dto/cmc-global-metrics.dto';
// import {
//   CmcGlobalMetricsQuotesHistoricalDto,
//   CmcGlobalMetricsQuotesLatestDto,
// } from './dto/cmc-global-metrics.dto';
// import {
//   CmcToolsPriceConversionV1Dto,
//   CmcToolsPriceConversionV2Dto,
//   CmcToolsPostmanDto,
// } from './dto/cmc-tools.dto';
// import { CmcFiatMapDto } from './dto/cmc-fiat.dto';
// import { CmcBlockchainStatisticsLatestDto } from './dto/cmc-blockchain.dto';
// import {
//   CmcFearAndGreedHistoricalDto,
//   CmcFearAndGreedLatestDto,
// } from './dto/cmc-fear-and-greed.dto';
// import { CmcIndexHistoricalDto, CmcIndexLatestDto } from './dto/cmc-index.dto';
// import {
//   CmcCryptoQuotesLatestV2Dto,
//   CmcCryptoQuotesHistoricalV2Dto,
//   CmcCryptoQuotesHistoricalV3Dto,
//   CmcCryptoOhlcvLatestV2Dto,
//   CmcCryptoOhlcvHistoricalV2Dto,
//   CmcCryptoMarketPairsLatestV2Dto,
//   CmcCryptoPpsLatestV2Dto,
//   CmcTrendingLatestV1Dto,
//   CmcTrendingMostVisitedV1Dto,
//   CmcTrendingGainersLosersV1Dto,
//   CmcCryptoCategoryV1Dto,
//   CmcCryptoAirdropV1Dto,
//   CmcCryptoAirdropsV1Dto,
//   CmcCryptoCategoriesV1Dto,
//   CmcCryptoPpsLatestV1Dto,
//   CmcCryptoOhlcvHistoricalV1Dto,
//   CmcCryptoOhlcvLatestV1Dto,
//   CmcCryptoMarketPairsLatestV1Dto,
//   CmcCryptoQuotesHistoricalV1Dto,
//   CmcCryptoQuotesLatestV1Dto,
//   CmcCryptoListingsLatestV1Dto,
//   CmcCryptoInfoV1Dto,
//   CmcCryptoMapV1Dto,
//   CmcCryptoListingsHistoricalV1Dto,
// } from './dto/cmc-cryptocurrency.dto';
// import {
//   CmcExchangeMapDto,
//   CmcExchangeInfoDto,
//   CmcExchangeListingsLatestDto,
//   CmcExchangeQuotesLatestDto,
//   CmcExchangeQuotesHistoricalDto,
//   CmcExchangeMarketPairsLatestDto,
//   CmcExchangeAssetsDto,
// } from './dto/cmc-exchange.dto';
//
// // Query DTOs
// import {
//   CmcBlockchainStatisticsLatestQueryDto,
//   CmcCryptoAirdropQueryDto,
//   CmcCryptoAirdropsQueryDto,
//   CmcCryptoCategoriesQueryDto,
//   CmcCryptoCategoryQueryDto,
//   CmcCryptoInfoQueryDto,
//   CmcCryptoListingsHistoricalQueryDto,
//   CmcCryptoListingsLatestQueryDto,
//   CmcCryptoMapQueryDto,
//   CmcCryptoMarketPairsLatestV1QueryDto,
//   CmcCryptoOhlcvHistoricalV1QueryDto,
//   CmcCryptoOhlcvLatestV1QueryDto,
//   CmcCryptoPpsLatestV1QueryDto,
//   CmcCryptoQuotesHistoricalV1QueryDto,
//   CmcCryptoQuotesLatestV1QueryDto,
//   CmcExchangeAssetsQueryDto,
//   CmcExchangeInfoQueryDto,
//   CmcExchangeListingsLatestQueryDto,
//   CmcExchangeMapQueryDto,
//   CmcExchangeMarketPairsLatestQueryDto,
//   CmcExchangeQuotesHistoricalQueryDto,
//   CmcExchangeQuotesLatestQueryDto,
//   CmcFearAndGreedHistoricalQueryDto,
//   CmcFiatMapQueryDto,
//   CmcGlobalMetricsHistoricalQueryDto,
//   CmcGlobalMetricsQueryDto,
//   CmcIndexHistoricalQueryDto,
//   CmcMarketPairsLatestV2QueryDto,
//   CmcOhlcvHistoricalV2QueryDto,
//   CmcOhlcvLatestV2QueryDto,
//   CmcPpsLatestV2QueryDto,
//   CmcPriceConversionV1QueryDto,
//   CmcPriceConversionV2QueryDto,
//   CmcQuotesHistoricalV2QueryDto,
//   CmcQuotesHistoricalV3QueryDto,
//   CmcQuotesLatestQueryDto,
//   CmcTrendingQueryDto,
// } from './dto/cmc-base.query.dto';
// import { CmcEnvelopeDto } from './dto/cmc-base.response.dto';

@Injectable()
export class CmcService extends BaseToggleableService implements OnModuleInit {
  private apiClient: Record<string, ApiFunction> = {};
  private baseUrl = '';

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
    private readonly configService: ConfigService<AllConfigType>,
    @Inject('API_GATEWAY_CMC') apiClient?: Record<string, ApiFunction>,
  ) {
    super(
      CmcService.name,
      configService.get('cmc.enable', { infer: true }) ?? CMC_ENABLE,
    );
    if (apiClient) this.apiClient = apiClient;
  }

  async onModuleInit(): Promise<void> {
    if (!this.isEnabled) {
      this.logger.warn('CMC service is DISABLED. Skipping initialization.');
      return;
    }

    if (!this.apiClient || Object.keys(this.apiClient).length === 0) {
      this.apiClient = this.apiSdkService.getClient('CMC');
    }
    if (!this.apiClient) {
      this.logger.error('CMC API client is not initialized.');
      return;
    }

    this.baseUrl = getCmcBaseUrl(this.envType);
    if (this.baseUrl) {
      this.apiSdkService.updateBaseUrl('CMC', this.baseUrl);
      this.apiClient = this.apiSdkService.getClient('CMC');
    }
    this.apiSdkService.updateHeaders('CMC', {
      Accept: 'application/json',
      'X-CMC_PRO_API_KEY': this.apiKey,
    });
    // Refresh client reference so we use the rebuilt instance that includes the API key header
    this.apiClient = this.apiSdkService.getClient('CMC');

    await this.checkConnection();
  }

  /** Returns true when the service is enabled and a client is available. */
  public isReady(): boolean {
    return this.isEnabled && !!this.apiClient;
  }

  private async checkConnection(): Promise<void> {
    try {
      await this.getKeyInfo();
      this.logger.log('CMC connection is OK.');
    } catch (e: any) {
      this.logger.warn(`CMC connectivity check failed: ${e?.message || e}`);
    }
  }

  // ---------------------------------------------------------------------------
  // Key / Plan usage
  // ---------------------------------------------------------------------------
  async getKeyInfo(): Promise<CmcKeyInfoDto> {
    const payload = await this.apiClient.getKeyInfo();
    return GroupPlainToInstance(CmcKeyInfoDto, payload, [RoleEnum.admin]);
  }
  //
  // ---------------------------------------------------------------------------
  // Global Metrics
  // ---------------------------------------------------------------------------
  async getGlobalMetricsLatest(
    q: CmcGlobalMetricsQueryDto,
  ): Promise<CmcGlobalMetricsQuotesLatestDto> {
    const dto: any = { ...(q ?? {}) };

    // CMC API rule: you cannot send both 'convert' and 'convert_id' at the same time.
    // If 'convert_id' is provided, we remove 'convert' to avoid a 400 Bad Request.
    if (dto.convert_id) {
      delete dto.convert;
    } else if (!dto.convert) {
      dto.convert = this.defaultFiat; // Apply default fiat when neither is provided
    }

    const payload = await this.apiClient.getGlobalMetrics({ query: dto });
    return GroupPlainToInstance(CmcGlobalMetricsQuotesLatestDto, payload, [
      RoleEnum.admin,
    ]);
  }

  async getGlobalMetricsHistorical(
    q: CmcGlobalMetricsHistoricalQueryDto,
  ): Promise<CmcGlobalMetricsQuotesHistoricalDto> {
    const dto: any = { ...(q ?? {}) };

    // CMC API rule: you cannot send both 'convert' and 'convert_id' at the same time.
    // If 'convert_id' is provided, we remove 'convert' to avoid a 400 Bad Request.
    if (dto.convert_id) {
      delete dto.convert;
    } else if (!dto.convert) {
      dto.convert = this.defaultFiat; // Apply default fiat when neither is provided
    }

    const payload = await this.apiClient.getGlobalMetricsHistorical({
      query: dto,
    });
    return GroupPlainToInstance(CmcGlobalMetricsQuotesHistoricalDto, payload, [
      RoleEnum.admin,
    ]);
  }

  //   // ---------------------------------------------------------------------------
  //   // Tools
  //   // ---------------------------------------------------------------------------
  //   async priceConversionV1(
  //     q: CmcPriceConversionV1QueryDto,
  //   ): Promise<CmcToolsPriceConversionV1Dto> {
  //     this.guard();
  //     const fn = this.apiClient.priceConversionV1;
  //     if (!fn) {
  //       throw new UnprocessableEntityException({
  //         status: HttpStatus.UNPROCESSABLE_ENTITY,
  //         message: 'CMC endpoint "tools/price-conversion(v1)" is not registered',
  //         errors: { endpoint: 'NotRegistered' },
  //       });
  //     }
  //     const params = { ...(q ?? {}) };
  //     if (!params.convert) params.convert = this.defaultFiat;
  //     const raw = await fn({ params });
  //     return GroupPlainToInstance(CmcToolsPriceConversionV1Dto, raw, [
  //       RoleEnum.admin,
  //     ]);
  //   }
  //
  //   async priceConversionV2(
  //     q: CmcPriceConversionV2QueryDto,
  //   ): Promise<CmcToolsPriceConversionV2Dto> {
  //     this.guard();
  //     const fn = this.apiClient.priceConversionV2;
  //     if (!fn) {
  //       throw new UnprocessableEntityException({
  //         status: HttpStatus.UNPROCESSABLE_ENTITY,
  //         message: 'CMC endpoint "tools/price-conversion(v2)" is not registered',
  //         errors: { endpoint: 'NotRegistered' },
  //       });
  //     }
  //     const params = { ...(q ?? {}) };
  //     if (!params.convert) params.convert = this.defaultFiat;
  //     const raw = await fn({ params });
  //     return GroupPlainToInstance(CmcToolsPriceConversionV2Dto, raw, [
  //       RoleEnum.admin,
  //     ]);
  //   }
  //
  //   async postman(): Promise<CmcToolsPostmanDto> {
  //     this.guard();
  //     const fn = this.apiClient.postman;
  //     if (!fn) {
  //       throw new UnprocessableEntityException({
  //         status: HttpStatus.UNPROCESSABLE_ENTITY,
  //         message: 'CMC endpoint "tools/postman" is not registered',
  //         errors: { endpoint: 'NotRegistered' },
  //       });
  //     }
  //     const raw = await fn({ params: {} });
  //     return GroupPlainToInstance(CmcToolsPostmanDto, raw, [RoleEnum.admin]);
  //   }
  //
  //   // ---------------------------------------------------------------------------
  //   // Fiat
  //   // ---------------------------------------------------------------------------
  //   async getFiatMap(q: CmcFiatMapQueryDto): Promise<CmcFiatMapDto> {
  //     this.guard();
  //     const fn = this.apiClient.getFiatMap;
  //     if (!fn) {
  //       throw new UnprocessableEntityException({
  //         status: HttpStatus.UNPROCESSABLE_ENTITY,
  //         message: 'CMC endpoint "fiat/map" is not registered',
  //         errors: { endpoint: 'NotRegistered' },
  //       });
  //     }
  //     const raw = await fn({ params: q ?? {} });
  //     return GroupPlainToInstance(CmcFiatMapDto, raw, [RoleEnum.admin]);
  //   }
  //
  //   // ---------------------------------------------------------------------------
  //   // Blockchain
  //   // ---------------------------------------------------------------------------
  //   async getBlockchainStatisticsLatest(
  //     q: CmcBlockchainStatisticsLatestQueryDto,
  //   ): Promise<CmcBlockchainStatisticsLatestDto> {
  //     this.guard();
  //     const fn = this.apiClient.getBlockchainStatisticsLatest;
  //     if (!fn) {
  //       throw new UnprocessableEntityException({
  //         status: HttpStatus.UNPROCESSABLE_ENTITY,
  //         message:
  //           'CMC endpoint "blockchain/statistics/latest" is not registered',
  //         errors: { endpoint: 'NotRegistered' },
  //       });
  //     }
  //     const raw = await fn({ params: q ?? {} });
  //     return GroupPlainToInstance(CmcBlockchainStatisticsLatestDto, raw, [
  //       RoleEnum.admin,
  //     ]);
  //   }
  //
  //   // ---------------------------------------------------------------------------
  //   // Fear & Greed
  //   // ---------------------------------------------------------------------------
  //   async getFearAndGreedLatest(): Promise<CmcFearAndGreedLatestDto> {
  //     this.guard();
  //     const fn = this.apiClient.getFearAndGreedLatest;
  //     if (!fn) {
  //       throw new UnprocessableEntityException({
  //         status: HttpStatus.UNPROCESSABLE_ENTITY,
  //         message: 'CMC endpoint "fear-and-greed/latest" is not registered',
  //         errors: { endpoint: 'NotRegistered' },
  //       });
  //     }
  //     const raw = await fn({ params: {} });
  //     return GroupPlainToInstance(CmcFearAndGreedLatestDto, raw, [
  //       RoleEnum.admin,
  //     ]);
  //   }
  //
  //   async getFearAndGreedHistorical(
  //     q: CmcFearAndGreedHistoricalQueryDto,
  //   ): Promise<CmcFearAndGreedHistoricalDto> {
  //     this.guard();
  //     const fn = this.apiClient.getFearAndGreedHistorical;
  //     if (!fn) {
  //       throw new UnprocessableEntityException({
  //         status: HttpStatus.UNPROCESSABLE_ENTITY,
  //         message: 'CMC endpoint "fear-and-greed/historical" is not registered',
  //         errors: { endpoint: 'NotRegistered' },
  //       });
  //     }
  //     const raw = await fn({ params: q ?? {} });
  //     return GroupPlainToInstance(CmcFearAndGreedHistoricalDto, raw, [
  //       RoleEnum.admin,
  //     ]);
  //   }
  //
  //   // ---------------------------------------------------------------------------
  //   // Index (CMC20 / CMC100)
  //   // ---------------------------------------------------------------------------
  //   async getIndexCmc20Latest(): Promise<CmcIndexLatestDto> {
  //     this.guard();
  //     const fn = this.apiClient.getIndexCmc20Latest;
  //     if (!fn) {
  //       throw new UnprocessableEntityException({
  //         status: HttpStatus.UNPROCESSABLE_ENTITY,
  //         message: 'CMC endpoint "index/cmc20-latest" is not registered',
  //         errors: { endpoint: 'NotRegistered' },
  //       });
  //     }
  //     const raw = await fn({ params: {} });
  //     return GroupPlainToInstance(CmcIndexLatestDto, raw, [RoleEnum.admin]);
  //   }
  //
  //   async getIndexCmc20Historical(
  //     q: CmcIndexHistoricalQueryDto,
  //   ): Promise<CmcIndexHistoricalDto> {
  //     this.guard();
  //     const fn = this.apiClient.getIndexCmc20Historical;
  //     if (!fn) {
  //       throw new UnprocessableEntityException({
  //         status: HttpStatus.UNPROCESSABLE_ENTITY,
  //         message: 'CMC endpoint "index/cmc20-historical" is not registered',
  //         errors: { endpoint: 'NotRegistered' },
  //       });
  //     }
  //     const raw = await fn({ params: q ?? {} });
  //     return GroupPlainToInstance(CmcIndexHistoricalDto, raw, [RoleEnum.admin]);
  //   }
  //
  //   async getIndexCmc100Latest(): Promise<CmcIndexLatestDto> {
  //     this.guard();
  //     const fn = this.apiClient.getIndexCmc100Latest;
  //     if (!fn) {
  //       throw new UnprocessableEntityException({
  //         status: HttpStatus.UNPROCESSABLE_ENTITY,
  //         message: 'CMC endpoint "index/cmc100-latest" is not registered',
  //         errors: { endpoint: 'NotRegistered' },
  //       });
  //     }
  //     const raw = await fn({ params: {} });
  //     return GroupPlainToInstance(CmcIndexLatestDto, raw, [RoleEnum.admin]);
  //   }
  //
  //   async getIndexCmc100Historical(
  //     q: CmcIndexHistoricalQueryDto,
  //   ): Promise<CmcIndexHistoricalDto> {
  //     this.guard();
  //     const fn = this.apiClient.getIndexCmc100Historical;
  //     if (!fn) {
  //       throw new UnprocessableEntityException({
  //         status: HttpStatus.UNPROCESSABLE_ENTITY,
  //         message: 'CMC endpoint "index/cmc100-historical" is not registered',
  //         errors: { endpoint: 'NotRegistered' },
  //       });
  //     }
  //     const raw = await fn({ params: q ?? {} });
  //     return GroupPlainToInstance(CmcIndexHistoricalDto, raw, [RoleEnum.admin]);
  //   }
  //
  //   // ---------------------------------------------------------------------------
  //   // Cryptocurrency v2/v3
  //   // ---------------------------------------------------------------------------
  //   async getQuotesLatestV2(
  //     q: CmcQuotesLatestQueryDto,
  //   ): Promise<CmcCryptoQuotesLatestV2Dto> {
  //     this.guard();
  //     const fn = this.apiClient.getQuotesLatestV2;
  //     if (!fn) {
  //       throw new UnprocessableEntityException({
  //         status: HttpStatus.UNPROCESSABLE_ENTITY,
  //         message:
  //           'CMC endpoint "cryptocurrency/quotes/latest(v2)" is not registered',
  //         errors: { endpoint: 'NotRegistered' },
  //       });
  //     }
  //     const params = { ...(q ?? {}) };
  //     if (!params.convert) params.convert = this.defaultFiat;
  //     const raw = await fn({ params });
  //     return GroupPlainToInstance(CmcCryptoQuotesLatestV2Dto, raw, [
  //       RoleEnum.admin,
  //     ]);
  //   }
  //
  //   async getQuotesHistoricalV2(
  //     q: CmcQuotesHistoricalV2QueryDto,
  //   ): Promise<CmcCryptoQuotesHistoricalV2Dto> {
  //     this.guard();
  //     const fn = this.apiClient.getQuotesHistoricalV2;
  //     if (!fn) {
  //       throw new UnprocessableEntityException({
  //         status: HttpStatus.UNPROCESSABLE_ENTITY,
  //         message:
  //           'CMC endpoint "cryptocurrency/quotes/historical(v2)" is not registered',
  //         errors: { endpoint: 'NotRegistered' },
  //       });
  //     }
  //     const params = { ...(q ?? {}) };
  //     if (!params.convert) params.convert = this.defaultFiat;
  //     const raw = await fn({ params });
  //     return GroupPlainToInstance(CmcCryptoQuotesHistoricalV2Dto, raw, [
  //       RoleEnum.admin,
  //     ]);
  //   }
  //
  //   async getQuotesHistoricalV3(
  //     q: CmcQuotesHistoricalV3QueryDto,
  //   ): Promise<CmcCryptoQuotesHistoricalV3Dto> {
  //     this.guard();
  //     const fn = this.apiClient.getQuotesHistoricalV3;
  //     if (!fn) {
  //       throw new UnprocessableEntityException({
  //         status: HttpStatus.UNPROCESSABLE_ENTITY,
  //         message:
  //           'CMC endpoint "cryptocurrency/quotes/historical(v3)" is not registered',
  //         errors: { endpoint: 'NotRegistered' },
  //       });
  //     }
  //     const params = { ...(q ?? {}) };
  //     if (!params.convert) params.convert = this.defaultFiat;
  //     const raw = await fn({ params });
  //     return GroupPlainToInstance(CmcCryptoQuotesHistoricalV3Dto, raw, [
  //       RoleEnum.admin,
  //     ]);
  //   }
  //
  //   async getOhlcvLatestV2(
  //     q: CmcOhlcvLatestV2QueryDto,
  //   ): Promise<CmcCryptoOhlcvLatestV2Dto> {
  //     this.guard();
  //     const fn = this.apiClient.getOhlcvLatestV2;
  //     if (!fn) {
  //       throw new UnprocessableEntityException({
  //         status: HttpStatus.UNPROCESSABLE_ENTITY,
  //         message:
  //           'CMC endpoint "cryptocurrency/ohlcv/latest(v2)" is not registered',
  //         errors: { endpoint: 'NotRegistered' },
  //       });
  //     }
  //     const params = { ...(q ?? {}) };
  //     if (!params.convert) params.convert = this.defaultFiat;
  //     const raw = await fn({ params });
  //     return GroupPlainToInstance(CmcCryptoOhlcvLatestV2Dto, raw, [
  //       RoleEnum.admin,
  //     ]);
  //   }
  //
  //   async getOhlcvHistoricalV2(
  //     q: CmcOhlcvHistoricalV2QueryDto,
  //   ): Promise<CmcCryptoOhlcvHistoricalV2Dto> {
  //     this.guard();
  //     const fn = this.apiClient.getOhlcvHistoricalV2;
  //     if (!fn) {
  //       throw new UnprocessableEntityException({
  //         status: HttpStatus.UNPROCESSABLE_ENTITY,
  //         message:
  //           'CMC endpoint "cryptocurrency/ohlcv/historical(v2)" is not registered',
  //         errors: { endpoint: 'NotRegistered' },
  //       });
  //     }
  //     const params = { ...(q ?? {}) };
  //     if (!params.convert) params.convert = this.defaultFiat;
  //     const raw = await fn({ params });
  //     return GroupPlainToInstance(CmcCryptoOhlcvHistoricalV2Dto, raw, [
  //       RoleEnum.admin,
  //     ]);
  //   }
  //
  //   async getMarketPairsLatestV2(
  //     q: CmcMarketPairsLatestV2QueryDto,
  //   ): Promise<CmcCryptoMarketPairsLatestV2Dto> {
  //     this.guard();
  //     const fn = this.apiClient.getMarketPairsLatestV2;
  //     if (!fn) {
  //       throw new UnprocessableEntityException({
  //         status: HttpStatus.UNPROCESSABLE_ENTITY,
  //         message:
  //           'CMC endpoint "cryptocurrency/market-pairs/latest(v2)" is not registered',
  //         errors: { endpoint: 'NotRegistered' },
  //       });
  //     }
  //     const params = { ...(q ?? {}) };
  //     if (!params.convert) params.convert = this.defaultFiat;
  //     const raw = await fn({ params });
  //     return GroupPlainToInstance(CmcCryptoMarketPairsLatestV2Dto, raw, [
  //       RoleEnum.admin,
  //     ]);
  //   }
  //
  //   async getPricePerformanceStatsLatestV2(
  //     q: CmcPpsLatestV2QueryDto,
  //   ): Promise<CmcCryptoPpsLatestV2Dto> {
  //     this.guard();
  //     const fn = this.apiClient.getPricePerformanceStatsLatestV2;
  //     if (!fn) {
  //       throw new UnprocessableEntityException({
  //         status: HttpStatus.UNPROCESSABLE_ENTITY,
  //         message:
  //           'CMC endpoint "cryptocurrency/pps/latest(v2)" is not registered',
  //         errors: { endpoint: 'NotRegistered' },
  //       });
  //     }
  //     const params = { ...(q ?? {}) };
  //     if (!params.convert) params.convert = this.defaultFiat;
  //     const raw = await fn({ params });
  //     return GroupPlainToInstance(CmcCryptoPpsLatestV2Dto, raw, [RoleEnum.admin]);
  //   }
  //
  //   // ---------------------------------------------------------------------------
  //   // Cryptocurrency v1
  //   // ---------------------------------------------------------------------------
  //   async getCryptoMap(q: CmcCryptoMapQueryDto): Promise<CmcCryptoMapV1Dto> {
  //     this.guard();
  //     const fn = this.apiClient.getCryptoMap;
  //     if (!fn) {
  //       throw new UnprocessableEntityException({
  //         status: HttpStatus.UNPROCESSABLE_ENTITY,
  //         message: 'CMC endpoint "cryptocurrency/map" is not registered',
  //         errors: { endpoint: 'NotRegistered' },
  //       });
  //     }
  //     const raw = await fn({ params: q ?? {} });
  //     return GroupPlainToInstance(CmcCryptoMapV1Dto, raw, [RoleEnum.admin]);
  //   }
  //
  //   async getCryptoInfo(q: CmcCryptoInfoQueryDto): Promise<CmcCryptoInfoV1Dto> {
  //     this.guard();
  //     const fn = this.apiClient.getCryptoInfo;
  //     if (!fn) {
  //       throw new UnprocessableEntityException({
  //         status: HttpStatus.UNPROCESSABLE_ENTITY,
  //         message: 'CMC endpoint "cryptocurrency/info" is not registered',
  //         errors: { endpoint: 'NotRegistered' },
  //       });
  //     }
  //     const raw = await fn({ params: q ?? {} });
  //     return GroupPlainToInstance(CmcCryptoInfoV1Dto, raw, [RoleEnum.admin]);
  //   }
  //
  //   async getCryptoListingsLatest(
  //     q: CmcCryptoListingsLatestQueryDto,
  //   ): Promise<CmcCryptoListingsLatestV1Dto> {
  //     this.guard();
  //     const fn = this.apiClient.getCryptoListingsLatest;
  //     if (!fn) {
  //       throw new UnprocessableEntityException({
  //         status: HttpStatus.UNPROCESSABLE_ENTITY,
  //         message:
  //           'CMC endpoint "cryptocurrency/listings/latest" is not registered',
  //         errors: { endpoint: 'NotRegistered' },
  //       });
  //     }
  //     const params = { ...(q ?? {}) };
  //     if (!params.convert) params.convert = this.defaultFiat;
  //     const raw = await fn({ params });
  //     return GroupPlainToInstance(CmcCryptoListingsLatestV1Dto, raw, [
  //       RoleEnum.admin,
  //     ]);
  //   }
  //
  //   async getCryptoListingsHistorical(
  //     q: CmcCryptoListingsHistoricalQueryDto,
  //   ): Promise<CmcCryptoListingsHistoricalV1Dto> {
  //     this.guard();
  //     const fn = this.apiClient.getCryptoListingsHistorical;
  //     if (!fn) {
  //       throw new UnprocessableEntityException({
  //         status: HttpStatus.UNPROCESSABLE_ENTITY,
  //         message:
  //           'CMC endpoint "cryptocurrency/listings/historical" is not registered',
  //         errors: { endpoint: 'NotRegistered' },
  //       });
  //     }
  //     const params = { ...(q ?? {}) };
  //     if (!params.convert) params.convert = this.defaultFiat;
  //     const raw = await fn({ params });
  //     return GroupPlainToInstance(CmcCryptoListingsHistoricalV1Dto, raw, [
  //       RoleEnum.admin,
  //     ]);
  //   }
  //
  //   async getQuotesLatest(
  //     q: CmcCryptoQuotesLatestV1QueryDto,
  //   ): Promise<CmcCryptoQuotesLatestV1Dto> {
  //     this.guard();
  //     const fn = this.apiClient.getQuotesLatest;
  //     if (!fn) {
  //       throw new UnprocessableEntityException({
  //         status: HttpStatus.UNPROCESSABLE_ENTITY,
  //         message:
  //           'CMC endpoint "cryptocurrency/quotes/latest(v1)" is not registered',
  //         errors: { endpoint: 'NotRegistered' },
  //       });
  //     }
  //     const params = { ...(q ?? {}) };
  //     if (!params.convert) params.convert = this.defaultFiat;
  //     const raw = await fn({ params });
  //     return GroupPlainToInstance(CmcCryptoQuotesLatestV1Dto, raw, [
  //       RoleEnum.admin,
  //     ]);
  //   }
  //
  //   async getQuotesHistorical(
  //     q: CmcCryptoQuotesHistoricalV1QueryDto,
  //   ): Promise<CmcCryptoQuotesHistoricalV1Dto> {
  //     this.guard();
  //     const fn = this.apiClient.getQuotesHistorical;
  //     if (!fn) {
  //       throw new UnprocessableEntityException({
  //         status: HttpStatus.UNPROCESSABLE_ENTITY,
  //         message:
  //           'CMC endpoint "cryptocurrency/quotes/historical(v1)" is not registered',
  //         errors: { endpoint: 'NotRegistered' },
  //       });
  //     }
  //     const params = { ...(q ?? {}) };
  //     if (!params.convert) params.convert = this.defaultFiat;
  //     const raw = await fn({ params });
  //     return GroupPlainToInstance(CmcCryptoQuotesHistoricalV1Dto, raw, [
  //       RoleEnum.admin,
  //     ]);
  //   }
  //
  //   async getMarketPairsLatest(
  //     q: CmcCryptoMarketPairsLatestV1QueryDto,
  //   ): Promise<CmcCryptoMarketPairsLatestV1Dto> {
  //     this.guard();
  //     const fn = this.apiClient.getMarketPairsLatest;
  //     if (!fn) {
  //       throw new UnprocessableEntityException({
  //         status: HttpStatus.UNPROCESSABLE_ENTITY,
  //         message:
  //           'CMC endpoint "cryptocurrency/market-pairs/latest(v1)" is not registered',
  //         errors: { endpoint: 'NotRegistered' },
  //       });
  //     }
  //     const params = { ...(q ?? {}) };
  //     if (!params.convert) params.convert = this.defaultFiat;
  //     const raw = await fn({ params });
  //     return GroupPlainToInstance(CmcCryptoMarketPairsLatestV1Dto, raw, [
  //       RoleEnum.admin,
  //     ]);
  //   }
  //
  //   async getOhlcvLatest(
  //     q: CmcCryptoOhlcvLatestV1QueryDto,
  //   ): Promise<CmcCryptoOhlcvLatestV1Dto> {
  //     this.guard();
  //     const fn = this.apiClient.getOhlcvLatest;
  //     if (!fn) {
  //       throw new UnprocessableEntityException({
  //         status: HttpStatus.UNPROCESSABLE_ENTITY,
  //         message:
  //           'CMC endpoint "cryptocurrency/ohlcv/latest(v1)" is not registered',
  //         errors: { endpoint: 'NotRegistered' },
  //       });
  //     }
  //     const params = { ...(q ?? {}) };
  //     if (!params.convert) params.convert = this.defaultFiat;
  //     const raw = await fn({ params });
  //     return GroupPlainToInstance(CmcCryptoOhlcvLatestV1Dto, raw, [
  //       RoleEnum.admin,
  //     ]);
  //   }
  //
  //   async getOhlcvHistorical(
  //     q: CmcCryptoOhlcvHistoricalV1QueryDto,
  //   ): Promise<CmcCryptoOhlcvHistoricalV1Dto> {
  //     this.guard();
  //     const fn = this.apiClient.getOhlcvHistorical;
  //     if (!fn) {
  //       throw new UnprocessableEntityException({
  //         status: HttpStatus.UNPROCESSABLE_ENTITY,
  //         message:
  //           'CMC endpoint "cryptocurrency/ohlcv/historical(v1)" is not registered',
  //         errors: { endpoint: 'NotRegistered' },
  //       });
  //     }
  //     const params = { ...(q ?? {}) };
  //     if (!params.convert) params.convert = this.defaultFiat;
  //     const raw = await fn({ params });
  //     return GroupPlainToInstance(CmcCryptoOhlcvHistoricalV1Dto, raw, [
  //       RoleEnum.admin,
  //     ]);
  //   }
  //
  //   async getPricePerformanceStatsLatest(
  //     q: CmcCryptoPpsLatestV1QueryDto,
  //   ): Promise<CmcCryptoPpsLatestV1Dto> {
  //     this.guard();
  //     const fn = this.apiClient.getPricePerformanceStatsLatest;
  //     if (!fn) {
  //       throw new UnprocessableEntityException({
  //         status: HttpStatus.UNPROCESSABLE_ENTITY,
  //         message:
  //           'CMC endpoint "cryptocurrency/price-performance-stats/latest(v1)" is not registered',
  //         errors: { endpoint: 'NotRegistered' },
  //       });
  //     }
  //     const params = { ...(q ?? {}) };
  //     if (!params.convert) params.convert = this.defaultFiat;
  //     const raw = await fn({ params });
  //     return GroupPlainToInstance(CmcCryptoPpsLatestV1Dto, raw, [RoleEnum.admin]);
  //   }
  //
  //   async getCategories(
  //     q: CmcCryptoCategoriesQueryDto,
  //   ): Promise<CmcCryptoCategoriesV1Dto> {
  //     this.guard();
  //     const fn = this.apiClient.getCategories;
  //     if (!fn) {
  //       throw new UnprocessableEntityException({
  //         status: HttpStatus.UNPROCESSABLE_ENTITY,
  //         message: 'CMC endpoint "cryptocurrency/categories" is not registered',
  //         errors: { endpoint: 'NotRegistered' },
  //       });
  //     }
  //     const raw = await fn({ params: q ?? {} });
  //     return GroupPlainToInstance(CmcCryptoCategoriesV1Dto, raw, [
  //       RoleEnum.admin,
  //     ]);
  //   }
  //
  //   async getCategory(
  //     q: CmcCryptoCategoryQueryDto,
  //   ): Promise<CmcCryptoCategoryV1Dto> {
  //     this.guard();
  //     const fn = this.apiClient.getCategory;
  //     if (!fn) {
  //       throw new UnprocessableEntityException({
  //         status: HttpStatus.UNPROCESSABLE_ENTITY,
  //         message: 'CMC endpoint "cryptocurrency/category" is not registered',
  //         errors: { endpoint: 'NotRegistered' },
  //       });
  //     }
  //     const raw = await fn({ params: q ?? {} });
  //     return GroupPlainToInstance(CmcCryptoCategoryV1Dto, raw, [RoleEnum.admin]);
  //   }
  //
  //   async getAirdrops(
  //     q: CmcCryptoAirdropsQueryDto,
  //   ): Promise<CmcCryptoAirdropsV1Dto> {
  //     this.guard();
  //     const fn = this.apiClient.getAirdrops;
  //     if (!fn) {
  //       throw new UnprocessableEntityException({
  //         status: HttpStatus.UNPROCESSABLE_ENTITY,
  //         message: 'CMC endpoint "cryptocurrency/airdrops" is not registered',
  //         errors: { endpoint: 'NotRegistered' },
  //       });
  //     }
  //     const raw = await fn({ params: q ?? {} });
  //     return GroupPlainToInstance(CmcCryptoAirdropsV1Dto, raw, [RoleEnum.admin]);
  //   }
  //
  //   async getAirdrop(
  //     q: CmcCryptoAirdropQueryDto,
  //   ): Promise<CmcCryptoAirdropV1Dto> {
  //     this.guard();
  //     const fn = this.apiClient.getAirdrop;
  //     if (!fn) {
  //       throw new UnprocessableEntityException({
  //         status: HttpStatus.UNPROCESSABLE_ENTITY,
  //         message: 'CMC endpoint "cryptocurrency/airdrop" is not registered',
  //         errors: { endpoint: 'NotRegistered' },
  //       });
  //     }
  //     const raw = await fn({ params: q ?? {} });
  //     return GroupPlainToInstance(CmcCryptoAirdropV1Dto, raw, [RoleEnum.admin]);
  //   }
  //
  //   // ---------------------------------------------------------------------------
  //   // Cryptocurrency — Trending
  //   // ---------------------------------------------------------------------------
  //   async getTrendingLatest(
  //     q: CmcTrendingQueryDto,
  //   ): Promise<CmcTrendingLatestV1Dto> {
  //     this.guard();
  //     const fn = this.apiClient.getTrendingLatest;
  //     if (!fn) {
  //       throw new UnprocessableEntityException({
  //         status: HttpStatus.UNPROCESSABLE_ENTITY,
  //         message:
  //           'CMC endpoint "cryptocurrency/trending/latest" is not registered',
  //         errors: { endpoint: 'NotRegistered' },
  //       });
  //     }
  //     const raw = await fn({ params: q ?? {} });
  //     return GroupPlainToInstance(CmcTrendingLatestV1Dto, raw, [RoleEnum.admin]);
  //   }
  //
  //   async getTrendingMostVisited(
  //     q: CmcTrendingQueryDto,
  //   ): Promise<CmcTrendingMostVisitedV1Dto> {
  //     this.guard();
  //     const fn = this.apiClient.getTrendingMostVisited;
  //     if (!fn) {
  //       throw new UnprocessableEntityException({
  //         status: HttpStatus.UNPROCESSABLE_ENTITY,
  //         message:
  //           'CMC endpoint "cryptocurrency/trending/most-visited" is not registered',
  //         errors: { endpoint: 'NotRegistered' },
  //       });
  //     }
  //     const raw = await fn({ params: q ?? {} });
  //     return GroupPlainToInstance(CmcTrendingMostVisitedV1Dto, raw, [
  //       RoleEnum.admin,
  //     ]);
  //   }
  //
  //   async getTrendingGainersLosers(
  //     q: CmcTrendingQueryDto,
  //   ): Promise<CmcTrendingGainersLosersV1Dto> {
  //     this.guard();
  //     const fn = this.apiClient.getTrendingGainersLosers;
  //     if (!fn) {
  //       throw new UnprocessableEntityException({
  //         status: HttpStatus.UNPROCESSABLE_ENTITY,
  //         message:
  //           'CMC endpoint "cryptocurrency/trending/gainers-losers" is not registered',
  //         errors: { endpoint: 'NotRegistered' },
  //       });
  //     }
  //     const raw = await fn({ params: q ?? {} });
  //     return GroupPlainToInstance(CmcTrendingGainersLosersV1Dto, raw, [
  //       RoleEnum.admin,
  //     ]);
  //   }
  //
  //   // ---------------------------------------------------------------------------
  //   // Exchange
  //   // ---------------------------------------------------------------------------
  //   async getExchangeMap(q: CmcExchangeMapQueryDto): Promise<CmcExchangeMapDto> {
  //     this.guard();
  //     const fn = this.apiClient.getExchangeMap;
  //     if (!fn) {
  //       throw new UnprocessableEntityException({
  //         status: HttpStatus.UNPROCESSABLE_ENTITY,
  //         message: 'CMC endpoint "exchange/map" is not registered',
  //         errors: { endpoint: 'NotRegistered' },
  //       });
  //     }
  //     const raw = await fn({ params: q ?? {} });
  //     return GroupPlainToInstance(CmcExchangeMapDto, raw, [RoleEnum.admin]);
  //   }
  //
  //   async getExchangeInfo(
  //     q: CmcExchangeInfoQueryDto,
  //   ): Promise<CmcExchangeInfoDto> {
  //     this.guard();
  //     const fn = this.apiClient.getExchangeInfo;
  //     if (!fn) {
  //       throw new UnprocessableEntityException({
  //         status: HttpStatus.UNPROCESSABLE_ENTITY,
  //         message: 'CMC endpoint "exchange/info" is not registered',
  //         errors: { endpoint: 'NotRegistered' },
  //       });
  //     }
  //     const raw = await fn({ params: q ?? {} });
  //     return GroupPlainToInstance(CmcExchangeInfoDto, raw, [RoleEnum.admin]);
  //   }
  //
  //   async getExchangeListingsLatest(
  //     q: CmcExchangeListingsLatestQueryDto,
  //   ): Promise<CmcExchangeListingsLatestDto> {
  //     this.guard();
  //     const fn = this.apiClient.getExchangeListingsLatest;
  //     if (!fn) {
  //       throw new UnprocessableEntityException({
  //         status: HttpStatus.UNPROCESSABLE_ENTITY,
  //         message: 'CMC endpoint "exchange/listings/latest" is not registered',
  //         errors: { endpoint: 'NotRegistered' },
  //       });
  //     }
  //     const params = { ...(q ?? {}) };
  //     if (!params.convert) params.convert = this.defaultFiat;
  //     const raw = await fn({ params });
  //     return GroupPlainToInstance(CmcExchangeListingsLatestDto, raw, [
  //       RoleEnum.admin,
  //     ]);
  //   }
  //
  //   async getExchangeQuotesLatest(
  //     q: CmcExchangeQuotesLatestQueryDto,
  //   ): Promise<CmcExchangeQuotesLatestDto> {
  //     this.guard();
  //     const fn = this.apiClient.getExchangeQuotesLatest;
  //     if (!fn) {
  //       throw new UnprocessableEntityException({
  //         status: HttpStatus.UNPROCESSABLE_ENTITY,
  //         message: 'CMC endpoint "exchange/quotes/latest" is not registered',
  //         errors: { endpoint: 'NotRegistered' },
  //       });
  //     }
  //     const params = { ...(q ?? {}) };
  //     if (!params.convert) params.convert = this.defaultFiat;
  //     const raw = await fn({ params });
  //     return GroupPlainToInstance(CmcExchangeQuotesLatestDto, raw, [
  //       RoleEnum.admin,
  //     ]);
  //   }
  //
  //   async getExchangeQuotesHistorical(
  //     q: CmcExchangeQuotesHistoricalQueryDto,
  //   ): Promise<CmcExchangeQuotesHistoricalDto> {
  //     this.guard();
  //     const fn = this.apiClient.getExchangeQuotesHistorical;
  //     if (!fn) {
  //       throw new UnprocessableEntityException({
  //         status: HttpStatus.UNPROCESSABLE_ENTITY,
  //         message: 'CMC endpoint "exchange/quotes/historical" is not registered',
  //         errors: { endpoint: 'NotRegistered' },
  //       });
  //     }
  //     const params = { ...(q ?? {}) };
  //     if (!params.convert) params.convert = this.defaultFiat;
  //     const raw = await fn({ params });
  //     return GroupPlainToInstance(CmcExchangeQuotesHistoricalDto, raw, [
  //       RoleEnum.admin,
  //     ]);
  //   }
  //
  //   async getExchangeMarketPairsLatest(
  //     q: CmcExchangeMarketPairsLatestQueryDto,
  //   ): Promise<CmcExchangeMarketPairsLatestDto> {
  //     this.guard();
  //     const fn = this.apiClient.getExchangeMarketPairsLatest;
  //     if (!fn) {
  //       throw new UnprocessableEntityException({
  //         status: HttpStatus.UNPROCESSABLE_ENTITY,
  //         message:
  //           'CMC endpoint "exchange/market-pairs/latest" is not registered',
  //         errors: { endpoint: 'NotRegistered' },
  //       });
  //     }
  //     const params = { ...(q ?? {}) };
  //     if (!params.convert) params.convert = this.defaultFiat;
  //     const raw = await fn({ params });
  //     return GroupPlainToInstance(CmcExchangeMarketPairsLatestDto, raw, [
  //       RoleEnum.admin,
  //     ]);
  //   }
  //
  //   async getExchangeAssets(
  //     q: CmcExchangeAssetsQueryDto,
  //   ): Promise<CmcExchangeAssetsDto> {
  //     this.guard();
  //     const fn = this.apiClient.getExchangeAssets;
  //     if (!fn) {
  //       throw new UnprocessableEntityException({
  //         status: HttpStatus.UNPROCESSABLE_ENTITY,
  //         message: 'CMC endpoint "exchange/assets" is not registered',
  //         errors: { endpoint: 'NotRegistered' },
  //       });
  //     }
  //     const raw = await fn({ params: q ?? {} });
  //     return GroupPlainToInstance(CmcExchangeAssetsDto, raw, [RoleEnum.admin]);
  //   }
  //
  //   // ---------------------------------------------------------------------------
  //   // Generic tools mapping (optional)
  //   // ---------------------------------------------------------------------------
  //   async priceConversion(
  //     q: CmcPriceConversionV2QueryDto,
  //   ): Promise<CmcEnvelopeDto<any>> {
  //     this.guard();
  //     const fn = this.apiClient.priceConversion;
  //     if (!fn) {
  //       throw new UnprocessableEntityException({
  //         status: HttpStatus.UNPROCESSABLE_ENTITY,
  //         message: 'CMC endpoint "tools/price-conversion" is not registered',
  //         errors: { endpoint: 'NotRegistered' },
  //       });
  //     }
  //     const params = { ...(q ?? {}) };
  //     if (!params.convert) params.convert = this.defaultFiat;
  //     const raw = await fn({ params });
  //     return GroupPlainToInstance(CmcEnvelopeDto<any>, raw, [RoleEnum.admin]);
  //   }
}
