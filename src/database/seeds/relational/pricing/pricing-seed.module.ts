import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { PricingSeedService } from './pricing-seed.service';
import { Pricing } from '../../../../pricings/domain/pricing.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Pricing])],
  providers: [PricingSeedService],
  exports: [PricingSeedService],
})
export class PricingSeedModule {}
