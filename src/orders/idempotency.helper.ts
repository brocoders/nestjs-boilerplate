import { Injectable } from '@nestjs/common';
import { RedisService } from '../redis/redis.service';

const IN_PROGRESS_MARKER = '__in_progress__';
const TTL_SECONDS = 24 * 60 * 60; // 24h

export type IdempotencyLookup<T> = T | null | 'IN_PROGRESS';

@Injectable()
export class IdempotencyHelper {
  constructor(private readonly redis: RedisService) {}

  static readonly KEY_PATTERN = /^[A-Za-z0-9_-]{16,128}$/;

  static isValidKey(key: string): boolean {
    return IdempotencyHelper.KEY_PATTERN.test(key);
  }

  /**
   * Look up a previous result for (scope, userId, key).
   * Returns:
   *   - the parsed JSON value when a final result is cached
   *   - 'IN_PROGRESS' when an in-flight marker is present
   *   - null when no record exists
   */
  async get<T>(
    scope: string,
    userId: number,
    key: string,
  ): Promise<IdempotencyLookup<T>> {
    const fullKey = this.fullKey(scope, userId, key);
    const value = await this.redis.raw().get(fullKey);
    if (value === null) return null;
    if (value === IN_PROGRESS_MARKER) return 'IN_PROGRESS';
    try {
      return JSON.parse(value) as T;
    } catch {
      // Defensive: if a non-JSON value somehow leaked into the slot, treat
      // it as no record so the caller proceeds.
      return null;
    }
  }

  /**
   * Atomically claim the slot with NX. Returns true if we claimed it,
   * false if another concurrent request beat us.
   */
  async setInProgress(
    scope: string,
    userId: number,
    key: string,
  ): Promise<boolean> {
    const fullKey = this.fullKey(scope, userId, key);
    const result = await this.redis
      .raw()
      .set(fullKey, IN_PROGRESS_MARKER, 'EX', TTL_SECONDS, 'NX');
    return result === 'OK';
  }

  /** Persist a final result, overwriting whatever was there. */
  async setResult<T>(
    scope: string,
    userId: number,
    key: string,
    value: T,
  ): Promise<void> {
    const fullKey = this.fullKey(scope, userId, key);
    await this.redis
      .raw()
      .set(fullKey, JSON.stringify(value), 'EX', TTL_SECONDS);
  }

  /** Drop the slot — used on errors so the buyer can retry with the same key. */
  async clear(scope: string, userId: number, key: string): Promise<void> {
    const fullKey = this.fullKey(scope, userId, key);
    await this.redis.raw().del(fullKey);
  }

  private fullKey(scope: string, userId: number, key: string): string {
    return `idem:${scope}:${userId}:${key}`;
  }
}
