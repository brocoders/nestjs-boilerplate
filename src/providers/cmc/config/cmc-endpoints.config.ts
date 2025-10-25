// -----------------------------------------------------------------------------
// CoinMarketCap Pro API endpoints

import { ApiGatewayConfig } from 'src/common/api-gateway/api-gateway-config';
import { HttpMethod } from 'src/common/api-gateway/types/api-gateway.enum';
import {
  getCmcSectionVersion,
  getCmcCategoryPath,
  getCmcBaseUrl,
} from '../cmc.helper';
import { CmcCategory } from '../types/cmc-enum.type';
import { CMC_ENV_TYPE } from '../types/cmc-const.type';
import { unwrapData } from '../utils/cmc-helper';

export class CmcApiConfig extends ApiGatewayConfig {
  constructor() {
    const defaultBaseUrl = getCmcBaseUrl(CMC_ENV_TYPE);

    super(defaultBaseUrl, { Accept: 'application/json' });
    this.name = 'CMC';

    const envType = CMC_ENV_TYPE;

    const vCrypto = getCmcSectionVersion(CmcCategory.CRYPTOCURRENCY, envType);
    const vGlobal = getCmcSectionVersion(CmcCategory.GLOBAL_METRICS, envType);
    const vExchange = getCmcSectionVersion(CmcCategory.EXCHANGE, envType);
    const vTools = getCmcSectionVersion(CmcCategory.TOOLS, envType);
    const vBlockchain = getCmcSectionVersion(CmcCategory.BLOCKCHAIN, envType);
    const vFiat = getCmcSectionVersion(CmcCategory.FIAT, envType);
    const vKey = getCmcSectionVersion(CmcCategory.KEY, envType);

    // Small helper to always attach unwrapData
    const add = (name: string, method: HttpMethod, path: string) => {
      // Adjust the option key to what your ApiGatewayConfig expects:
      // e.g. { mapResponse: unwrapData } or { after: unwrapData } or { transform: unwrapData }
      this.addEndpoint(name, method, path, { mapResponse: unwrapData });
    };

    // --- Cryptocurrency ----------------------------------------------------
    const cryptoBase = `/${vCrypto}${getCmcCategoryPath(CmcCategory.CRYPTOCURRENCY)}`;
    add('getCryptoMap', HttpMethod.GET, `${cryptoBase}/map`);
    add('getCryptoInfo', HttpMethod.GET, `${cryptoBase}/info`);
    add(
      'getCryptoListingsLatest',
      HttpMethod.GET,
      `${cryptoBase}/listings/latest`,
    );
    add(
      'getCryptoListingsHistorical',
      HttpMethod.GET,
      `${cryptoBase}/listings/historical`,
    );
    add('getQuotesLatest', HttpMethod.GET, `${cryptoBase}/quotes/latest`);
    add(
      'getQuotesHistorical',
      HttpMethod.GET,
      `${cryptoBase}/quotes/historical`,
    );
    add(
      'getMarketPairsLatest',
      HttpMethod.GET,
      `${cryptoBase}/market-pairs/latest`,
    );
    add('getOhlcvLatest', HttpMethod.GET, `${cryptoBase}/ohlcv/latest`);
    add('getOhlcvHistorical', HttpMethod.GET, `${cryptoBase}/ohlcv/historical`);
    add(
      'getPricePerformanceStatsLatest',
      HttpMethod.GET,
      `${cryptoBase}/price-performance-stats/latest`,
    );
    add('getCategories', HttpMethod.GET, `${cryptoBase}/categories`);
    add('getCategory', HttpMethod.GET, `${cryptoBase}/category`);
    add('getAirdrops', HttpMethod.GET, `${cryptoBase}/airdrops`);
    add('getAirdrop', HttpMethod.GET, `${cryptoBase}/airdrop`);
    add('getTrendingLatest', HttpMethod.GET, `${cryptoBase}/trending/latest`);
    add(
      'getTrendingMostVisited',
      HttpMethod.GET,
      `${cryptoBase}/trending/most-visited`,
    );
    add(
      'getTrendingGainersLosers',
      HttpMethod.GET,
      `${cryptoBase}/trending/gainers-losers`,
    );

    // ---- Explicit v2/v3 CRYPTO -------------------------------------------
    add(
      'getQuotesLatestV2',
      HttpMethod.GET,
      `/v2/cryptocurrency/quotes/latest`,
    );
    add(
      'getQuotesHistoricalV2',
      HttpMethod.GET,
      `/v2/cryptocurrency/quotes/historical`,
    );
    add(
      'getQuotesHistoricalV3',
      HttpMethod.GET,
      `/v3/cryptocurrency/quotes/historical`,
    );
    add(
      'getMarketPairsLatestV2',
      HttpMethod.GET,
      `/v2/cryptocurrency/market-pairs/latest`,
    );
    add('getOhlcvLatestV2', HttpMethod.GET, `/v2/cryptocurrency/ohlcv/latest`);
    add(
      'getOhlcvHistoricalV2',
      HttpMethod.GET,
      `/v2/cryptocurrency/ohlcv/historical`,
    );
    add(
      'getPricePerformanceStatsLatestV2',
      HttpMethod.GET,
      `/v2/cryptocurrency/price-performance-stats/latest`,
    );

    // --- Exchange ----------------------------------------------------------
    const exchangeBase = `/${vExchange}${getCmcCategoryPath(CmcCategory.EXCHANGE)}`;
    add('getExchangeMap', HttpMethod.GET, `${exchangeBase}/map`);
    add('getExchangeInfo', HttpMethod.GET, `${exchangeBase}/info`);
    add(
      'getExchangeListingsLatest',
      HttpMethod.GET,
      `${exchangeBase}/listings/latest`,
    );
    add(
      'getExchangeQuotesLatest',
      HttpMethod.GET,
      `${exchangeBase}/quotes/latest`,
    );
    add(
      'getExchangeQuotesHistorical',
      HttpMethod.GET,
      `${exchangeBase}/quotes/historical`,
    );
    add(
      'getExchangeMarketPairsLatest',
      HttpMethod.GET,
      `${exchangeBase}/market-pairs/latest`,
    );
    add('getExchangeAssets', HttpMethod.GET, `${exchangeBase}/assets`);

    // --- Global Metrics ----------------------------------------------------
    const globalBase = `/${vGlobal}${getCmcCategoryPath(CmcCategory.GLOBAL_METRICS)}`;
    add('getGlobalMetrics', HttpMethod.GET, `${globalBase}/quotes/latest`);
    add(
      'getGlobalMetricsHistorical',
      HttpMethod.GET,
      `${globalBase}/quotes/historical`,
    );

    // --- Tools -------------------------------------------------------------
    const toolsBase = `/${vTools}${getCmcCategoryPath(CmcCategory.TOOLS)}`;
    add('priceConversion', HttpMethod.GET, `${toolsBase}/price-conversion`);
    add('postman', HttpMethod.GET, `${toolsBase}/postman`);
    add('priceConversionV1', HttpMethod.GET, `/v1/tools/price-conversion`);
    add('priceConversionV2', HttpMethod.GET, `/v2/tools/price-conversion`);

    // --- Blockchain --------------------------------------------------------
    const blockchainBase = `/${vBlockchain}${getCmcCategoryPath(CmcCategory.BLOCKCHAIN)}`;
    add(
      'getBlockchainStatisticsLatest',
      HttpMethod.GET,
      `${blockchainBase}/statistics/latest`,
    );

    // --- Fiat --------------------------------------------------------------
    const fiatBase = `/${vFiat}${getCmcCategoryPath(CmcCategory.FIAT)}`;
    add('getFiatMap', HttpMethod.GET, `${fiatBase}/map`);

    // --- Key Info ----------------------------------------------------------
    const keyBase = `/${vKey}${getCmcCategoryPath(CmcCategory.KEY)}`;
    add('getKeyInfo', HttpMethod.GET, `${keyBase}/info`);

    // --- Fear & Greed (v3 explicit) ---------------------------------------
    add('getFearAndGreedLatest', HttpMethod.GET, `/v3/fear-and-greed/latest`);
    add(
      'getFearAndGreedHistorical',
      HttpMethod.GET,
      `/v3/fear-and-greed/historical`,
    );

    // --- Indexes (v3 explicit) --------------------------------------------
    add('getIndexCmc20Latest', HttpMethod.GET, `/v3/index/cmc20-latest`);
    add(
      'getIndexCmc20Historical',
      HttpMethod.GET,
      `/v3/index/cmc20-historical`,
    );
    add('getIndexCmc100Latest', HttpMethod.GET, `/v3/index/cmc100-latest`);
    add(
      'getIndexCmc100Historical',
      HttpMethod.GET,
      `/v3/index/cmc100-historical`,
    );
  }
}
