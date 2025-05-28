import { ExemptionsModule } from '../exemptions/exemptions.module';
import { DiscountsModule } from '../discounts/discounts.module';
import { AccountsReceivablesModule } from '../accounts-receivables/accounts-receivables.module';
import { PaymentPlansModule } from '../payment-plans/payment-plans.module';
import { UsersModule } from '../users/users.module';
import {
  forwardRef,
  // common
  Module,
} from '@nestjs/common';
import { InvoicesService } from './invoices.service';
import { InvoicesController } from './invoices.controller';
import { RelationalInvoicePersistenceModule } from './infrastructure/persistence/relational/relational-persistence.module';

@Module({
  imports: [
    forwardRef(() => ExemptionsModule),

    DiscountsModule,

    AccountsReceivablesModule,

    PaymentPlansModule,

    UsersModule,

    // import modules, etc.
    RelationalInvoicePersistenceModule,
  ],
  controllers: [InvoicesController],
  providers: [InvoicesService],
  exports: [InvoicesService, RelationalInvoicePersistenceModule],
})
export class InvoicesModule {}
