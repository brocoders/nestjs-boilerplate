import { Module } from '@nestjs/common';
import { VendorBillRepository } from '../vendor-bill.repository';
import { VendorBillRelationalRepository } from './repositories/vendor-bill.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VendorBillEntity } from './entities/vendor-bill.entity';

@Module({
  imports: [TypeOrmModule.forFeature([VendorBillEntity])],
  providers: [
    {
      provide: VendorBillRepository,
      useClass: VendorBillRelationalRepository,
    },
  ],
  exports: [VendorBillRepository],
})
export class RelationalVendorBillPersistenceModule {}
