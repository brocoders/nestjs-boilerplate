/**
 * StandardResponseInterceptor
 * -------------------------------------------------------------
 * Normalizes all HTTP handler returns into the app envelope:
 * { status, success, message, error, data, hasNextPage }
 *
 * Rules:
 * 1) If payload is already an envelope (status|statusCode + success + (data|error)):
 *    - Coerce status to number (fallback: HttpStatus.OK)
 *    - Fallback message via TypeMessage.getMessageByStatus(code)
 *    - Keep data as-is; if data is null/empty but there are extra top-level fields,
 *      pack those into data.
 * 2) Otherwise (not an envelope):
 *    - Infer status from payload.status/statusCode or success flag
 *    - Fallback message via TypeMessage.getMessageByStatus(code)
 *    - data = payload.data if present, else payload
 */
import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { TypeMessage } from '../types/message.type';

const toNumber = (v: any, fallback = HttpStatus.OK) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
};
const ensureMsg = (msg: any, code: number) => {
  const s = typeof msg === 'string' ? msg.trim() : '';
  return s.length
    ? s
    : (TypeMessage.getMessageByStatus(code) ?? (code < 400 ? 'OK' : 'Error'));
};
const isPlainObject = (v: any) =>
  v !== null && typeof v === 'object' && !Array.isArray(v);
const isEmptyObject = (v: any) =>
  isPlainObject(v) && Object.keys(v).length === 0;
const omitKeys = (obj: Record<string, any>, keys: string[]) => {
  const out: Record<string, any> = {};
  for (const k of Object.keys(obj)) {
    if (!keys.includes(k)) out[k] = obj[k];
  }
  return out;
};

type StandardResponse<T = unknown> = {
  status: number;
  success: boolean;
  message: string | null;
  error: any | null;
  data: T | null;
  hasNextPage: boolean;
};

const isEnvelope = (r: any) =>
  r &&
  typeof r === 'object' &&
  ('status' in r || 'statusCode' in r) &&
  'success' in r &&
  ('data' in r || 'error' in r);

@Injectable()
export class StandardResponseInterceptor implements NestInterceptor {
  private readonly logger = new Logger(StandardResponseInterceptor.name);

  intercept(_: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((response: any): StandardResponse => {
        this.logger.debug('Handling response');

        // 1) Envelope pass-through
        if (isEnvelope(response)) {
          const code = toNumber(
            (response as any).statusCode ?? (response as any).status,
            HttpStatus.OK,
          );

          const base = {
            status: code,
            success:
              typeof (response as any).success === 'boolean'
                ? Boolean((response as any).success)
                : code < 400,
            message: ensureMsg((response as any).message, code),
            error: (response as any).error ?? null,
            hasNextPage: Boolean((response as any).hasNextPage ?? false),
          };

          const hasDataKey = Object.prototype.hasOwnProperty.call(
            response,
            'data',
          );
          const givenData = (response as any).data;

          // If data is missing/null/empty but other top-level fields exist, pack them into data
          const rest = omitKeys(response as any, [
            'status',
            'statusCode',
            'success',
            'message',
            'error',
            'hasNextPage',
            'data',
          ]);
          const hasRest = Object.keys(rest).length > 0;
          const isEmptyData = givenData == null || isEmptyObject(givenData);

          const shaped: StandardResponse = {
            ...base,
            data:
              hasDataKey && !isEmptyData
                ? givenData
                : hasRest
                  ? rest
                  : base.success
                    ? {}
                    : null,
          };

          this.logger.debug('Detected envelope; pass-through applied');
          return shaped;
        }

        // 2) Generic normalization
        const inferredStatus =
          response?.status ??
          response?.statusCode ??
          (response?.success === false
            ? HttpStatus.BAD_REQUEST
            : HttpStatus.OK);

        const code = toNumber(inferredStatus, HttpStatus.OK);
        const message = ensureMsg(response?.message, code);

        this.logger.debug('Normalizing non-envelope response');

        return {
          status: code,
          success: code < 400,
          message,
          error: response?.error ?? null,
          data:
            response && typeof response === 'object' && 'data' in response
              ? (response as any).data
              : (response ?? null),
          hasNextPage: Boolean(response?.hasNextPage ?? false),
        };
      }),
      catchError((err) => {
        this.logger.debug('Caught error');

        const status = toNumber(
          (typeof err.getStatus === 'function' && err.getStatus()) ||
            err?.status,
          HttpStatus.INTERNAL_SERVER_ERROR,
        );

        let body: any = err?.response ?? err?.message ?? null;
        if (typeof body === 'string') body = { message: body };

        const message = ensureMsg(body?.message, status);

        const normalized: StandardResponse = {
          status,
          success: false,
          message,
          error: body?.error ?? body ?? err ?? null,
          data: null,
          hasNextPage: false,
        };

        this.logger.debug('Normalized error response');

        return throwError(() => new HttpException(normalized, status));
      }),
    );
  }
}
