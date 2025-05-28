import { PaymentNotificationsModule } from '../payment-notifications/payment-notifications.module';
import {
  // common
  Module,
  forwardRef,
} from '@nestjs/common';
import { PaymentAggregatorsService } from './payment-aggregators.service';
import { PaymentAggregatorsController } from './payment-aggregators.controller';
import { RelationalPaymentAggregatorPersistenceModule } from './infrastructure/persistence/relational/relational-persistence.module';

@Module({
  imports: [
    forwardRef(() => PaymentNotificationsModule),

    // import modules, etc.
    RelationalPaymentAggregatorPersistenceModule,
  ],
  controllers: [PaymentAggregatorsController],
  providers: [PaymentAggregatorsService],
  exports: [
    PaymentAggregatorsService,
    RelationalPaymentAggregatorPersistenceModule,
  ],
})
export class PaymentAggregatorsModule {}
