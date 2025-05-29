import { TenantsModule } from '../tenants/tenants.module';
import {
  // common
  Module,
} from '@nestjs/common';
import { PaymentPlansService } from './payment-plans.service';
import { PaymentPlansController } from './payment-plans.controller';
import { RelationalPaymentPlanPersistenceModule } from './infrastructure/persistence/relational/relational-persistence.module';

@Module({
  imports: [
    TenantsModule,

    // import modules, etc.
    RelationalPaymentPlanPersistenceModule,
  ],
  controllers: [PaymentPlansController],
  providers: [PaymentPlansService],
  exports: [PaymentPlansService, RelationalPaymentPlanPersistenceModule],
})
export class PaymentPlansModule {}
