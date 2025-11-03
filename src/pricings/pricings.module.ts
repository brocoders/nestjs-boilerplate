import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PricingsService } from './pricings.service';
import { PricingsController } from './pricings.controller';
import { Pricing } from './domain/pricing.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Pricing])],
  controllers: [PricingsController],
  providers: [PricingsService],
  exports: [PricingsService],
})
export class PricingsModule {}
