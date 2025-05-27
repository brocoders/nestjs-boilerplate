import { Module } from '@nestjs/common';
import { CreditBalanceRepository } from '../credit-balance.repository';
import { CreditBalanceRelationalRepository } from './repositories/credit-balance.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CreditBalanceEntity } from './entities/credit-balance.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CreditBalanceEntity])],
  providers: [
    {
      provide: CreditBalanceRepository,
      useClass: CreditBalanceRelationalRepository,
    },
  ],
  exports: [CreditBalanceRepository],
})
export class RelationalCreditBalancePersistenceModule {}
