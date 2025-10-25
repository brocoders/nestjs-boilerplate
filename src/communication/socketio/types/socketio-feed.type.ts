// -----------------------------
// Standardized, Provider-Agnostic Feed DTOs
// -----------------------------

export type UnixMs = number;

export interface FeedTradeDto {
  provider: string; // e.g., "binance", "kucoin", "cmc", "my-news"
  symbol: string; // normalized identifier (child defines how)
  event: 'trade';
  tradeId?: string | number;
  price: string; // strings to avoid FP precision issues
  quantity: string;
  maker?: boolean;
  ts: UnixMs; // provider/event timestamp in ms
}

export interface FeedTickerDto {
  provider: string;
  symbol: string;
  event: 'ticker';
  lastPrice: string;
  priceChange?: string;
  priceChangePercent?: string;
  high?: string;
  low?: string;
  volume?: string;
  ts: UnixMs;
}

export interface FeedOrderBookLevel {
  price: string;
  qty: string;
}

export interface FeedBookUpdateDto {
  provider: string;
  symbol: string;
  event: 'book';
  bids: FeedOrderBookLevel[];
  asks: FeedOrderBookLevel[];
  fullSnapshot?: boolean;
  ts: UnixMs;
}

// Union of standardized outbound feed messages
export type FeedOutboundDto = FeedTradeDto | FeedTickerDto | FeedBookUpdateDto;

// Backward-compatible aliases
export type MarketTradeDto = FeedTradeDto;
export type MarketTickerDto = FeedTickerDto;
export type MarketOrderBookLevel = FeedOrderBookLevel;
export type MarketBookUpdateDto = FeedBookUpdateDto;
export type MarketOutboundDto = FeedOutboundDto;

// -----------------------------
// Options
// -----------------------------

export interface FeedOptions {
  reconnectBaseDelayMs?: number; // Base delay for reconnect backoff (ms)
  reconnectMaxDelayMs?: number; // Maximum reconnect delay (ms)
  maxReconnectAttempts?: number; // Optional retry limit
  verboseLifecycleLogs?: boolean; // Emit lifecycle logs to admins
  channelDomain?: string; // Event domain segment (e.g. "market", "news")
}
