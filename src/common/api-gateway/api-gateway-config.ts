import { HttpMethod } from './types/api-gateway.enum';
import {
  AnyApiGatewayConfig,
  EndpointDefinition,
  EndpointOptions,
} from './types/api-gateway.type';

export class ApiGatewayConfig implements AnyApiGatewayConfig {
  public baseUrl: string;
  public headers?: Record<string, string>;
  public endpoints: EndpointDefinition[] = [];
  public name = '';

  constructor(baseUrl: string, headers?: Record<string, string>) {
    this.baseUrl = baseUrl;
    this.headers = headers;
  }

  /**
   * Add a new endpoint.
   * Example:
   *   addEndpoint('getFoo', HttpMethod.GET, '/foo/{id}', { mapResponse: unwrapData })
   */
  addEndpoint(
    name: string,
    method: HttpMethod,
    url: string,
    options?: EndpointOptions,
  ): void {
    this.endpoints.push(new EndpointDefinition(name, method, url, options));
  }

  /** Optional helper for retrieval. */
  getEndpoint(name: string): EndpointDefinition | undefined {
    return this.endpoints.find((e) => e.name === name);
  }
}
