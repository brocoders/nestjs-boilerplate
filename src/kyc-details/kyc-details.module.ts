import { TenantsModule } from '../tenants/tenants.module';
import { UsersModule } from '../users/users.module';
import {
  // common
  Module,
  forwardRef,
} from '@nestjs/common';
import { KycDetailsService } from './kyc-details.service';
import { KycDetailsController } from './kyc-details.controller';
import { RelationalKycDetailsPersistenceModule } from './infrastructure/persistence/relational/relational-persistence.module';
import databaseConfig from '../database/config/database.config';
import { DatabaseConfig } from '../database/config/database-config.type';
import { DocumentKycDetailsPersistenceModule } from './infrastructure/persistence/document/document-persistence.module';

const infrastructurePersistenceModule = (databaseConfig() as DatabaseConfig)
  .isDocumentDatabase
  ? DocumentKycDetailsPersistenceModule
  : RelationalKycDetailsPersistenceModule;

@Module({
  imports: [
    forwardRef(() => TenantsModule),

    forwardRef(() => UsersModule),

    // import modules, etc.
    infrastructurePersistenceModule,
  ],
  controllers: [KycDetailsController],
  providers: [KycDetailsService],
  exports: [KycDetailsService, infrastructurePersistenceModule],
})
export class KycDetailsModule {}
