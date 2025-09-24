import { DynamicModule, Module, Provider } from '@nestjs/common';
import { ApiGatewayService } from './api-gateway.service';
import { ApiClientFactory } from './api-client.factory';
import { AnyApiGatewayConfig } from './types/api-gateway.type';

@Module({})
export class ApiGatewayModule {
  static register(configs: AnyApiGatewayConfig[]): DynamicModule {
    const configProvider: Provider = {
      provide: 'API_GATEWAY_CONFIGS',
      useValue: configs,
    };

    const apiClients: Provider[] = configs.map((config) => ({
      provide: `API_GATEWAY_${config.name.toUpperCase()}`,
      useFactory: () => new ApiClientFactory(config).createClient(),
    }));
    return {
      module: ApiGatewayModule,
      providers: [configProvider, ApiGatewayService, ...apiClients],
      exports: [ApiGatewayService, ...apiClients],
    };
  }
}
