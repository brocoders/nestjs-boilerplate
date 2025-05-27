import { UsersModule } from '../users/users.module';
import {
  // common
  Module,
} from '@nestjs/common';
import { InvoicesService } from './invoices.service';
import { InvoicesController } from './invoices.controller';
import { RelationalInvoicePersistenceModule } from './infrastructure/persistence/relational/relational-persistence.module';

@Module({
  imports: [
    UsersModule,

    // import modules, etc.
    RelationalInvoicePersistenceModule,
  ],
  controllers: [InvoicesController],
  providers: [InvoicesService],
  exports: [InvoicesService, RelationalInvoicePersistenceModule],
})
export class InvoicesModule {}
