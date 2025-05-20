import { Module } from '@nestjs/common';
import { GorushService } from './gorush.service';
import { GorushController } from './gorush.controller';
import { GorushApiConfig } from './config/gorush-endpoints.config';
import { ApiGatewayModule } from '../../common/api-gateway/api-gateway.module';

@Module({
  imports: [
    ApiGatewayModule.register([
      new GorushApiConfig(), // Register Gorush API SDK
    ]),
  ],
  providers: [GorushService],
  controllers: [GorushController],
})
export class GorushModule {}
