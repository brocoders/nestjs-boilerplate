import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountsPayableEntity } from '../../../../accounts-payables/infrastructure/persistence/relational/entities/accounts-payable.entity';
import { AccountsPayableSeedService } from './accounts-payable-seed.service';
import { TenantEntity } from '../../../../tenants/infrastructure/persistence/relational/entities/tenant.entity';
import { UserEntity } from '../../../../users/infrastructure/persistence/relational/entities/user.entity';
import { AccountEntity } from '../../../../accounts/infrastructure/persistence/relational/entities/account.entity';
import { RoleEntity } from '../../../../roles/infrastructure/persistence/relational/entities/role.entity';
import { VendorEntity } from '../../../../vendors/infrastructure/persistence/relational/entities/vendor.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      AccountsPayableEntity,
      TenantEntity,
      UserEntity,
      AccountEntity,
      VendorEntity,
      RoleEntity,
    ]),
  ],
  providers: [AccountsPayableSeedService],
  exports: [AccountsPayableSeedService],
})
export class AccountsPayableSeedModule {}
