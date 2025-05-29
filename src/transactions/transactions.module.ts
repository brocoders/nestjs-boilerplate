import { TenantsModule } from '../tenants/tenants.module';
import { PaymentsModule } from '../payments/payments.module';
import { AccountsModule } from '../accounts/accounts.module';
import {
  // common
  Module,
  forwardRef,
} from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { TransactionsController } from './transactions.controller';
import { RelationalTransactionPersistenceModule } from './infrastructure/persistence/relational/relational-persistence.module';

@Module({
  imports: [
    TenantsModule,

    forwardRef(() => PaymentsModule),

    AccountsModule,

    // import modules, etc.
    RelationalTransactionPersistenceModule,
  ],
  controllers: [TransactionsController],
  providers: [TransactionsService],
  exports: [TransactionsService, RelationalTransactionPersistenceModule],
})
export class TransactionsModule {}
