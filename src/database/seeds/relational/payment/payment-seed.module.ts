import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentEntity } from '../../../../payments/infrastructure/persistence/relational/entities/payment.entity';
import { PaymentSeedService } from './payment-seed.service';
import { TenantEntity } from '../../../../tenants/infrastructure/persistence/relational/entities/tenant.entity';
import { InvoiceEntity } from '../../../../invoices/infrastructure/persistence/relational/entities/invoice.entity';
import { PaymentMethodEntity } from '../../../../payment-methods/infrastructure/persistence/relational/entities/payment-method.entity';
import { RoleEntity } from '../../../../roles/infrastructure/persistence/relational/entities/role.entity';
import { UserEntity } from '../../../../users/infrastructure/persistence/relational/entities/user.entity';
import { TransactionEntity } from '../../../../transactions/infrastructure/persistence/relational/entities/transaction.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      PaymentEntity,
      TenantEntity,
      UserEntity,
      InvoiceEntity,
      PaymentMethodEntity,
      TransactionEntity,
      RoleEntity,
    ]),
  ],
  providers: [PaymentSeedService],
  exports: [PaymentSeedService],
})
export class PaymentSeedModule {}
