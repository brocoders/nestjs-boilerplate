// src/providers/providers.module.ts
import { Module } from '@nestjs/common';
import { ApiGatewayModule } from '../common/api-gateway/api-gateway.module';
import { CmcApiConfig } from '../providers/cmc/config/cmc-endpoints.config';
import { GorushApiConfig } from '../providers/gorush/config/gorush-endpoints.config';

@Module({
  imports: [
    ApiGatewayModule.register([new CmcApiConfig(), new GorushApiConfig()]),
  ],
  exports: [ApiGatewayModule],
})
export class ProvidersModule {}
