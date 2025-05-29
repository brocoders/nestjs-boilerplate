import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DiscountEntity } from '../../../../discounts/infrastructure/persistence/relational/entities/discount.entity';
import { TenantEntity } from '../../../../tenants/infrastructure/persistence/relational/entities/tenant.entity';
import { RegionEntity } from '../../../../regions/infrastructure/persistence/relational/entities/region.entity';
import { UserEntity } from '../../../../users/infrastructure/persistence/relational/entities/user.entity';
import { PaymentPlanEntity } from '../../../../payment-plans/infrastructure/persistence/relational/entities/payment-plan.entity';
import { RoleEntity } from '../../../../roles/infrastructure/persistence/relational/entities/role.entity';
import { DiscountSeedService } from './discount-seed.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      DiscountEntity,
      TenantEntity,
      RegionEntity,
      UserEntity,
      PaymentPlanEntity,
      RoleEntity,
    ]),
  ],
  providers: [DiscountSeedService],
  exports: [DiscountSeedService],
})
export class DiscountSeedModule {}
