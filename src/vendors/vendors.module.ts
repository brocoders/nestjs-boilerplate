import { TenantsModule } from '../tenants/tenants.module';
import { VendorBillsModule } from '../vendor-bills/vendor-bills.module';
import {
  // common
  Module,
  forwardRef,
} from '@nestjs/common';
import { VendorsService } from './vendors.service';
import { VendorsController } from './vendors.controller';
import { RelationalVendorPersistenceModule } from './infrastructure/persistence/relational/relational-persistence.module';

@Module({
  imports: [
    TenantsModule,

    forwardRef(() => VendorBillsModule),

    // import modules, etc.
    RelationalVendorPersistenceModule,
  ],
  controllers: [VendorsController],
  providers: [VendorsService],
  exports: [VendorsService, RelationalVendorPersistenceModule],
})
export class VendorsModule {}
