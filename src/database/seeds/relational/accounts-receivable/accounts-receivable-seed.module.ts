import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountsReceivableEntity } from '../../../../accounts-receivables/infrastructure/persistence/relational/entities/accounts-receivable.entity';
import { TenantEntity } from '../../../../tenants/infrastructure/persistence/relational/entities/tenant.entity';
import { UserEntity } from '../../../../users/infrastructure/persistence/relational/entities/user.entity';
import { AccountEntity } from '../../../../accounts/infrastructure/persistence/relational/entities/account.entity';
import { RoleEntity } from '../../../../roles/infrastructure/persistence/relational/entities/role.entity';
import { InvoiceEntity } from '../../../../invoices/infrastructure/persistence/relational/entities/invoice.entity';
import { AccountsReceivableSeedService } from './accounts-receivable-seed.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      AccountsReceivableEntity,
      TenantEntity,
      UserEntity,
      AccountEntity,
      RoleEntity,
      InvoiceEntity,
    ]),
  ],
  providers: [AccountsReceivableSeedService],
  exports: [AccountsReceivableSeedService],
})
export class AccountsReceivableSeedModule {}
