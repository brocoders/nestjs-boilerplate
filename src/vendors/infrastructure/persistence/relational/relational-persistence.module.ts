import { Module } from '@nestjs/common';
import { VendorRepository } from '../vendor.repository';
import { VendorRelationalRepository } from './repositories/vendor.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VendorEntity } from './entities/vendor.entity';

@Module({
  imports: [TypeOrmModule.forFeature([VendorEntity])],
  providers: [
    {
      provide: VendorRepository,
      useClass: VendorRelationalRepository,
    },
  ],
  exports: [VendorRepository],
})
export class RelationalVendorPersistenceModule {}
