import { HttpMethod } from './types/api-gateway.enum';
import { EndpointDefinition } from './types/api-gateway.type';

export class ApiGatewayConfig {
  public baseUrl: string;
  public headers?: Record<string, string>;
  public endpoints: EndpointDefinition[];
  public name: string;

  constructor(baseUrl: string, headers?: Record<string, string>) {
    this.baseUrl = baseUrl;
    this.headers = headers;
    this.endpoints = [];
  }

  // Method to add endpoint definitions
  addEndpoint(name: string, method: HttpMethod, url: string) {
    this.endpoints.push(new EndpointDefinition(name, method, url));
  }
}
