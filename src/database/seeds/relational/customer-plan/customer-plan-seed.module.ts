import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomerPlanEntity } from '../../../../customer-plans/infrastructure/persistence/relational/entities/customer-plan.entity';
import { TenantEntity } from '../../../../tenants/infrastructure/persistence/relational/entities/tenant.entity';
import { UserEntity } from '../../../../users/infrastructure/persistence/relational/entities/user.entity';
import { PaymentPlanEntity } from '../../../../payment-plans/infrastructure/persistence/relational/entities/payment-plan.entity';
import { RoleEntity } from '../../../../roles/infrastructure/persistence/relational/entities/role.entity';
import { CustomerPlanSeedService } from './customer-plan-seed.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      CustomerPlanEntity,
      TenantEntity,
      UserEntity,
      PaymentPlanEntity,
      RoleEntity,
    ]),
  ],
  providers: [CustomerPlanSeedService],
  exports: [CustomerPlanSeedService],
})
export class CustomerPlanSeedModule {}
