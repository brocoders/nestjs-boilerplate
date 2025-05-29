import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentPlanEntity } from '../../../../payment-plans/infrastructure/persistence/relational/entities/payment-plan.entity';
import { TenantEntity } from '../../../../tenants/infrastructure/persistence/relational/entities/tenant.entity';
import { PaymentPlanSeedService } from './payment-plan-seed.service';

@Module({
  imports: [TypeOrmModule.forFeature([PaymentPlanEntity, TenantEntity])],
  providers: [PaymentPlanSeedService],
  exports: [PaymentPlanSeedService],
})
export class PaymentPlanSeedModule {}
