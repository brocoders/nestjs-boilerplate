import { TenantsModule } from '../tenants/tenants.module';
import { UsersModule } from '../users/users.module';
import {
  // common
  Module,
} from '@nestjs/common';
import { AccountsService } from './accounts.service';
import { AccountsController } from './accounts.controller';
import { RelationalAccountPersistenceModule } from './infrastructure/persistence/relational/relational-persistence.module';

@Module({
  imports: [
    TenantsModule,

    UsersModule,

    // import modules, etc.
    RelationalAccountPersistenceModule,
  ],
  controllers: [AccountsController],
  providers: [AccountsService],
  exports: [AccountsService, RelationalAccountPersistenceModule],
})
export class AccountsModule {}
