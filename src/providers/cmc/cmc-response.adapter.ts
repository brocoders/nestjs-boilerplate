//BUGFIX: Response adapter was not handling non-200 CMC error codes correctly

import { TypeMessage } from '../../utils/types/message.type';
import { Injectable, HttpStatus } from '@nestjs/common';
import {
  ProviderResponseAdapter,
  AppEnvelope,
  AdapterContext,
} from '../../common/api-gateway/response/interfaces/provider-response.interface';
import { CmcEnvelope, CmcStatus } from './types/cmc-base.type';
import { ProviderErrorResponse } from '../../common/api-gateway/types/api-gateway.type';

/**
 * CMC Response Adapter
 * -------------------------------------------------------------
 * Maps the standard CMC envelope:
 * {
 *   data: ...,
 *   status: {
 *     timestamp, error_code, error_message, elapsed, credit_count, notice
 *   }
 * }
 * into the app-wide envelope:
 * { status, success, message, error, data, hasNextPage }
 */
@Injectable()
export class CmcResponseAdapter
  implements ProviderResponseAdapter<CmcEnvelope, any>
{
  readonly provider = 'CMC';

  private toHttpStatus(code: number): number {
    // Map well-known CMC error codes to HTTP statuses
    // 0 (success) handled earlier
    switch (code) {
      case 400:
        return HttpStatus.BAD_REQUEST;
      case 401:
        return HttpStatus.UNAUTHORIZED;
      case 403:
        return HttpStatus.FORBIDDEN;
      case 404:
        return HttpStatus.NOT_FOUND;
      case 409:
        return HttpStatus.CONFLICT;
      case 422:
        return HttpStatus.UNPROCESSABLE_ENTITY;
      case 429:
        return HttpStatus.TOO_MANY_REQUESTS;
      case 500:
        return HttpStatus.BAD_GATEWAY; // provider internal error → treat as upstream failure
      // CMC custom codes commonly seen in docs:
      case 1002:
        return HttpStatus.UNAUTHORIZED; // API key missing
      case 1006:
        return HttpStatus.FORBIDDEN; // plan doesn't support endpoint
      case 1007:
        return HttpStatus.FORBIDDEN; // plan rate limit reached (variant)
      case 1008:
        return HttpStatus.TOO_MANY_REQUESTS; // HTTP request rate limit
      default:
        return HttpStatus.BAD_GATEWAY; // unknown provider failure
    }
  }

  private extractHasNextPage(data: any): boolean | undefined {
    // Adjust if you detect CMC pagination in your responses
    // Some endpoints may return paging info in data or status.notice (rare)
    if (data && typeof data === 'object') {
      if ('has_next' in data && typeof (data as any).has_next === 'boolean') {
        return (data as any).has_next;
      }
      if (
        'hasNextPage' in data &&
        typeof (data as any).hasNextPage === 'boolean'
      ) {
        return (data as any).hasNextPage;
      }
      // Some endpoints could embed meta: { next_cursor: string | null }
      if ('meta' in data && data.meta && typeof data.meta === 'object') {
        const next = (data.meta as any).next_cursor ?? (data.meta as any).next;
        if (typeof next === 'string') return next.length > 0;
        if (typeof next === 'boolean') return next;
      }
    }
    return undefined;
  }

  private extractRateLimit(
    e: any,
  ): { perMinute?: number; remaining?: number; resetAt?: string } | undefined {
    const h = e?.response?.headers;
    if (!h || typeof h !== 'object') return undefined;

    const getNum = (v: any) => {
      const n = Number(v);
      return Number.isFinite(n) ? n : undefined;
    };

    // Common CMC headers (case-insensitive)
    const perMinute =
      getNum(h['x-ratelimit-limit-minute']) ??
      getNum(h['x-rate-limit-minute']) ??
      getNum(h['x-ratelimit-minute']);

    const remaining =
      getNum(h['x-ratelimit-remaining-minute']) ??
      getNum(h['x-rate-limit-remaining-minute']) ??
      getNum(h['x-ratelimit-remaining']);

    // Reset can be a unix ts or ISO string depending on proxy/CDN
    const resetHeader =
      h['x-ratelimit-reset'] ??
      h['x-rate-limit-reset'] ??
      h['ratelimit-reset'] ??
      undefined;

    let resetAt: string | undefined = undefined;
    if (typeof resetHeader === 'string' || typeof resetHeader === 'number') {
      const ts = Number(resetHeader);
      if (Number.isFinite(ts) && ts > 0) {
        // seconds or ms — normalize to ms if it looks like seconds
        const ms = ts < 10_000_000_000 ? ts * 1000 : ts;
        resetAt = new Date(ms).toISOString();
      } else {
        const d = new Date(resetHeader);
        if (!Number.isNaN(d.getTime())) resetAt = d.toISOString();
      }
    }

    if (perMinute ?? remaining ?? resetAt) {
      return { perMinute, remaining, resetAt };
    }
    return undefined;
  }

  toSuccess(raw: CmcEnvelope, ctx?: AdapterContext): AppEnvelope {
    // Defensive: if CMC sent a non-zero error_code, route through error handler
    const s = raw?.status as CmcStatus;
    const isOk = s && (s.error_code === 0 || !s.error_code);
    if (!isOk) {
      return this.toError(
        {
          response: {
            status: this.toHttpStatus(s?.error_code ?? 502),
            data: raw,
          },
        },
        ctx,
      );
    }

    const hasNext = this.extractHasNextPage(raw?.data);

    const code =
      s?.error_code === 0 || !s?.error_code
        ? HttpStatus.OK
        : raw?.status?.error_code >= 200 && raw?.status?.error_code < 300
          ? raw?.status?.error_code
          : HttpStatus.OK;

    return {
      statusCode: code,
      success: true,
      message: TypeMessage.getMessageByStatus(code),
      error: null,
      data: raw?.data ?? null,
      hasNextPage: hasNext,
    };
  }

  toError(e: any, ctx?: AdapterContext): AppEnvelope<null> {
    // Prefer provider envelope if present
    const providerEnvelope: CmcEnvelope | undefined = e?.response?.data;
    const s: CmcStatus | undefined = providerEnvelope?.status;

    const providerCode =
      (typeof s?.error_code === 'number' ? s?.error_code : undefined) ??
      (typeof e?.code === 'number' ? e.code : undefined);

    // Map to HTTP
    const status =
      (typeof e?.response?.status === 'number'
        ? e.response.status
        : undefined) ??
      (typeof providerCode === 'number'
        ? this.toHttpStatus(providerCode)
        : HttpStatus.BAD_GATEWAY);

    const message = TypeMessage.getMessageByStatus(status);

    const errorBody: ProviderErrorResponse = {
      providerCode: providerCode ?? status,
      providerMessage:
        (typeof s?.error_message === 'string' ? s.error_message : undefined) ??
        (typeof e?.message === 'string' ? e.message : undefined),
      hint: undefined,
      rateLimit: this.extractRateLimit(e),
      details: { status: s, raw: providerEnvelope ?? e, ctx },
    };

    return {
      statusCode: status,
      success: false,
      message,
      error: errorBody,
      data: null,
      hasNextPage: false,
    };
  }
}
