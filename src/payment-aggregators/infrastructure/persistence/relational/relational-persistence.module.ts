import { Module } from '@nestjs/common';
import { PaymentAggregatorRepository } from '../payment-aggregator.repository';
import { PaymentAggregatorRelationalRepository } from './repositories/payment-aggregator.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentAggregatorEntity } from './entities/payment-aggregator.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PaymentAggregatorEntity])],
  providers: [
    {
      provide: PaymentAggregatorRepository,
      useClass: PaymentAggregatorRelationalRepository,
    },
  ],
  exports: [PaymentAggregatorRepository],
})
export class RelationalPaymentAggregatorPersistenceModule {}
