import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CurrencyAbstractRepository } from '../currency.abstract.repository';
import { CurrencyEntity } from './entities/currency.entity';
import { CurrencyRelationalRepository } from './repositories/currency.repository';

@Module({
  imports: [TypeOrmModule.forFeature([CurrencyEntity])],
  providers: [
    {
      provide: CurrencyAbstractRepository,
      useClass: CurrencyRelationalRepository,
    },
  ],
  exports: [CurrencyAbstractRepository],
})
export class RelationalCurrencyPersistenceModule {}
