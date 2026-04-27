import { Global, Module } from '@nestjs/common';
import { RegionsModule } from '../regions/regions.module';
import { SettingsModule } from '../settings/settings.module';
import { LocalesModule } from '../locales/locales.module';
import { RequestContextInterceptor } from './request-context.interceptor';
import { RequestContextService } from './request-context.service';

@Global()
@Module({
  imports: [RegionsModule, SettingsModule, LocalesModule],
  providers: [RequestContextService, RequestContextInterceptor],
  exports: [RequestContextService, RequestContextInterceptor],
})
export class RequestContextModule {}
