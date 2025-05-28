import { AccountsPayablesModule } from '../accounts-payables/accounts-payables.module';
import { VendorsModule } from '../vendors/vendors.module';
import {
  // common
  Module,
  forwardRef,
} from '@nestjs/common';
import { VendorBillsService } from './vendor-bills.service';
import { VendorBillsController } from './vendor-bills.controller';
import { RelationalVendorBillPersistenceModule } from './infrastructure/persistence/relational/relational-persistence.module';

@Module({
  imports: [
    AccountsPayablesModule,

    forwardRef(() => VendorsModule),

    // import modules, etc.
    RelationalVendorBillPersistenceModule,
  ],
  controllers: [VendorBillsController],
  providers: [VendorBillsService],
  exports: [VendorBillsService, RelationalVendorBillPersistenceModule],
})
export class VendorBillsModule {}
