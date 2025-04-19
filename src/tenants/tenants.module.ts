import {
  // common
  Module,
} from '@nestjs/common';
import { TenantsService } from './tenants.service';
import { TenantsController } from './tenants.controller';
import { RelationalTenantPersistenceModule } from './infrastructure/persistence/relational/relational-persistence.module';

@Module({
  imports: [
    // import modules, etc.
    RelationalTenantPersistenceModule,
  ],
  controllers: [TenantsController],
  providers: [TenantsService],
  exports: [TenantsService, RelationalTenantPersistenceModule],
})
export class TenantsModule {}
