import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CreditBalanceEntity } from '../../../../credit-balances/infrastructure/persistence/relational/entities/credit-balance.entity';
import { CreditBalanceSeedService } from './credit-balance-seed.service';

@Module({
  imports: [TypeOrmModule.forFeature([CreditBalanceEntity])],
  providers: [CreditBalanceSeedService],
  exports: [CreditBalanceSeedService],
})
export class CreditBalanceSeedModule {}
