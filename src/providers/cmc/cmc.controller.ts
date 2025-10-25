import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

import { CmcService } from './cmc.service';
import { RolesGuard } from '../../roles/roles.guard';
import { Roles } from '../../roles/roles.decorator';
import { RoleEnum } from '../../roles/roles.enum';
import { ApiOperationRoles } from '../../utils/decorators/swagger.decorator';
import { CmcKeyInfoDto } from './dto/cmc-info.dto';
import {
  RequireEnabled,
  RequireServiceReady,
} from 'src/utils/decorators/service-toggleable.decorators';
import { EnableGuard } from 'src/common/guards/service-enabled.guard';
import {
  CmcGlobalMetricsQueryDto,
  CmcGlobalMetricsHistoricalQueryDto,
} from './dto/cmc-base.query.dto';
import {
  CmcGlobalMetricsQuotesLatestDto,
  CmcGlobalMetricsQuotesHistoricalDto,
} from './dto/cmc-global-metrics.dto';
import { ResponseModel } from '../../common/api-gateway/response/decorators/response-model.decorator';

// import {
//   CmcGlobalMetricsQuotesLatestDto,
//   CmcGlobalMetricsQuotesHistoricalDto,
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
//
// // Crypto (v1 + v2/v3)
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
//   CmcCryptoListingsHistoricalV1Dto,
//   CmcCryptoMapV1Dto,
//   CmcCryptoInfoV1Dto,
// } from './dto/cmc-cryptocurrency.dto';
//
// // Exchange
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
// // ===== Query DTOs (reused across handlers) =====
// import {
//   CmcGlobalMetricsQueryDto,
//   CmcGlobalMetricsHistoricalQueryDto,
//   CmcPriceConversionV1QueryDto,
//   CmcPriceConversionV2QueryDto,
//   CmcFiatMapQueryDto,
//   CmcBlockchainStatisticsLatestQueryDto,
//   CmcFearAndGreedHistoricalQueryDto,
//   CmcIndexHistoricalQueryDto,
//   // Crypto queries
//   CmcQuotesLatestQueryDto,
//   CmcQuotesHistoricalV2QueryDto,
//   CmcQuotesHistoricalV3QueryDto,
//   CmcOhlcvLatestV2QueryDto,
//   CmcOhlcvHistoricalV2QueryDto,
//   CmcMarketPairsLatestV2QueryDto,
//   CmcPpsLatestV2QueryDto,
//   CmcCryptoMapQueryDto,
//   CmcCryptoInfoQueryDto,
//   CmcCryptoListingsLatestQueryDto,
//   CmcCryptoListingsHistoricalQueryDto,
//   CmcCryptoQuotesLatestV1QueryDto,
//   CmcCryptoQuotesHistoricalV1QueryDto,
//   CmcCryptoMarketPairsLatestV1QueryDto,
//   CmcCryptoOhlcvLatestV1QueryDto,
//   CmcCryptoOhlcvHistoricalV1QueryDto,
//   CmcCryptoPpsLatestV1QueryDto,
//   CmcCryptoCategoriesQueryDto,
//   CmcCryptoCategoryQueryDto,
//   CmcCryptoAirdropsQueryDto,
//   CmcCryptoAirdropQueryDto,
//   CmcTrendingQueryDto,
//   // Exchange queries
//   CmcExchangeMapQueryDto,
//   CmcExchangeInfoQueryDto,
//   CmcExchangeListingsLatestQueryDto,
//   CmcExchangeQuotesLatestQueryDto,
//   CmcExchangeQuotesHistoricalQueryDto,
//   CmcExchangeMarketPairsLatestQueryDto,
//   CmcExchangeAssetsQueryDto,
// } from './dto/cmc-base.query.dto';
@ResponseModel('CMC')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'), RolesGuard, EnableGuard)
@RequireEnabled('cmc.enable') // config-based toggle
@RequireServiceReady(CmcService) // service readiness check
@ApiTags('CoinMarketCap')
@Controller({ path: 'cmc', version: '1' })
export class CmcController {
  constructor(private readonly cmc: CmcService) {}

  // ---------------------------------------------------------------------------
  // Key / Plan usage
  // ---------------------------------------------------------------------------
  @Roles(RoleEnum.admin)
  @ApiOperationRoles('Get CMC key info (plan/usage)', [RoleEnum.admin])
  @Get('key/info')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: CmcKeyInfoDto })
  getKeyInfo(): Promise<CmcKeyInfoDto> {
    return this.cmc.getKeyInfo();
  }

  // ---------------------------------------------------------------------------
  // Global Metrics
  // ---------------------------------------------------------------------------
  @Roles(RoleEnum.admin)
  @ApiOperationRoles('Get latest global metrics', [RoleEnum.admin])
  @Get('global/metrics/quotes/latest')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: CmcGlobalMetricsQuotesLatestDto })
  getGlobalMetricsLatest(
    @Query() query: CmcGlobalMetricsQueryDto,
  ): Promise<CmcGlobalMetricsQuotesLatestDto> {
    return this.cmc.getGlobalMetricsLatest(query);
  }

  @Roles(RoleEnum.admin)
  @ApiOperationRoles('Get historical global metrics', [RoleEnum.admin])
  @Get('global/metrics/quotes/historical')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: CmcGlobalMetricsQuotesHistoricalDto })
  getGlobalMetricsHistorical(
    @Query() query: CmcGlobalMetricsHistoricalQueryDto,
  ): Promise<CmcGlobalMetricsQuotesHistoricalDto> {
    return this.cmc.getGlobalMetricsHistorical(query);
  }

  // // ---------------------------------------------------------------------------
  // // Tools
  // // ---------------------------------------------------------------------------
  // @Roles(RoleEnum.admin)
  // @ApiOperationRoles('Price conversion (v2)', [RoleEnum.admin])
  // @Get('tools/price-conversion')
  // @HttpCode(HttpStatus.OK)
  // @ApiOkResponse({ type: CmcToolsPriceConversionV2Dto })
  // priceConversionV2(
  //   @Query() query: CmcPriceConversionV2QueryDto,
  // ): Promise<CmcToolsPriceConversionV2Dto> {
  //   return this.cmc.priceConversionV2(query);
  // }

  // @Roles(RoleEnum.admin)
  // @ApiOperationRoles('Price conversion (v1)', [RoleEnum.admin])
  // @Get('tools/price-conversion-v1')
  // @HttpCode(HttpStatus.OK)
  // @ApiOkResponse({ type: CmcToolsPriceConversionV1Dto })
  // priceConversionV1(
  //   @Query() query: CmcPriceConversionV1QueryDto,
  // ): Promise<CmcToolsPriceConversionV1Dto> {
  //   return this.cmc.priceConversionV1(query);
  // }

  // // ---------------------------------------------------------------------------
  // // Fiat
  // // ---------------------------------------------------------------------------
  // @Roles(RoleEnum.admin)
  // @ApiOperationRoles('Get fiat map', [RoleEnum.admin])
  // @Get('fiat/map')
  // @HttpCode(HttpStatus.OK)
  // @ApiOkResponse({ type: CmcFiatMapDto })
  // getFiatMap(@Query() query: CmcFiatMapQueryDto): Promise<CmcFiatMapDto> {
  //   return this.cmc.getFiatMap(query);
  // }

  // // ---------------------------------------------------------------------------
  // // Blockchain
  // // ---------------------------------------------------------------------------
  // @Roles(RoleEnum.admin)
  // @ApiOperationRoles('Get blockchain statistics latest', [RoleEnum.admin])
  // @Get('blockchain/statistics/latest')
  // @HttpCode(HttpStatus.OK)
  // @ApiOkResponse({ type: CmcBlockchainStatisticsLatestDto })
  // getBlockchainStatisticsLatest(
  //   @Query() query: CmcBlockchainStatisticsLatestQueryDto,
  // ): Promise<CmcBlockchainStatisticsLatestDto> {
  //   return this.cmc.getBlockchainStatisticsLatest(query);
  // }

  // // ---------------------------------------------------------------------------
  // // Fear & Greed
  // // ---------------------------------------------------------------------------
  // @Roles(RoleEnum.admin)
  // @ApiOperationRoles('Get fear & greed latest', [RoleEnum.admin])
  // @Get('fear-and-greed/latest')
  // @HttpCode(HttpStatus.OK)
  // @ApiOkResponse({ type: CmcFearAndGreedLatestDto })
  // getFearAndGreedLatest(): Promise<CmcFearAndGreedLatestDto> {
  //   return this.cmc.getFearAndGreedLatest();
  // }

  // @Roles(RoleEnum.admin)
  // @ApiOperationRoles('Get fear & greed historical', [RoleEnum.admin])
  // @Get('fear-and-greed/historical')
  // @HttpCode(HttpStatus.OK)
  // @ApiOkResponse({ type: CmcFearAndGreedHistoricalDto })
  // getFearAndGreedHistorical(
  //   @Query() query: CmcFearAndGreedHistoricalQueryDto,
  // ): Promise<CmcFearAndGreedHistoricalDto> {
  //   return this.cmc.getFearAndGreedHistorical(query);
  // }

  // // ---------------------------------------------------------------------------
  // // Index (CMC20 / CMC100)
  // // ---------------------------------------------------------------------------
  // @Roles(RoleEnum.admin)
  // @ApiOperationRoles('Get CMC20 latest', [RoleEnum.admin])
  // @Get('index/cmc20-latest')
  // @HttpCode(HttpStatus.OK)
  // @ApiOkResponse({ type: CmcIndexLatestDto })
  // getIndexCmc20Latest(): Promise<CmcIndexLatestDto> {
  //   return this.cmc.getIndexCmc20Latest();
  // }

  // @Roles(RoleEnum.admin)
  // @ApiOperationRoles('Get CMC20 historical', [RoleEnum.admin])
  // @Get('index/cmc20-historical')
  // @HttpCode(HttpStatus.OK)
  // @ApiOkResponse({ type: CmcIndexHistoricalDto })
  // getIndexCmc20Historical(
  //   @Query() query: CmcIndexHistoricalQueryDto,
  // ): Promise<CmcIndexHistoricalDto> {
  //   return this.cmc.getIndexCmc20Historical(query);
  // }

  // @Roles(RoleEnum.admin)
  // @ApiOperationRoles('Get CMC100 latest', [RoleEnum.admin])
  // @Get('index/cmc100-latest')
  // @HttpCode(HttpStatus.OK)
  // @ApiOkResponse({ type: CmcIndexLatestDto })
  // getIndexCmc100Latest(): Promise<CmcIndexLatestDto> {
  //   return this.cmc.getIndexCmc100Latest();
  // }

  // @Roles(RoleEnum.admin)
  // @ApiOperationRoles('Get CMC100 historical', [RoleEnum.admin])
  // @Get('index/cmc100-historical')
  // @HttpCode(HttpStatus.OK)
  // @ApiOkResponse({ type: CmcIndexHistoricalDto })
  // getIndexCmc100Historical(
  //   @Query() query: CmcIndexHistoricalQueryDto,
  // ): Promise<CmcIndexHistoricalDto> {
  //   return this.cmc.getIndexCmc100Historical(query);
  // }

  // // ---------------------------------------------------------------------------
  // // Cryptocurrency — v2/v3
  // // ---------------------------------------------------------------------------
  // @Roles(RoleEnum.admin)
  // @ApiOperationRoles('Crypto quotes latest (v2)', [RoleEnum.admin])
  // @Get('cryptocurrency/quotes/latest-v2')
  // @HttpCode(HttpStatus.OK)
  // @ApiOkResponse({ type: CmcCryptoQuotesLatestV2Dto })
  // getQuotesLatestV2(
  //   @Query() query: CmcQuotesLatestQueryDto,
  // ): Promise<CmcCryptoQuotesLatestV2Dto> {
  //   return this.cmc.getQuotesLatestV2(query);
  // }

  // @Roles(RoleEnum.admin)
  // @ApiOperationRoles('Crypto quotes historical (v2)', [RoleEnum.admin])
  // @Get('cryptocurrency/quotes/historical-v2')
  // @HttpCode(HttpStatus.OK)
  // @ApiOkResponse({ type: CmcCryptoQuotesHistoricalV2Dto })
  // getQuotesHistoricalV2(
  //   @Query() query: CmcQuotesHistoricalV2QueryDto,
  // ): Promise<CmcCryptoQuotesHistoricalV2Dto> {
  //   return this.cmc.getQuotesHistoricalV2(query);
  // }

  // @Roles(RoleEnum.admin)
  // @ApiOperationRoles('Crypto quotes historical (v3)', [RoleEnum.admin])
  // @Get('cryptocurrency/quotes/historical-v3')
  // @HttpCode(HttpStatus.OK)
  // @ApiOkResponse({ type: CmcCryptoQuotesHistoricalV3Dto })
  // getQuotesHistoricalV3(
  //   @Query() query: CmcQuotesHistoricalV3QueryDto,
  // ): Promise<CmcCryptoQuotesHistoricalV3Dto> {
  //   return this.cmc.getQuotesHistoricalV3(query);
  // }

  // @Roles(RoleEnum.admin)
  // @ApiOperationRoles('OHLCV latest (v2)', [RoleEnum.admin])
  // @Get('cryptocurrency/ohlcv/latest-v2')
  // @HttpCode(HttpStatus.OK)
  // @ApiOkResponse({ type: CmcCryptoOhlcvLatestV2Dto })
  // getOhlcvLatestV2(
  //   @Query() query: CmcOhlcvLatestV2QueryDto,
  // ): Promise<CmcCryptoOhlcvLatestV2Dto> {
  //   return this.cmc.getOhlcvLatestV2(query);
  // }

  // @Roles(RoleEnum.admin)
  // @ApiOperationRoles('OHLCV historical (v2)', [RoleEnum.admin])
  // @Get('cryptocurrency/ohlcv/historical-v2')
  // @HttpCode(HttpStatus.OK)
  // @ApiOkResponse({ type: CmcCryptoOhlcvHistoricalV2Dto })
  // getOhlcvHistoricalV2(
  //   @Query() query: CmcOhlcvHistoricalV2QueryDto,
  // ): Promise<CmcCryptoOhlcvHistoricalV2Dto> {
  //   return this.cmc.getOhlcvHistoricalV2(query);
  // }

  // @Roles(RoleEnum.admin)
  // @ApiOperationRoles('Market pairs latest (v2)', [RoleEnum.admin])
  // @Get('cryptocurrency/market-pairs/latest-v2')
  // @HttpCode(HttpStatus.OK)
  // @ApiOkResponse({ type: CmcCryptoMarketPairsLatestV2Dto })
  // getMarketPairsLatestV2(
  //   @Query() query: CmcMarketPairsLatestV2QueryDto,
  // ): Promise<CmcCryptoMarketPairsLatestV2Dto> {
  //   return this.cmc.getMarketPairsLatestV2(query);
  // }

  // @Roles(RoleEnum.admin)
  // @ApiOperationRoles('Price performance stats latest (v2)', [RoleEnum.admin])
  // @Get('cryptocurrency/pps/latest-v2')
  // @HttpCode(HttpStatus.OK)
  // @ApiOkResponse({ type: CmcCryptoPpsLatestV2Dto })
  // getPricePerformanceStatsLatestV2(
  //   @Query() query: CmcPpsLatestV2QueryDto,
  // ): Promise<CmcCryptoPpsLatestV2Dto> {
  //   return this.cmc.getPricePerformanceStatsLatestV2(query);
  // }

  // // ---------------------------------------------------------------------------
  // // Cryptocurrency — v1
  // // ---------------------------------------------------------------------------
  // @Roles(RoleEnum.admin)
  // @ApiOperationRoles('Crypto map', [RoleEnum.admin])
  // @Get('cryptocurrency/map')
  // @HttpCode(HttpStatus.OK)
  // @ApiOkResponse({ type: CmcCryptoMapV1Dto })
  // getCryptoMap(@Query() query: CmcCryptoMapQueryDto): Promise<CmcCryptoMapV1Dto> {
  //   return this.cmc.getCryptoMap(query);
  // }

  // @Roles(RoleEnum.admin)
  // @ApiOperationRoles('Crypto info', [RoleEnum.admin])
  // @Get('cryptocurrency/info')
  // @HttpCode(HttpStatus.OK)
  // @ApiOkResponse({ type: CmcCryptoInfoV1Dto })
  // getCryptoInfo(
  //   @Query() query: CmcCryptoInfoQueryDto,
  // ): Promise<CmcCryptoInfoV1Dto> {
  //   return this.cmc.getCryptoInfo(query);
  // }

  // @Roles(RoleEnum.admin)
  // @ApiOperationRoles('Crypto listings latest', [RoleEnum.admin])
  // @Get('cryptocurrency/listings/latest')
  // @HttpCode(HttpStatus.OK)
  // @ApiOkResponse({ type: CmcCryptoListingsLatestV1Dto })
  // getCryptoListingsLatest(
  //   @Query() query: CmcCryptoListingsLatestQueryDto,
  // ): Promise<CmcCryptoListingsLatestV1Dto> {
  //   return this.cmc.getCryptoListingsLatest(query);
  // }

  // @Roles(RoleEnum.admin)
  // @ApiOperationRoles('Crypto listings historical', [RoleEnum.admin])
  // @Get('cryptocurrency/listings/historical')
  // @HttpCode(HttpStatus.OK)
  // @ApiOkResponse({ type: CmcCryptoListingsHistoricalV1Dto })
  // getCryptoListingsHistorical(
  //   @Query() query: CmcCryptoListingsHistoricalQueryDto,
  // ): Promise<CmcCryptoListingsHistoricalV1Dto> {
  //   return this.cmc.getCryptoListingsHistorical(query);
  // }

  // @Roles(RoleEnum.admin)
  // @ApiOperationRoles('Crypto quotes latest (v1)', [RoleEnum.admin])
  // @Get('cryptocurrency/quotes/latest')
  // @HttpCode(HttpStatus.OK)
  // @ApiOkResponse({ type: CmcCryptoQuotesLatestV1Dto })
  // getQuotesLatest(
  //   @Query() query: CmcCryptoQuotesLatestV1QueryDto,
  // ): Promise<CmcCryptoQuotesLatestV1Dto> {
  //   return this.cmc.getQuotesLatest(query);
  // }

  // @Roles(RoleEnum.admin)
  // @ApiOperationRoles('Crypto quotes historical (v1)', [RoleEnum.admin])
  // @Get('cryptocurrency/quotes/historical')
  // @HttpCode(HttpStatus.OK)
  // @ApiOkResponse({ type: CmcCryptoQuotesHistoricalV1Dto })
  // getQuotesHistorical(
  //   @Query() query: CmcCryptoQuotesHistoricalV1QueryDto,
  // ): Promise<CmcCryptoQuotesHistoricalV1Dto> {
  //   return this.cmc.getQuotesHistorical(query);
  // }

  // @Roles(RoleEnum.admin)
  // @ApiOperationRoles('Market pairs latest (v1)', [RoleEnum.admin])
  // @Get('cryptocurrency/market-pairs/latest')
  // @HttpCode(HttpStatus.OK)
  // @ApiOkResponse({ type: CmcCryptoMarketPairsLatestV1Dto })
  // getMarketPairsLatest(
  //   @Query() query: CmcCryptoMarketPairsLatestV1QueryDto,
  // ): Promise<CmcCryptoMarketPairsLatestV1Dto> {
  //   return this.cmc.getMarketPairsLatest(query);
  // }

  // @Roles(RoleEnum.admin)
  // @ApiOperationRoles('OHLCV latest (v1)', [RoleEnum.admin])
  // @Get('cryptocurrency/ohlcv/latest')
  // @HttpCode(HttpStatus.OK)
  // @ApiOkResponse({ type: CmcCryptoOhlcvLatestV1Dto })
  // getOhlcvLatest(
  //   @Query() query: CmcCryptoOhlcvLatestV1QueryDto,
  // ): Promise<CmcCryptoOhlcvLatestV1Dto> {
  //   return this.cmc.getOhlcvLatest(query);
  // }

  // @Roles(RoleEnum.admin)
  // @ApiOperationRoles('OHLCV historical (v1)', [RoleEnum.admin])
  // @Get('cryptocurrency/ohlcv/historical')
  // @HttpCode(HttpStatus.OK)
  // @ApiOkResponse({ type: CmcCryptoOhlcvHistoricalV1Dto })
  // getOhlcvHistorical(
  //   @Query() query: CmcCryptoOhlcvHistoricalV1QueryDto,
  // ): Promise<CmcCryptoOhlcvHistoricalV1Dto> {
  //   return this.cmc.getOhlcvHistorical(query);
  // }

  // @Roles(RoleEnum.admin)
  // @ApiOperationRoles('Price performance stats latest (v1)', [RoleEnum.admin])
  // @Get('cryptocurrency/pps/latest')
  // @HttpCode(HttpStatus.OK)
  // @ApiOkResponse({ type: CmcCryptoPpsLatestV1Dto })
  // getPricePerformanceStatsLatest(
  //   @Query() query: CmcCryptoPpsLatestV1QueryDto,
  // ): Promise<CmcCryptoPpsLatestV1Dto> {
  //   return this.cmc.getPricePerformanceStatsLatest(query);
  // }

  // @Roles(RoleEnum.admin)
  // @ApiOperationRoles('Crypto categories', [RoleEnum.admin])
  // @Get('cryptocurrency/categories')
  // @HttpCode(HttpStatus.OK)
  // @ApiOkResponse({ type: CmcCryptoCategoriesV1Dto })
  // getCategories(
  //   @Query() query: CmcCryptoCategoriesQueryDto,
  // ): Promise<CmcCryptoCategoriesV1Dto> {
  //   return this.cmc.getCategories(query);
  // }

  // @Roles(RoleEnum.admin)
  // @ApiOperationRoles('Crypto category by id/slug', [RoleEnum.admin])
  // @Get('cryptocurrency/category')
  // @HttpCode(HttpStatus.OK)
  // @ApiOkResponse({ type: CmcCryptoCategoryV1Dto })
  // getCategory(
  //   @Query() query: CmcCryptoCategoryQueryDto,
  // ): Promise<CmcCryptoCategoryV1Dto> {
  //   return this.cmc.getCategory(query);
  // }

  // @Roles(RoleEnum.admin)
  // @ApiOperationRoles('Crypto airdrops', [RoleEnum.admin])
  // @Get('cryptocurrency/airdrops')
  // @HttpCode(HttpStatus.OK)
  // @ApiOkResponse({ type: CmcCryptoAirdropsV1Dto })
  // getAirdrops(
  //   @Query() query: CmcCryptoAirdropsQueryDto,
  // ): Promise<CmcCryptoAirdropsV1Dto> {
  //   return this.cmc.getAirdrops(query);
  // }

  // @Roles(RoleEnum.admin)
  // @ApiOperationRoles('Crypto airdrop by id', [RoleEnum.admin])
  // @Get('cryptocurrency/airdrop')
  // @HttpCode(HttpStatus.OK)
  // @ApiOkResponse({ type: CmcCryptoAirdropV1Dto })
  // getAirdrop(
  //   @Query() query: CmcCryptoAirdropQueryDto,
  // ): Promise<CmcCryptoAirdropV1Dto> {
  //   return this.cmc.getAirdrop(query);
  // }

  // // ---------------------------------------------------------------------------
  // // Cryptocurrency — Trending
  // // ---------------------------------------------------------------------------
  // @Roles(RoleEnum.admin)
  // @ApiOperationRoles('Trending latest', [RoleEnum.admin])
  // @Get('cryptocurrency/trending/latest')
  // @HttpCode(HttpStatus.OK)
  // @ApiOkResponse({ type: CmcTrendingLatestV1Dto })
  // getTrendingLatest(
  //   @Query() query: CmcTrendingQueryDto,
  // ): Promise<CmcTrendingLatestV1Dto> {
  //   return this.cmc.getTrendingLatest(query);
  // }

  // @Roles(RoleEnum.admin)
  // @ApiOperationRoles('Trending most visited', [RoleEnum.admin])
  // @Get('cryptocurrency/trending/most-visited')
  // @HttpCode(HttpStatus.OK)
  // @ApiOkResponse({ type: CmcTrendingMostVisitedV1Dto })
  // getTrendingMostVisited(
  //   @Query() query: CmcTrendingQueryDto,
  // ): Promise<CmcTrendingMostVisitedV1Dto> {
  //   return this.cmc.getTrendingMostVisited(query);
  // }

  // @Roles(RoleEnum.admin)
  // @ApiOperationRoles('Trending gainers & losers', [RoleEnum.admin])
  // @Get('cryptocurrency/trending/gainers-losers')
  // @HttpCode(HttpStatus.OK)
  // @ApiOkResponse({ type: CmcTrendingGainersLosersV1Dto })
  // getTrendingGainersLosers(
  //   @Query() query: CmcTrendingQueryDto,
  // ): Promise<CmcTrendingGainersLosersV1Dto> {
  //   return this.cmc.getTrendingGainersLosers(query);
  // }

  // // ---------------------------------------------------------------------------
  // // Exchange
  // // ---------------------------------------------------------------------------
  // @Roles(RoleEnum.admin)
  // @ApiOperationRoles('Exchange map', [RoleEnum.admin])
  // @Get('exchange/map')
  // @HttpCode(HttpStatus.OK)
  // @ApiOkResponse({ type: CmcExchangeMapDto })
  // getExchangeMap(
  //   @Query() query: CmcExchangeMapQueryDto,
  // ): Promise<CmcExchangeMapDto> {
  //   return this.cmc.getExchangeMap(query);
  // }

  // @Roles(RoleEnum.admin)
  // @ApiOperationRoles('Exchange info', [RoleEnum.admin])
  // @Get('exchange/info')
  // @HttpCode(HttpStatus.OK)
  // @ApiOkResponse({ type: CmcExchangeInfoDto })
  // getExchangeInfo(
  //   @Query() query: CmcExchangeInfoQueryDto,
  // ): Promise<CmcExchangeInfoDto> {
  //   return this.cmc.getExchangeInfo(query);
  // }

  // @Roles(RoleEnum.admin)
  // @ApiOperationRoles('Exchange listings latest', [RoleEnum.admin])
  // @Get('exchange/listings/latest')
  // @HttpCode(HttpStatus.OK)
  // @ApiOkResponse({ type: CmcExchangeListingsLatestDto })
  // getExchangeListingsLatest(
  //   @Query() query: CmcExchangeListingsLatestQueryDto,
  // ): Promise<CmcExchangeListingsLatestDto> {
  //   return this.cmc.getExchangeListingsLatest(query);
  // }

  // @Roles(RoleEnum.admin)
  // @ApiOperationRoles('Exchange quotes latest', [RoleEnum.admin])
  // @Get('exchange/quotes/latest')
  // @HttpCode(HttpStatus.OK)
  // @ApiOkResponse({ type: CmcExchangeQuotesLatestDto })
  // getExchangeQuotesLatest(
  //   @Query() query: CmcExchangeQuotesLatestQueryDto,
  // ): Promise<CmcExchangeQuotesLatestDto> {
  //   return this.cmc.getExchangeQuotesLatest(query);
  // }

  // @Roles(RoleEnum.admin)
  // @ApiOperationRoles('Exchange quotes historical', [RoleEnum.admin])
  // @Get('exchange/quotes/historical')
  // @HttpCode(HttpStatus.OK)
  // @ApiOkResponse({ type: CmcExchangeQuotesHistoricalDto })
  // getExchangeQuotesHistorical(
  //   @Query() query: CmcExchangeQuotesHistoricalQueryDto,
  // ): Promise<CmcExchangeQuotesHistoricalDto> {
  //   return this.cmc.getExchangeQuotesHistorical(query);
  // }

  // @Roles(RoleEnum.admin)
  // @ApiOperationRoles('Exchange market pairs latest', [RoleEnum.admin])
  // @Get('exchange/market-pairs/latest')
  // @HttpCode(HttpStatus.OK)
  // @ApiOkResponse({ type: CmcExchangeMarketPairsLatestDto })
  // getExchangeMarketPairsLatest(
  //   @Query() query: CmcExchangeMarketPairsLatestQueryDto,
  // ): Promise<CmcExchangeMarketPairsLatestDto> {
  //   return this.cmc.getExchangeMarketPairsLatest(query);
  // }

  // @Roles(RoleEnum.admin)
  // @ApiOperationRoles('Exchange assets', [RoleEnum.admin])
  // @Get('exchange/assets')
  // @HttpCode(HttpStatus.OK)
  // @ApiOkResponse({ type: CmcExchangeAssetsDto })
  // getExchangeAssets(
  //   @Query() query: CmcExchangeAssetsQueryDto,
  // ): Promise<CmcExchangeAssetsDto> {
  //   return this.cmc.getExchangeAssets(query);
  // }
}
