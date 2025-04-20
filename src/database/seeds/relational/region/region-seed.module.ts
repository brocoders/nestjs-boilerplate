import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RegionEntity } from '../../../../regions/infrastructure/persistence/relational/entities/region.entity';
import { RegionSeedService } from './region-seed.service';

@Module({
  imports: [TypeOrmModule.forFeature([RegionEntity])],
  providers: [RegionSeedService],
  exports: [RegionSeedService],
})
export class RegionSeedModule {}
