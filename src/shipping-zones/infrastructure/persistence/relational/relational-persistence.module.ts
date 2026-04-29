import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ShippingZoneAbstractRepository } from '../shipping-zone.abstract.repository';
import { ShippingZoneEntity } from './entities/shipping-zone.entity';
import { ShippingZoneRelationalRepository } from './repositories/shipping-zone.repository';

@Module({
  imports: [TypeOrmModule.forFeature([ShippingZoneEntity])],
  providers: [
    {
      provide: ShippingZoneAbstractRepository,
      useClass: ShippingZoneRelationalRepository,
    },
  ],
  exports: [ShippingZoneAbstractRepository],
})
export class RelationalShippingZonePersistenceModule {}
