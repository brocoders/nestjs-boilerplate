import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserSeedService } from './user-seed.service';
import { UserEntity } from '../../../../users/infrastructure/persistence/relational/entities/user.entity';
import { RegionEntity } from 'src/regions/infrastructure/persistence/relational/entities/region.entity';
import { RoleEntity } from 'src/roles/infrastructure/persistence/relational/entities/role.entity';
import { TenantEntity } from 'src/tenants/infrastructure/persistence/relational/entities/tenant.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserEntity,
      TenantEntity,
      RegionEntity,
      RoleEntity,
    ]),
  ],
  providers: [UserSeedService],
  exports: [UserSeedService],
})
export class UserSeedModule {}
