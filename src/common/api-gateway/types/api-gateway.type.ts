import { HttpMethod } from './api-gateway.enum';

/**
 * Represents the shape of data you can send to an API endpoint.
 * Supports REST-style components: param, query, body, and headers.
 */
export interface RequestInput {
  /** Replaces param placeholders like /users/{id} → /users/123 */
  param?: Record<string, string | number | boolean>;

  /** Query string parameters (?page=1&limit=10) */
  query?: Record<string, any>;

  /** Body data for POST, PUT, PATCH requests */
  body?: any;

  /** Custom per-request headers */
  headers?: Record<string, string>;
}

/**
 * Defines an optional post-processing mapper for endpoint responses.
 * For example: unwrapData(response) or transformToDto(response)
 */
export type MapResponseFn<T = any> = (raw: any) => T;

/**
 * Optional endpoint-specific settings.
 */
export interface EndpointOptions {
  /** Optional per-endpoint response transformer */
  mapResponse?: MapResponseFn;
  /** Optional per-endpoint timeout (in ms) */
  timeoutMs?: number;
}

/**
 * The function type every generated API endpoint implements.
 * Accepts an optional RequestInput and returns a promise with the raw or mapped data.
 */
export type ApiFunction = (input?: RequestInput) => Promise<any>;

/**
 * Definition of an endpoint registered under an ApiGatewayConfig.
 * The `urlTemplate` may contain placeholders like /v1/users/{id}.
 */
export class EndpointDefinition {
  constructor(
    public name: string,
    public method: HttpMethod,
    public urlTemplate: string,
    public options?: EndpointOptions,
  ) {}
}

/**
 * A loose type alias for “any API gateway configuration”.
 * Used when injecting dynamic modules.
 */
export type AnyApiGatewayConfig = {
  name: string;
  baseUrl: string;
  headers?: Record<string, string>;
  endpoints: EndpointDefinition[];
};


//TODO: apply to all provider responses in the api-gateway module
export type ProviderErrorResponse = {
  providerCode?: number | string;
  providerMessage?: string;
  hint?: string;
  rateLimit?: {
    perMinute?: number;
    remaining?: number;
    resetAt?: string;
  };
  details?: unknown; // <-- free slot for provider-specific extras (reason, constraints, etc.)
};
