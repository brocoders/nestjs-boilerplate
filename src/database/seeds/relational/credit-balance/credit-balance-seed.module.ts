import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CreditBalanceEntity } from '../../../../credit-balances/infrastructure/persistence/relational/entities/credit-balance.entity';
import { CreditBalanceSeedService } from './credit-balance-seed.service';
import { TenantEntity } from '../../../../tenants/infrastructure/persistence/relational/entities/tenant.entity';
import { RoleEntity } from '../../../../roles/infrastructure/persistence/relational/entities/role.entity';
import { UserEntity } from '../../../../users/infrastructure/persistence/relational/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      CreditBalanceEntity,
      TenantEntity,
      UserEntity,
      RoleEntity,
    ]),
  ],
  providers: [CreditBalanceSeedService],
  exports: [CreditBalanceSeedService],
})
export class CreditBalanceSeedModule {}
