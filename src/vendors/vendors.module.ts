import {
  // common
  Module,
} from '@nestjs/common';
import { VendorsService } from './vendors.service';
import { VendorsController } from './vendors.controller';
import { RelationalVendorPersistenceModule } from './infrastructure/persistence/relational/relational-persistence.module';

@Module({
  imports: [
    // import modules, etc.
    RelationalVendorPersistenceModule,
  ],
  controllers: [VendorsController],
  providers: [VendorsService],
  exports: [VendorsService, RelationalVendorPersistenceModule],
})
export class VendorsModule {}
