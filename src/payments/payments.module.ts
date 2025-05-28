import { InvoicesModule } from '../invoices/invoices.module';
import { PaymentNotificationsModule } from '../payment-notifications/payment-notifications.module';
import { PaymentMethodsModule } from '../payment-methods/payment-methods.module';
import { UsersModule } from '../users/users.module';
import { TransactionsModule } from '../transactions/transactions.module';
import {
  // common
  Module,
  forwardRef,
} from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { PaymentsController } from './payments.controller';
import { RelationalPaymentPersistenceModule } from './infrastructure/persistence/relational/relational-persistence.module';

@Module({
  imports: [
    InvoicesModule,

    PaymentNotificationsModule,

    PaymentMethodsModule,

    UsersModule,

    forwardRef(() => TransactionsModule),

    // import modules, etc.
    RelationalPaymentPersistenceModule,
  ],
  controllers: [PaymentsController],
  providers: [PaymentsService],
  exports: [PaymentsService, RelationalPaymentPersistenceModule],
})
export class PaymentsModule {}
