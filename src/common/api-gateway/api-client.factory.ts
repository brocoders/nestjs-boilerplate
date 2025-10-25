import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { HttpException, HttpStatus } from '@nestjs/common';
import {
  AnyApiGatewayConfig,
  ApiFunction,
  RequestInput,
} from './types/api-gateway.type';

type Envelope<T = any> = {
  statusCode: number;
  data: T;
  headers: Record<string, any>;
};

// Legacy compat
type LegacyArgs = {
  params?: any; // old style
  headers?: Record<string, string>;
};
type MaybeCallback = (error: any, response: any | null) => void;

export class ApiClientFactory {
  private axiosInstance: AxiosInstance;

  constructor(private readonly config: AnyApiGatewayConfig) {
    this.axiosInstance = axios.create({
      baseURL: config.baseUrl,
      timeout: 5000,
      headers: config.headers || {},
      responseType: 'json',
    });
  }

  createClient(): Record<string, ApiFunction> {
    const client: Record<string, ApiFunction> = {};
    const endpoints = this.config.endpoints ?? [];

    endpoints.forEach((endpoint) => {
      client[endpoint.name] = async (
        input?: RequestInput | LegacyArgs,
        maybeHeadersOrCb?: Record<string, string> | MaybeCallback,
        maybeCb?: MaybeCallback,
      ) => {
        const { url, method } = {
          url: endpoint.urlTemplate,
          method: endpoint.method,
        };

        // Normalize args: support new (RequestInput) and legacy ({params, headers}, headers?, cb?)
        const { param, query, body, headers, cb } = this.normalizeArgs(
          input,
          maybeHeadersOrCb,
          maybeCb,
        );

        const finalUrl = this.buildUrl(url, param);
        const finalHeaders = {
          ...(this.config.headers ?? {}),
          ...(headers ?? {}),
        };

        const axiosCfg: any = {
          method,
          url: finalUrl,
          headers: finalHeaders,
          responseType: 'json',
          // Per-endpoint timeout override (optional)
          ...(endpoint.options?.timeoutMs
            ? { timeout: endpoint.options.timeoutMs }
            : {}),
        };

        // Query / Body routing by method
        const methodUpper = String(method).toUpperCase();
        const sendBody = ['POST', 'PUT', 'PATCH'].includes(methodUpper);

        if (sendBody) {
          axiosCfg.data = body ?? query ?? undefined; // if legacy user sent only query
          axiosCfg.params = query ?? undefined; // still allow querystring on POST/PUT/PATCH
        } else {
          axiosCfg.params = query ?? body ?? undefined; // legacy: if body used on GET, treat as query
        }

        try {
          const response: AxiosResponse =
            await this.axiosInstance.request(axiosCfg);

          const envelope: Envelope = {
            statusCode: response.status,
            data: response.data,
            headers: response.headers,
          };

          const mapped =
            typeof endpoint.options?.mapResponse === 'function'
              ? endpoint.options.mapResponse(envelope)
              : envelope;

          if (cb) return cb(null, mapped);
          return mapped;
        } catch (error: any) {
          const status =
            error?.response?.status ?? HttpStatus.INTERNAL_SERVER_ERROR;
          const message = error?.response?.data ?? 'Internal Server Error';

          const nestError = new HttpException(
            { statusCode: status, message },
            status,
          );

          if (cb) return cb(nestError, null);
          throw nestError;
        }
      };
    });

    return client;
  }

  /** Replace /param/{id}/detail → /param/123/detail using input.param */
  private buildUrl(template: string, param?: RequestInput['param']): string {
    if (!param) return template;
    return template.replace(/\{(\w+)\}/g, (_, key) => {
      const v = param[key];
      return v === undefined || v === null ? '' : encodeURIComponent(String(v));
    });
  }

  /**
   * Normalize both modern and legacy call styles to:
   * { param?, query?, body?, headers?, cb? }
   */
  private normalizeArgs(
    input?: RequestInput | LegacyArgs,
    maybeHeadersOrCb?: Record<string, string> | MaybeCallback,
    maybeCb?: MaybeCallback,
  ): {
    param?: Record<string, any>;
    query?: Record<string, any>;
    body?: any;
    headers?: Record<string, string>;
    cb?: MaybeCallback;
  } {
    // Modern: fn({ param?, query?, body?, headers? })
    if (
      input &&
      typeof input === 'object' &&
      ('param' in input ||
        'query' in input ||
        'body' in input ||
        'headers' in input)
    ) {
      const req = input as RequestInput;
      return {
        param: req.param,
        query: req.query,
        body: req.body,
        headers: req.headers,
        cb: (typeof maybeHeadersOrCb === 'function'
          ? maybeHeadersOrCb
          : maybeCb) as MaybeCallback | undefined,
      };
    }

    // Legacy: fn(params?, headers?, cb?)
    const legacy = (input as LegacyArgs) ?? {};
    const headers =
      (typeof maybeHeadersOrCb === 'object'
        ? (maybeHeadersOrCb as Record<string, string>)
        : undefined) ?? legacy.headers;

    const cb =
      (typeof maybeHeadersOrCb === 'function' ? maybeHeadersOrCb : maybeCb) ??
      undefined;

    // We don’t know if legacy “params” were query or body; keep them in query by default
    return {
      query: legacy.params ?? undefined,
      headers,
      cb,
    };
  }
}
