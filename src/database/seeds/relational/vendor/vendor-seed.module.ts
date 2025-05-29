import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VendorEntity } from '../../../../vendors/infrastructure/persistence/relational/entities/vendor.entity';
import { TenantEntity } from '../../../../tenants/infrastructure/persistence/relational/entities/tenant.entity';
import { VendorSeedService } from './vendor-seed.service';

@Module({
  imports: [TypeOrmModule.forFeature([VendorEntity, TenantEntity])],
  providers: [VendorSeedService],
  exports: [VendorSeedService],
})
export class VendorSeedModule {}
