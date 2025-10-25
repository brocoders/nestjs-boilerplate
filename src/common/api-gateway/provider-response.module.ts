import { Global, Module } from '@nestjs/common';
import { ProviderResponseRegistry } from './response/registries/provider-response.registry';
/**
 * ProviderResponseModule
 * -------------------------------------------------------------
 * Global module that exposes the ProviderResponseRegistry so
 * providers can self-register their response adapters.
 */
@Global()
@Module({
  providers: [ProviderResponseRegistry],
  exports: [ProviderResponseRegistry],
})
export class ProviderResponseModule {}
