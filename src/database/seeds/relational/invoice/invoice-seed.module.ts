import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InvoiceEntity } from '../../../../invoices/infrastructure/persistence/relational/entities/invoice.entity';
import { TenantEntity } from '../../../../tenants/infrastructure/persistence/relational/entities/tenant.entity';
import { UserEntity } from '../../../../users/infrastructure/persistence/relational/entities/user.entity';
import { PaymentPlanEntity } from '../../../../payment-plans/infrastructure/persistence/relational/entities/payment-plan.entity';
import { ExemptionEntity } from '../../../../exemptions/infrastructure/persistence/relational/entities/exemption.entity';
import { DiscountEntity } from '../../../../discounts/infrastructure/persistence/relational/entities/discount.entity';
import { RoleEntity } from '../../../../roles/infrastructure/persistence/relational/entities/role.entity';
import { InvoiceSeedService } from './invoice-seed.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      InvoiceEntity,
      TenantEntity,
      UserEntity,
      PaymentPlanEntity,
      ExemptionEntity,
      DiscountEntity,
      RoleEntity,
    ]),
  ],
  providers: [InvoiceSeedService],
  exports: [InvoiceSeedService],
})
export class InvoiceSeedModule {}
