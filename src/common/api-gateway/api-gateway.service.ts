import { Inject, Injectable, Logger } from '@nestjs/common';
import { ApiClientFactory } from './api-client.factory';
import { AnyApiGatewayConfig } from './types/api-gateway.type';

@Injectable()
export class ApiGatewayService {
  private readonly logger = new Logger(ApiGatewayService.name);
  private sdkClients: Map<string, any> = new Map();
  private configs: Map<string, AnyApiGatewayConfig> = new Map();

  constructor(
    @Inject('API_GATEWAY_CONFIGS')
    private readonly initialConfigs: AnyApiGatewayConfig[],
  ) {
    this.logger.debug(
      `Initializing API SDK with ${initialConfigs.length} configurations.`,
    );
    initialConfigs.forEach((config) => this.registerClient(config));
  }

  registerClient(
    config: AnyApiGatewayConfig,
    options: { silent?: boolean } = {},
  ) {
    if (!config.name) {
      this.logger.error('API SDK Config is missing a name.');
      return;
    }

    if (!options.silent) {
      this.logger.debug(`Registering API client: ${config.name}`);
    }
    this.configs.set(config.name, config);
    this.sdkClients.set(
      config.name,
      new ApiClientFactory(config).createClient(),
    );
  }

  getClient(name: string) {
    return this.sdkClients.get(name);
  }

  updateBaseUrl(name: string, newBaseUrl: string) {
    const config = this.configs.get(name);
    if (!config) {
      this.logger.error(`API SDK Config "${name}" not found.`);
      return;
    }

    const mergedConfig: AnyApiGatewayConfig = {
      ...config,
      baseUrl: newBaseUrl,
    };
    this.configs.set(name, mergedConfig);
    this.registerClient(mergedConfig, { silent: true });
    this.logger.debug(
      `Successfully updated base URL for ${name} to ${newBaseUrl}`,
    );
  }

  updateHeaders(name: string, newHeaders: Record<string, string>) {
    const config = this.configs.get(name);
    if (!config) {
      this.logger.error(`API SDK Config "${name}" not found.`);
      return;
    }

    const mergedHeaders = { ...(config.headers || {}), ...newHeaders };
    const mergedConfig: AnyApiGatewayConfig = {
      ...config,
      headers: mergedHeaders,
    };
    this.configs.set(name, mergedConfig);
    this.registerClient(mergedConfig, { silent: true });
    this.logger.debug(`Successfully updated headers for ${name}`);
  }
}
