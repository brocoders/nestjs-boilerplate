import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { FeatureSeedService } from './feature-seed.service';
import { Feature } from '../../../../features/domain/feature.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Feature])],
  providers: [FeatureSeedService],
  exports: [FeatureSeedService],
})
export class FeatureSeedModule {}
