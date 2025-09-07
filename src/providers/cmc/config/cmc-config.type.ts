export type CmcConfig = {
  /** Whether CMC integration is enabled */
  enable: boolean;

  /** API key for authenticating with CMC Pro API */
  apiKey: string;

  /** Base URL for the CMC Pro API */
  baseUrl: string;

  /** Time-to-live for cached responses in milliseconds */
  ttlMs: number;

  /** Request timeout in milliseconds */
  requestTimeoutMs: number;

  /** Number of retries for failed requests */
  maxRetries: number;

  /** Default fiat currency for quotes (e.g., "USD") */
  defaultFiatCurrency: string;

  /** Default symbols for spot markets (comma-separated, e.g., "BTC,ETH,USDT") */
  defaultSymbols: string;
};
