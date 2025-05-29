import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserSeedService } from './user-seed.service';
import { UserEntity } from '../../../../users/infrastructure/persistence/relational/entities/user.entity';
import { RegionEntity } from '../../../../regions/infrastructure/persistence/relational/entities/region.entity';
import { RoleEntity } from '../../../../roles/infrastructure/persistence/relational/entities/role.entity';
import { TenantEntity } from '../../../../tenants/infrastructure/persistence/relational/entities/tenant.entity';
import { SettingsEntity } from '../../../../settings/infrastructure/persistence/relational/entities/settings.entity';
import { KycDetailsEntity } from '../../../../kyc-details/infrastructure/persistence/relational/entities/kyc-details.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserEntity,
      TenantEntity,
      RegionEntity,
      RoleEntity,
      SettingsEntity,
      KycDetailsEntity,
    ]),
  ],
  providers: [UserSeedService],
  exports: [UserSeedService],
})
export class UserSeedModule {}
