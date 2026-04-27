import { Module } from '@nestjs/common';
import { CurrenciesController } from './currencies.controller';
import { CurrenciesService } from './currencies.service';
import { RelationalCurrencyPersistenceModule } from './infrastructure/persistence/relational/relational-persistence.module';

@Module({
  imports: [RelationalCurrencyPersistenceModule],
  controllers: [CurrenciesController],
  providers: [CurrenciesService],
  exports: [CurrenciesService],
})
export class CurrenciesModule {}
