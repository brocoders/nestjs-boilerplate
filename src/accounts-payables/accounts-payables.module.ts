import { TenantsModule } from '../tenants/tenants.module';
import { AccountsModule } from '../accounts/accounts.module';
import { UsersModule } from '../users/users.module';
import {
  // common
  Module,
} from '@nestjs/common';
import { AccountsPayablesService } from './accounts-payables.service';
import { AccountsPayablesController } from './accounts-payables.controller';
import { RelationalAccountsPayablePersistenceModule } from './infrastructure/persistence/relational/relational-persistence.module';

@Module({
  imports: [
    TenantsModule,

    AccountsModule,

    UsersModule,

    // import modules, etc.
    RelationalAccountsPayablePersistenceModule,
  ],
  controllers: [AccountsPayablesController],
  providers: [AccountsPayablesService],
  exports: [
    AccountsPayablesService,
    RelationalAccountsPayablePersistenceModule,
  ],
})
export class AccountsPayablesModule {}
