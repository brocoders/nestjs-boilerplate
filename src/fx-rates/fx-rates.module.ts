import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { RelationalFxRatePersistenceModule } from './infrastructure/persistence/relational/relational-persistence.module';
import { FxRateFetcherService } from './fx-rate-fetcher.service';
import { FxHttpClient } from './fx-http.client';
import { FxRateProcessor } from './fx-rate.processor';
import { FxRateScheduler } from './fx-rate.scheduler';

@Module({
  imports: [
    RelationalFxRatePersistenceModule,
    BullModule.registerQueue({ name: 'fx-rates' }),
  ],
  providers: [
    FxRateFetcherService,
    FxHttpClient,
    { provide: 'FX_HTTP', useClass: FxHttpClient },
    FxRateProcessor,
    FxRateScheduler,
  ],
  exports: [FxRateFetcherService],
})
export class FxRatesModule {}
