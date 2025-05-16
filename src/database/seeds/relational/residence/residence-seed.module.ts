import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ResidenceEntity } from '../../../../residences/infrastructure/persistence/relational/entities/residence.entity';
import { ResidenceSeedService } from './residence-seed.service';
import { RegionEntity } from '../../../../regions/infrastructure/persistence/relational/entities/region.entity';
import { RoleEntity } from '../../../../roles/infrastructure/persistence/relational/entities/role.entity';
import { TenantEntity } from '../../../../tenants/infrastructure/persistence/relational/entities/tenant.entity';
import { UserEntity } from '../../../../users/infrastructure/persistence/relational/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ResidenceEntity,
      TenantEntity,
      RegionEntity,
      UserEntity,
      RoleEntity,
    ]),
  ],
  providers: [ResidenceSeedService],
  exports: [ResidenceSeedService],
})
export class ResidenceSeedModule {}
