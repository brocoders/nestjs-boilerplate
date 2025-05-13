import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RegionEntity } from '../../../../regions/infrastructure/persistence/relational/entities/region.entity';
import { RegionSeedService } from './region-seed.service';
import { TenantEntity } from 'src/tenants/infrastructure/persistence/relational/entities/tenant.entity';

@Module({
  imports: [TypeOrmModule.forFeature([RegionEntity, TenantEntity])],
  providers: [RegionSeedService],
  exports: [RegionSeedService],
})
export class RegionSeedModule {}
