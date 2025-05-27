import {
  // common
  Module,
} from '@nestjs/common';
import { DiscountsService } from './discounts.service';
import { DiscountsController } from './discounts.controller';
import { RelationalDiscountPersistenceModule } from './infrastructure/persistence/relational/relational-persistence.module';

@Module({
  imports: [
    // import modules, etc.
    RelationalDiscountPersistenceModule,
  ],
  controllers: [DiscountsController],
  providers: [DiscountsService],
  exports: [DiscountsService, RelationalDiscountPersistenceModule],
})
export class DiscountsModule {}
