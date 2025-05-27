import { Module } from '@nestjs/common';
import { PaymentPlanRepository } from '../payment-plan.repository';
import { PaymentPlanRelationalRepository } from './repositories/payment-plan.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentPlanEntity } from './entities/payment-plan.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PaymentPlanEntity])],
  providers: [
    {
      provide: PaymentPlanRepository,
      useClass: PaymentPlanRelationalRepository,
    },
  ],
  exports: [PaymentPlanRepository],
})
export class RelationalPaymentPlanPersistenceModule {}
