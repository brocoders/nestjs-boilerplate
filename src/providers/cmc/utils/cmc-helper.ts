import { CmcQuoteEntryDto } from '../dto/cmc-base.response.dto';

export type CmcKeyedMap<T> = Record<string, T>;

/** Quote map like { USD: QuoteEntry, EUR: QuoteEntry } */
export type CmcQuoteMap<T = CmcQuoteEntryDto> = Record<string, T>;

export function unwrapData<T = any>(raw: any): T {
  // If gateway wrapped it as { statusCode, data }, return the inner "data"
  if (raw && typeof raw === 'object' && 'data' in raw && 'statusCode' in raw) {
    return (raw.data as T) ?? (raw as T);
  }
  return raw as T;
}
