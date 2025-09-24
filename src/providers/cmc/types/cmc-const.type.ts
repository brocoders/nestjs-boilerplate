import { CmcEnvironmenType } from './cmc-enum.type';

export const CMC_ENABLE = false;

export const CMC_TTL_MS = 60_000; // 1 min default cache TTL

export const CMC_REQUEST_TIMEOUT_MS = 10_000; // 10s default timeout

export const CMC_MAX_RETRIES = 3;

export const CMC_DEFAULT_FIAT_CURRENCY = 'USD';

export const CMC_DEFAULT_SYMBOLS = 'BTC,ETH,USDT';

export const CMC_PRO_BASE_URL = 'https://pro-api.coinmarketcap.com';

export const CMC_SANDBOX_BASE_URL = 'https://sandbox-api.coinmarketcap.com';

export const CMC_ENV_TYPE = CmcEnvironmenType.SANDBOX;
