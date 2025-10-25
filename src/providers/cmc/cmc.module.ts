import { Module, OnModuleInit } from '@nestjs/common';
import { CmcService } from './cmc.service';
import { CmcController } from './cmc.controller';
import { EnableGuard } from 'src/common/guards/service-enabled.guard';
import { CmcResponseAdapter } from './cmc-response.adapter';
import { ProviderResponseRegistry } from '../../common/api-gateway/response/registries/provider-response.registry';
import { ProvidersModule } from '../providers.module';

@Module({
  imports: [ProvidersModule],
  providers: [CmcService, EnableGuard, CmcResponseAdapter],
  controllers: [CmcController],
  exports: [CmcService],
})
export class CmcModule implements OnModuleInit {
  constructor(
    private readonly registry: ProviderResponseRegistry,
    private readonly adapter: CmcResponseAdapter,
  ) {}

  onModuleInit() {
    this.registry.register(this.adapter);
  }
}
