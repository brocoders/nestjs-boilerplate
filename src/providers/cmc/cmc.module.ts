import { Module } from '@nestjs/common';
import { CmcService } from './cmc.service';
import { CmcApiConfig } from './config/cmc-endpoints.config';
import { ApiGatewayModule } from '../../common/api-gateway/api-gateway.module';
import { CmcController } from './cmc.controller';

@Module({
  imports: [ApiGatewayModule.register([new CmcApiConfig()])],
  providers: [CmcService],
  controllers: [CmcController],
  exports: [CmcService],
})
export class CmcModule {}
