import { CmcCategoryInfo } from './types/cmc-base.type';
import { CMC_PRO_BASE_URL, CMC_SANDBOX_BASE_URL } from './types/cmc-const.type';
import { CmcEnvironmenType, CmcCategory } from './types/cmc-enum.type';

/**
 * Resolve the base URL for CoinMarketCap API given the environment type.
 * Uses CMC_BASE_URL override if present.
 */

export function getCmcBaseUrl(envType: CmcEnvironmenType): string {
  const fromEnv = process.env.CMC_BASE_URL?.trim();
  if (fromEnv) return fromEnv;

  switch (envType) {
    case CmcEnvironmenType.SANDBOX:
      return CMC_SANDBOX_BASE_URL;
    case CmcEnvironmenType.PRODUCTION:
    default:
      return CMC_PRO_BASE_URL;
  }
}

/**
 * Default versions for each API category.
 */
const DEFAULT_VERSIONS: Record<CmcCategory, string> = {
  [CmcCategory.CRYPTOCURRENCY]: 'v2',
  [CmcCategory.EXCHANGE]: 'v1',
  [CmcCategory.GLOBAL_METRICS]: 'v1',
  [CmcCategory.TOOLS]: 'v2',
  [CmcCategory.BLOCKCHAIN]: 'v1',
  [CmcCategory.FIAT]: 'v1',
  [CmcCategory.PARTNERS]: 'v1',
  [CmcCategory.KEY]: 'v1',
  [CmcCategory.CONTENT]: 'v1',
};

/**
 * Env var names for overriding section versions.
 */
const ENV_VAR_MAP: Record<CmcCategory, string> = {
  [CmcCategory.CRYPTOCURRENCY]: 'CMC_VER_CRYPTOCURRENCY',
  [CmcCategory.EXCHANGE]: 'CMC_VER_EXCHANGE',
  [CmcCategory.GLOBAL_METRICS]: 'CMC_VER_GLOBAL_METRICS',
  [CmcCategory.TOOLS]: 'CMC_VER_TOOLS',
  [CmcCategory.BLOCKCHAIN]: 'CMC_VER_BLOCKCHAIN',
  [CmcCategory.FIAT]: 'CMC_VER_FIAT',
  [CmcCategory.PARTNERS]: 'CMC_VER_PARTNERS',
  [CmcCategory.KEY]: 'CMC_VER_KEY',
  [CmcCategory.CONTENT]: 'CMC_VER_CONTENT',
};

/**
 * Resolve version string for a given API category.
 * Priority: explicit env var -> default version.
 */
export function getCmcSectionVersion(
  section: CmcCategory,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _envType: CmcEnvironmenType,
): string {
  const envVar = ENV_VAR_MAP[section];
  const override = process.env[envVar as keyof NodeJS.ProcessEnv];
  if (override && override.trim().length > 0) return override.trim();

  return DEFAULT_VERSIONS[section];
}

const CATEGORY_INFO_MAP: Record<CmcCategory, CmcCategoryInfo> = {
  [CmcCategory.CRYPTOCURRENCY]: new CmcCategoryInfo(
    '/cryptocurrency',
    'Endpoints that return data around cryptocurrencies such as ordered cryptocurrency lists or price and volume data.',
  ),
  [CmcCategory.EXCHANGE]: new CmcCategoryInfo(
    '/exchange',
    'Endpoints that return data around cryptocurrency exchanges such as ordered exchange lists and market pair data.',
  ),
  [CmcCategory.GLOBAL_METRICS]: new CmcCategoryInfo(
    '/global-metrics',
    'Endpoints that return aggregate market data such as global market cap and BTC dominance.',
  ),
  [CmcCategory.TOOLS]: new CmcCategoryInfo(
    '/tools',
    'Useful utilities such as cryptocurrency and fiat price conversions.',
  ),
  [CmcCategory.BLOCKCHAIN]: new CmcCategoryInfo(
    '/blockchain',
    'Endpoints that return block explorer related data for blockchains.',
  ),
  [CmcCategory.FIAT]: new CmcCategoryInfo(
    '/fiat',
    'Endpoints that return data around fiat currencies including mapping to CMC IDs.',
  ),
  [CmcCategory.PARTNERS]: new CmcCategoryInfo(
    '/partners',
    'Endpoints for convenient access to 3rd party crypto data.',
  ),
  [CmcCategory.KEY]: new CmcCategoryInfo(
    '/key',
    'API key administration endpoints to review and manage your usage.',
  ),
  [CmcCategory.CONTENT]: new CmcCategoryInfo(
    '/content',
    'Endpoints that return cryptocurrency-related news, headlines, articles, posts, and comments.',
  ),
};

/** Get the base path string for a category */
export function getCmcCategoryPath(category: CmcCategory): string {
  return CATEGORY_INFO_MAP[category].path;
}

/** Get the full info object for a category */
export function getCmcCategoryInfo(category: CmcCategory): CmcCategoryInfo {
  return CATEGORY_INFO_MAP[category];
}
