import { PaymentPlansModule } from '../payment-plans/payment-plans.module';
import { UsersModule } from '../users/users.module';
import {
  // common
  Module,
} from '@nestjs/common';
import { CustomerPlansService } from './customer-plans.service';
import { CustomerPlansController } from './customer-plans.controller';
import { RelationalCustomerPlanPersistenceModule } from './infrastructure/persistence/relational/relational-persistence.module';

@Module({
  imports: [
    PaymentPlansModule,

    UsersModule,

    // import modules, etc.
    RelationalCustomerPlanPersistenceModule,
  ],
  controllers: [CustomerPlansController],
  providers: [CustomerPlansService],
  exports: [CustomerPlansService, RelationalCustomerPlanPersistenceModule],
})
export class CustomerPlansModule {}
