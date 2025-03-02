import { Inject, Injectable, Logger } from '@nestjs/common';
import { ApiGatewayConfig } from './api-gateway-config';
import { ApiClientFactory } from './api-client.factory';

@Injectable()
export class ApiGatewayService {
  private readonly logger = new Logger(ApiGatewayService.name);
  private sdkClients: Map<string, any> = new Map();
  private configs: Map<string, ApiGatewayConfig> = new Map();

  constructor(
    @Inject('API_GATEWAY_CONFIGS')
    private readonly initialConfigs: ApiGatewayConfig[],
  ) {
    this.logger.debug(
      `Initializing API SDK with ${initialConfigs.length} configurations.`,
    );
    initialConfigs.forEach((config) => this.registerClient(config));
  }

  registerClient(config: ApiGatewayConfig) {
    if (!config.name) {
      this.logger.error('API SDK Config is missing a name.');
      return;
    }

    this.logger.debug(`Registering API client: ${config.name}`);
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
    if (!this.configs.has(name)) {
      this.logger.error(`API SDK Config "${name}" not found.`);
      return;
    }

    const config = this.configs.get(name);
    if (!config) {
      this.logger.error(`Failed to retrieve API SDK Config for "${name}".`);
      return;
    }

    config.baseUrl = newBaseUrl;
    this.registerClient(config);

    if (this.sdkClients.has(name)) {
      this.logger.debug(
        `Successfully updated base URL for ${name} to ${newBaseUrl}`,
      );
    } else {
      this.logger.error(`Failed to update API client after base URL change.`);
    }
  }
}
