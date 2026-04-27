import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RegionAbstractRepository } from '../region.abstract.repository';
import { RegionEntity } from './entities/region.entity';
import { RegionRelationalRepository } from './repositories/region.repository';

@Module({
  imports: [TypeOrmModule.forFeature([RegionEntity])],
  providers: [
    {
      provide: RegionAbstractRepository,
      useClass: RegionRelationalRepository,
    },
  ],
  exports: [RegionAbstractRepository],
})
export class RelationalRegionPersistenceModule {}
