import { TenantsModule } from '../tenants/tenants.module';
import { AccountsModule } from '../accounts/accounts.module';
import { UsersModule } from '../users/users.module';
import {
  // common
  Module,
} from '@nestjs/common';
import { AccountsReceivablesService } from './accounts-receivables.service';
import { AccountsReceivablesController } from './accounts-receivables.controller';
import { RelationalAccountsReceivablePersistenceModule } from './infrastructure/persistence/relational/relational-persistence.module';

@Module({
  imports: [
    TenantsModule,

    AccountsModule,

    UsersModule,

    // import modules, etc.
    RelationalAccountsReceivablePersistenceModule,
  ],
  controllers: [AccountsReceivablesController],
  providers: [AccountsReceivablesService],
  exports: [
    AccountsReceivablesService,
    RelationalAccountsReceivablePersistenceModule,
  ],
})
export class AccountsReceivablesModule {}
