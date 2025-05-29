import { TenantsModule } from '../tenants/tenants.module';
import { PaymentAggregatorsModule } from '../payment-aggregators/payment-aggregators.module';
import {
  // common
  Module,
  forwardRef,
} from '@nestjs/common';
import { PaymentNotificationsService } from './payment-notifications.service';
import { PaymentNotificationsController } from './payment-notifications.controller';
import { RelationalPaymentNotificationPersistenceModule } from './infrastructure/persistence/relational/relational-persistence.module';

@Module({
  imports: [
    TenantsModule,

    forwardRef(() => PaymentAggregatorsModule),

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
