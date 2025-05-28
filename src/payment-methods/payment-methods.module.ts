import { TenantsModule } from '../tenants/tenants.module';
import {
  // common
  Module,
} from '@nestjs/common';
import { PaymentMethodsService } from './payment-methods.service';
import { PaymentMethodsController } from './payment-methods.controller';
import { RelationalPaymentMethodPersistenceModule } from './infrastructure/persistence/relational/relational-persistence.module';

@Module({
  imports: [
    TenantsModule,

    // import modules, etc.
    RelationalPaymentMethodPersistenceModule,
  ],
  controllers: [PaymentMethodsController],
  providers: [PaymentMethodsService],
  exports: [PaymentMethodsService, RelationalPaymentMethodPersistenceModule],
})
export class PaymentMethodsModule {}
