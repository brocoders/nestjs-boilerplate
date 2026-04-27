import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VendorAbstractRepository } from '../vendor.abstract.repository';
import { VendorEntity } from './entities/vendor.entity';
import { VendorRelationalRepository } from './repositories/vendor.repository';

@Module({
  imports: [TypeOrmModule.forFeature([VendorEntity])],
  providers: [
    {
      provide: VendorAbstractRepository,
      useClass: VendorRelationalRepository,
    },
  ],
  exports: [VendorAbstractRepository],
})
export class RelationalVendorPersistenceModule {}
