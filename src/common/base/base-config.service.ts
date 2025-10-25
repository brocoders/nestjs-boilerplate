import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiGatewayConfig } from '../api-gateway/api-gateway-config';

/**
 * Base class for services requiring ConfigService with type support.
 */
@Injectable()
export abstract class ConfigurableService<T = Record<string, unknown>> {
  protected readonly configService: ConfigService<T>;
  protected constructor(configService?: ConfigService<T>) {
    if (configService) this.configService = configService;
  }
}

@Injectable()
export abstract class ConfigurableApiGatewayConfig<
  T = Record<string, unknown>,
> extends ApiGatewayConfig {
  protected readonly configService: ConfigService<T>;

  constructor(
    configService: ConfigService<T>,
    baseUrl: string,
    headers?: Record<string, string>,
  ) {
    super(baseUrl, headers);
    this.configService = configService;
  }
}
