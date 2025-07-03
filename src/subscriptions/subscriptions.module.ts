import { TenantsModule } from '../tenants/tenants.module';
import { PaymentPlansModule } from '../payment-plans/payment-plans.module';
import { UsersModule } from '../users/users.module';
import {
  // common
  Module,
} from '@nestjs/common';
import { SubscriptionsService } from './subscriptions.service';
import { SubscriptionsController } from './subscriptions.controller';
import { RelationalSubscriptionPersistenceModule } from './infrastructure/persistence/relational/relational-persistence.module';

@Module({
  imports: [
    TenantsModule,

    PaymentPlansModule,

    UsersModule,

    // import modules, etc.
    RelationalSubscriptionPersistenceModule,
  ],
  controllers: [SubscriptionsController],
  providers: [SubscriptionsService],
  exports: [SubscriptionsService, RelationalSubscriptionPersistenceModule],
})
export class SubscriptionsModule {}
