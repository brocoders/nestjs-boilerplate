import { CmcEnvironmenType } from '../types/cmc-enum.type';

export interface CmcConfig {
  /** Whether CMC integration is enabled */
  enable: boolean;

  /** API key for authenticating with CMC Pro API */
  apiKey: string;

  /** Environment type for CMC (e.g., prod, sandbox, dev) */
  envType: CmcEnvironmenType;

  /** Time-to-live for cached responses in milliseconds */
  ttlMs: number;

  /** Request timeout in milliseconds */
  requestTimeoutMs: number;

  /** Number of retries for failed requests */
  maxRetries: number;

  /** Default fiat currency for quotes (e.g., "USD") */
  defaultFiatCurrency: string;

  /** Default symbols for spot markets (comma-separated string, e.g., "BTC,ETH,USDT") */
  defaultSymbols: string;
}
