import { RegionsModule } from '../regions/regions.module';
import { UsersModule } from '../users/users.module';
import { PaymentPlansModule } from '../payment-plans/payment-plans.module';
import {
  // common
  Module,
} from '@nestjs/common';
import { DiscountsService } from './discounts.service';
import { DiscountsController } from './discounts.controller';
import { RelationalDiscountPersistenceModule } from './infrastructure/persistence/relational/relational-persistence.module';

@Module({
  imports: [
    RegionsModule,

    UsersModule,

    PaymentPlansModule,

    // import modules, etc.
    RelationalDiscountPersistenceModule,
  ],
  controllers: [DiscountsController],
  providers: [DiscountsService],
  exports: [DiscountsService, RelationalDiscountPersistenceModule],
})
export class DiscountsModule {}
