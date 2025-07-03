import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SubscriptionEntity } from '../../../../subscriptions/infrastructure/persistence/relational/entities/subscription.entity';
import { TenantEntity } from '../../../../tenants/infrastructure/persistence/relational/entities/tenant.entity';
import { UserEntity } from '../../../../users/infrastructure/persistence/relational/entities/user.entity';
import { PaymentPlanEntity } from '../../../../payment-plans/infrastructure/persistence/relational/entities/payment-plan.entity';
import { RoleEntity } from '../../../../roles/infrastructure/persistence/relational/entities/role.entity';
import { SubscriptionSeedService } from './subscription-seed.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      SubscriptionEntity,
      TenantEntity,
      UserEntity,
      PaymentPlanEntity,
      RoleEntity,
    ]),
  ],
  providers: [SubscriptionSeedService],
  exports: [SubscriptionSeedService],
})
export class SubscriptionSeedModule {}
