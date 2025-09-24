import { ApiGatewayConfig } from 'src/common/api-gateway/api-gateway-config';
import { HttpMethod } from 'src/common/api-gateway/types/api-gateway.enum';
import {
  getCmcSectionVersion,
  getCmcCategoryPath,
  getCmcBaseUrl,
} from '../cmc.helper';
import { CmcCategory } from '../types/cmc-enum.type';
import { CMC_ENV_TYPE } from '../types/cmc-const.type';

/**
 * CoinMarketCap Pro API endpoints (spot only).
 * Docs: https://coinmarketcap.com/api/documentation/v1/
 *
 * Notes:
 * - Pass header: 'X-CMC_PRO_API_KEY': <apiKey>
 * - We derive base URL and section versions from envType + env overrides.
 */
export class CmcApiConfig extends ApiGatewayConfig {
  constructor() {
    const defaultBaseUrl = getCmcBaseUrl(CMC_ENV_TYPE);

    super(defaultBaseUrl, {
      // API key header can be set later via update()
      Accept: 'application/json',
    });
    this.name = 'CMC';

    // Resolve versions per section using default env type constant
    const envType = CMC_ENV_TYPE;

    // Resolve versions per section (with env overrides)
    const vCrypto = getCmcSectionVersion(CmcCategory.CRYPTOCURRENCY, envType);
    const vGlobal = getCmcSectionVersion(CmcCategory.GLOBAL_METRICS, envType);
    const vExchange = getCmcSectionVersion(CmcCategory.EXCHANGE, envType);
    const vTools = getCmcSectionVersion(CmcCategory.TOOLS, envType);
    const vBlockchain = getCmcSectionVersion(CmcCategory.BLOCKCHAIN, envType);
    const vFiat = getCmcSectionVersion(CmcCategory.FIAT, envType);
    const vKey = getCmcSectionVersion(CmcCategory.KEY, envType);

    // --- Cryptocurrency ----------------------------------------------------
    const cryptoBase = `/${vCrypto}${getCmcCategoryPath(CmcCategory.CRYPTOCURRENCY)}`;

    this.addEndpoint('getCryptoMap', HttpMethod.GET, `${cryptoBase}/map`);
    this.addEndpoint('getCryptoInfo', HttpMethod.GET, `${cryptoBase}/info`);

    this.addEndpoint(
      'getCryptoListingsLatest',
      HttpMethod.GET,
      `${cryptoBase}/listings/latest`,
    );
    this.addEndpoint(
      'getCryptoListingsHistorical',
      HttpMethod.GET,
      `${cryptoBase}/listings/historical`,
    );

    this.addEndpoint(
      'getQuotesLatest',
      HttpMethod.GET,
      `${cryptoBase}/quotes/latest`,
    );
    this.addEndpoint(
      'getQuotesHistorical',
      HttpMethod.GET,
      `${cryptoBase}/quotes/historical`,
    );

    this.addEndpoint(
      'getMarketPairsLatest',
      HttpMethod.GET,
      `${cryptoBase}/market-pairs/latest`,
    );

    this.addEndpoint(
      'getOhlcvLatest',
      HttpMethod.GET,
      `${cryptoBase}/ohlcv/latest`,
    );
    this.addEndpoint(
      'getOhlcvHistorical',
      HttpMethod.GET,
      `${cryptoBase}/ohlcv/historical`,
    );

    this.addEndpoint(
      'getPricePerformanceStatsLatest',
      HttpMethod.GET,
      `${cryptoBase}/price-performance-stats/latest`,
    );

    this.addEndpoint(
      'getCategories',
      HttpMethod.GET,
      `${cryptoBase}/categories`,
    );

    this.addEndpoint('getCategory', HttpMethod.GET, `${cryptoBase}/category`);
    this.addEndpoint('getAirdrops', HttpMethod.GET, `${cryptoBase}/airdrops`);
    this.addEndpoint('getAirdrop', HttpMethod.GET, `${cryptoBase}/airdrop`);

    this.addEndpoint(
      'getTrendingLatest',
      HttpMethod.GET,
      `${cryptoBase}/trending/latest`,
    );
    this.addEndpoint(
      'getTrendingMostVisited',
      HttpMethod.GET,
      `${cryptoBase}/trending/most-visited`,
    );
    this.addEndpoint(
      'getTrendingGainersLosers',
      HttpMethod.GET,
      `${cryptoBase}/trending/gainers-losers`,
    );

    // --- Exchange ----------------------------------------------------------
    const exchangeBase = `/${vExchange}${getCmcCategoryPath(CmcCategory.EXCHANGE)}`;

    this.addEndpoint('getExchangeMap', HttpMethod.GET, `${exchangeBase}/map`);
    this.addEndpoint('getExchangeInfo', HttpMethod.GET, `${exchangeBase}/info`);
    this.addEndpoint(
      'getExchangeListingsLatest',
      HttpMethod.GET,
      `${exchangeBase}/listings/latest`,
    );
    this.addEndpoint(
      'getExchangeQuotesLatest',
      HttpMethod.GET,
      `${exchangeBase}/quotes/latest`,
    );
    this.addEndpoint(
      'getExchangeQuotesHistorical',
      HttpMethod.GET,
      `${exchangeBase}/quotes/historical`,
    );
    this.addEndpoint(
      'getExchangeMarketPairsLatest',
      HttpMethod.GET,
      `${exchangeBase}/market-pairs/latest`,
    );
    this.addEndpoint(
      'getExchangeAssets',
      HttpMethod.GET,
      `${exchangeBase}/assets`,
    );

    // --- Global Metrics ----------------------------------------------------
    const globalBase = `/${vGlobal}${getCmcCategoryPath(CmcCategory.GLOBAL_METRICS)}`;

    this.addEndpoint(
      'getGlobalMetrics',
      HttpMethod.GET,
      `${globalBase}/quotes/latest`,
    );
    this.addEndpoint(
      'getGlobalMetricsHistorical',
      HttpMethod.GET,
      `${globalBase}/quotes/historical`,
    );

    // --- Tools -------------------------------------------------------------
    const toolsBase = `/${vTools}${getCmcCategoryPath(CmcCategory.TOOLS)}`;

    this.addEndpoint(
      'priceConversion',
      HttpMethod.GET,
      `${toolsBase}/price-conversion`,
    );
    this.addEndpoint('postman', HttpMethod.GET, `${toolsBase}/postman`);

    // --- Blockchain --------------------------------------------------------
    const blockchainBase = `/${vBlockchain}${getCmcCategoryPath(CmcCategory.BLOCKCHAIN)}`;

    this.addEndpoint(
      'getBlockchainStatisticsLatest',
      HttpMethod.GET,
      `${blockchainBase}/statistics/latest`,
    );

    // --- Fiat --------------------------------------------------------------
    const fiatBase = `/${vFiat}${getCmcCategoryPath(CmcCategory.FIAT)}`;

    this.addEndpoint('getFiatMap', HttpMethod.GET, `${fiatBase}/map`);

    // --- Key Info ---------------------------------------------------------
    const keyBase = `/${vKey}${getCmcCategoryPath(CmcCategory.KEY)}`;
    this.addEndpoint('getKeyInfo', HttpMethod.GET, `${keyBase}/info`);
  }
}
