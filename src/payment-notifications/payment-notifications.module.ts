import {
  // common
  Module,
} from '@nestjs/common';
import { PaymentNotificationsService } from './payment-notifications.service';
import { PaymentNotificationsController } from './payment-notifications.controller';
import { RelationalPaymentNotificationPersistenceModule } from './infrastructure/persistence/relational/relational-persistence.module';

@Module({
  imports: [
    // import modules, etc.
    RelationalPaymentNotificationPersistenceModule,
  ],
  controllers: [PaymentNotificationsController],
  providers: [PaymentNotificationsService],
  exports: [
    PaymentNotificationsService,
    RelationalPaymentNotificationPersistenceModule,
  ],
})
export class PaymentNotificationsModule {}
