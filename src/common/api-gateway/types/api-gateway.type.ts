import { ConfigurableApiGatewayConfig } from '../../../config/config.service';
import { HttpMethod } from './api-gateway.enum';
import { ApiGatewayConfig } from './api-gateway.interfaces';

// function type for API calls
export type ApiFunction<TParams = any, TResponse = any> = (
  params?: TParams,
  headers?: Record<string, string>,
  callback?: (error: any, data: TResponse | null) => void,
) => Promise<TResponse> | void;

export class EndpointDefinition {
  constructor(
    public name: string,
    public method: HttpMethod,
    public url: string,
  ) {}
}

export type AnyApiGatewayConfig =
  | ApiGatewayConfig
  | ConfigurableApiGatewayConfig<any>;
