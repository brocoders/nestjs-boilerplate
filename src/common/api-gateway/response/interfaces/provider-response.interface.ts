/**
 * The app's standard HTTP envelope.
 * All providers should end up normalized to this shape.
 */
export interface AppEnvelope<T = any> {
  statusCode: number; // HttpStatus code
  success: boolean;
  message?: string | null;
  error?: { code?: string | number; details?: unknown } | null;
  data?: T | null;
  hasNextPage?: boolean;
}

/**
 * Optional context passed by the interceptor to adapters.
 * Useful for pagination params, route URL, etc.
 */
export interface AdapterContext {
  query?: unknown;
  url?: string;
  provider?: string;
}

/**
 * Contract every provider-specific adapter must implement.
 * Each adapter converts its provider's raw success/error into AppEnvelope.
 */
export interface ProviderResponseAdapter<TRaw = unknown, TOut = unknown> {
  /** Unique provider key (e.g., 'CMC', 'BINANCE', 'GORUSH', ...) */
  readonly provider: string;

  /** Map a successful raw provider response to the app envelope. */
  toSuccess(raw: TRaw, ctx?: AdapterContext): AppEnvelope<TOut>;

  /** Map an error (HTTP/SDK/provider) to the app envelope (success=false). */
  toError(err: unknown, ctx?: AdapterContext): AppEnvelope<null>;
}
