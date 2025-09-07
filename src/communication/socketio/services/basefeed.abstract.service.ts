// src/communication/socketio/services/basefeed.abstract.service.ts

import { Injectable } from '@nestjs/common';
import { LoggerService } from '../../../common/logger/logger.service';
import { SocketServerProvider } from '../utils/socketio.provider';
import { CHANNELS } from '../types/socketio-enum.type';
import {
  FeedOptions,
  FeedOutboundDto,
  FeedTradeDto,
  FeedTickerDto,
  FeedBookUpdateDto,
} from '../types/socketio-feed.type';

// -----------------------------
// Base Abstract Service
// -----------------------------

@Injectable()
export abstract class BaseExternalFeedService {
  // Child MUST define a short, stable provider ID (e.g. "binance", "kucoin", "newsapi")
  protected abstract get providerId(): string;

  // Child MUST normalize external symbols/identifiers to a consistent form
  protected abstract normalizeSymbol(symbol: string): string;

  // Connection management (child must implement)
  protected abstract connect(): Promise<void>;
  protected abstract disconnect(): Promise<void>;
  protected abstract subscribe(symbol: string): Promise<void>;
  protected abstract unsubscribe(symbol: string): Promise<void>;

  // State
  protected running = false;
  protected reconnectAttempt = 0;

  // Options with defaults
  protected opts: Required<Omit<FeedOptions, 'maxReconnectAttempts'>> & {
    maxReconnectAttempts?: number;
  } = {
    reconnectBaseDelayMs: 1000,
    reconnectMaxDelayMs: 30000,
    maxReconnectAttempts: undefined,
    verboseLifecycleLogs: true,
    channelDomain: 'market',
  };

  constructor(
    protected readonly logger: LoggerService,
    protected readonly socketProvider: SocketServerProvider,
    options?: FeedOptions,
  ) {
    if (options) this.opts = { ...this.opts, ...options };
  }

  // Naming helpers
  protected eventName(suffix: string): string {
    return `${this.providerId}:${this.opts.channelDomain}:${suffix}`;
  }

  protected symbolRoom(symbol: string): string {
    const norm = this.normalizeSymbol(symbol);
    return `${this.opts.channelDomain}:symbol:${norm}`;
  }

  // Lifecycle methods
  public async start(): Promise<void> {
    if (this.running) return;
    this.running = true;
    this.reconnectAttempt = 0;
    await this.tryConnectWithBackoff();
  }

  public async stop(): Promise<void> {
    if (!this.running) return;
    this.running = false;
    try {
      await this.disconnect();
      this.logInfo('Disconnected');
      this.emitAdminInfo({ event: 'feed:stopped', provider: this.providerId });
    } catch (err) {
      this.logError(err instanceof Error ? err : new Error(String(err)));
    }
  }

  protected async onFatal(reason: string | Error) {
    if (!this.running) return;
    this.logWarn(
      `Fatal feed error — scheduling reconnect: ${this.errMsg(reason)}`,
    );
    await this.safeReconnect();
  }

  public async addSymbol(symbol: string) {
    const norm = this.normalizeSymbol(symbol);
    await this.subscribe(norm);
    this.logInfo(`Subscribed ${norm}`);
  }

  public async removeSymbol(symbol: string) {
    const norm = this.normalizeSymbol(symbol);
    await this.unsubscribe(norm);
    this.logInfo(`Unsubscribed ${norm}`);
  }

  // Emit helpers
  protected emitOutbound(payload: FeedOutboundDto) {
    const server =
      this.socketProvider.getServer?.() ?? this.socketProvider.server;
    const room = this.symbolRoom(payload.symbol);
    const event = this.eventName(payload.event);

    try {
      server.to(room).emit(event, payload);
    } catch (e) {
      this.logError(
        new Error(`Emit to room failed (${room}): ${this.errMsg(e)}`),
      );
    }

    try {
      server.emit(event, payload);
    } catch (e) {
      this.logError(
        new Error(`Broadcast emit failed (${event}): ${this.errMsg(e)}`),
      );
    }
  }

  protected emitTrade(p: Omit<FeedTradeDto, 'provider' | 'event'>) {
    this.emitOutbound({ ...p, provider: this.providerId, event: 'trade' });
  }

  protected emitTicker(p: Omit<FeedTickerDto, 'provider' | 'event'>) {
    this.emitOutbound({ ...p, provider: this.providerId, event: 'ticker' });
  }

  protected emitBook(p: Omit<FeedBookUpdateDto, 'provider' | 'event'>) {
    this.emitOutbound({ ...p, provider: this.providerId, event: 'book' });
  }

  // Logging
  protected logInfo(msg: string) {
    this.logger.log(
      `[${this.providerId.toUpperCase()}] ${msg}`,
      this.constructor.name,
    );
    this.emitAdminInfo({ msg });
  }

  protected logWarn(msg: string) {
    this.logger.warn(
      `[${this.providerId.toUpperCase()}] ${msg}`,
      this.constructor.name,
    );
    this.emitAdminWarn({ msg });
  }

  protected logError(err: Error) {
    this.logger.error(
      `[${this.providerId.toUpperCase()}] ${err.message}`,
      err.stack,
      this.constructor.name,
    );
    this.emitAdminError({ error: err.message });
  }

  protected emitAdminInfo(payload: Record<string, unknown>) {
    const server =
      this.socketProvider.getServer?.() ?? this.socketProvider.server;
    try {
      server.to('role:admin').emit(CHANNELS.LOG_INFO, {
        provider: this.providerId,
        ...payload,
      });
    } catch {}
  }

  protected emitAdminWarn(payload: Record<string, unknown>) {
    const server =
      this.socketProvider.getServer?.() ?? this.socketProvider.server;
    try {
      server.to('role:admin').emit(CHANNELS.LOG_WARN, {
        provider: this.providerId,
        ...payload,
      });
    } catch {}
  }

  protected emitAdminError(payload: Record<string, unknown>) {
    const server =
      this.socketProvider.getServer?.() ?? this.socketProvider.server;
    try {
      server.to('role:admin').emit(CHANNELS.LOG_ERROR, {
        provider: this.providerId,
        ...payload,
      });
    } catch {}
  }

  // Reconnect helpers
  protected async tryConnectWithBackoff() {
    if (!this.running) return;

    try {
      if (this.opts.verboseLifecycleLogs) this.logInfo('Connecting…');
      await this.connect();
      this.reconnectAttempt = 0;
      if (this.opts.verboseLifecycleLogs) this.logInfo('Connected');
      this.emitAdminInfo({
        event: 'feed:connected',
        provider: this.providerId,
      });
    } catch (err) {
      this.logWarn(`Initial connect failed: ${this.errMsg(err)}`);
      await this.safeReconnect();
    }
  }

  protected async safeReconnect() {
    if (!this.running) return;

    if (
      typeof this.opts.maxReconnectAttempts === 'number' &&
      this.reconnectAttempt >= this.opts.maxReconnectAttempts
    ) {
      this.logError(
        new Error(
          `Max reconnect attempts reached (${this.opts.maxReconnectAttempts}). Giving up.`,
        ),
      );
      this.emitAdminError({
        event: 'feed:reconnect:exhausted',
        attempts: this.reconnectAttempt,
      });
      return;
    }

    const delay = this.computeBackoffDelay(this.reconnectAttempt++);
    this.emitAdminWarn({
      event: 'feed:reconnect',
      attempt: this.reconnectAttempt,
      delay,
    });

    await this.sleep(delay);
    if (!this.running) return;

    try {
      if (this.opts.verboseLifecycleLogs) {
        this.logInfo(`Reconnecting (attempt #${this.reconnectAttempt})…`);
      }
      await this.disconnect().catch(() => void 0);
      await this.connect();
      this.reconnectAttempt = 0;
      this.emitAdminInfo({ event: 'feed:reconnected' });
      if (this.opts.verboseLifecycleLogs) this.logInfo('Reconnected');
    } catch (e) {
      this.logWarn(`Reconnect attempt failed: ${this.errMsg(e)}`);
      await this.safeReconnect();
    }
  }

  protected computeBackoffDelay(attempt: number): number {
    const { reconnectBaseDelayMs, reconnectMaxDelayMs } = this.opts;
    const exp = reconnectBaseDelayMs * Math.pow(2, attempt);
    const jitter = Math.random() * reconnectBaseDelayMs;
    return Math.min(exp + jitter, reconnectMaxDelayMs);
  }

  // Utilities
  protected sleep(ms: number) {
    return new Promise((r) => setTimeout(r, Math.max(0, ms)));
  }

  protected errMsg(e: unknown): string {
    return e instanceof Error ? e.message : String(e);
  }

  // Backward compatibility for exchangeId naming
  protected get exchangeId(): string {
    return this.providerId;
  }
}
