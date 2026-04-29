import { Module } from '@nestjs/common';
import { VendorsModule } from '../vendors/vendors.module';
import { RelationalShippingZonePersistenceModule } from './infrastructure/persistence/relational/relational-persistence.module';
import { ShippingZonesVendorController } from './shipping-zones-vendor.controller';
import { ShippingZonesService } from './shipping-zones.service';

@Module({
  imports: [RelationalShippingZonePersistenceModule, VendorsModule],
  controllers: [ShippingZonesVendorController],
  providers: [ShippingZonesService],
  exports: [ShippingZonesService],
})
export class ShippingZonesModule {}
