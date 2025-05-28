import { UsersModule } from '../users/users.module';
import {
  // common
  Module,
} from '@nestjs/common';
import { CreditBalancesService } from './credit-balances.service';
import { CreditBalancesController } from './credit-balances.controller';
import { RelationalCreditBalancePersistenceModule } from './infrastructure/persistence/relational/relational-persistence.module';

@Module({
  imports: [
    UsersModule,

    // import modules, etc.
    RelationalCreditBalancePersistenceModule,
  ],
  controllers: [CreditBalancesController],
  providers: [CreditBalancesService],
  exports: [CreditBalancesService, RelationalCreditBalancePersistenceModule],
})
export class CreditBalancesModule {}
