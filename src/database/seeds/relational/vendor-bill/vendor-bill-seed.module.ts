import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VendorBillEntity } from '../../../../vendor-bills/infrastructure/persistence/relational/entities/vendor-bill.entity';
import { VendorBillSeedService } from './vendor-bill-seed.service';

@Module({
  imports: [TypeOrmModule.forFeature([VendorBillEntity])],
  providers: [VendorBillSeedService],
  exports: [VendorBillSeedService],
})
export class VendorBillSeedModule {}
