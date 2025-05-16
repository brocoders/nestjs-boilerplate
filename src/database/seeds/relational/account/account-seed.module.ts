import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountSeedService } from './account-seed.service';
import { AccountEntity } from '../../../../accounts/infrastructure/persistence/relational/entities/account.entity';
import { TenantEntity } from '../../../../tenants/infrastructure/persistence/relational/entities/tenant.entity';
import { UserEntity } from '../../../../users/infrastructure/persistence/relational/entities/user.entity';
import { RoleEntity } from '../../../../roles/infrastructure/persistence/relational/entities/role.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      AccountEntity,
      TenantEntity,
      UserEntity,
      RoleEntity,
    ]),
  ],
  providers: [AccountSeedService],
  exports: [AccountSeedService],
})
export class AccountSeedModule {}
