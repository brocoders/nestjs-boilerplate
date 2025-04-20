import { FilesModule } from '../files/files.module';
import { TenantTypesModule } from '../tenant-types/tenant-types.module';
import { KycDetailsModule } from '../kyc-details/kyc-details.module';
import { UsersModule } from '../users/users.module';
import {
  // common
  Module,
  forwardRef,
} from '@nestjs/common';
import { TenantsService } from './tenants.service';
import { TenantsController } from './tenants.controller';
import { RelationalTenantPersistenceModule } from './infrastructure/persistence/relational/relational-persistence.module';

@Module({
  imports: [
    FilesModule,

    TenantTypesModule,

    forwardRef(() => KycDetailsModule),

    forwardRef(() => UsersModule),

    // import modules, etc.
    RelationalTenantPersistenceModule,
  ],
  controllers: [TenantsController],
  providers: [TenantsService],
  exports: [TenantsService, RelationalTenantPersistenceModule],
})
export class TenantsModule {}
