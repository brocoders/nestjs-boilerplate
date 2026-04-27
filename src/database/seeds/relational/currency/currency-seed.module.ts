import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CurrencyEntity } from '../../../../currencies/infrastructure/persistence/relational/entities/currency.entity';
import { CurrencySeedService } from './currency-seed.service';

@Module({
  imports: [TypeOrmModule.forFeature([CurrencyEntity])],
  providers: [CurrencySeedService],
  exports: [CurrencySeedService],
})
export class CurrencySeedModule {}
