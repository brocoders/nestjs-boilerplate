import { RegionsModule } from '../regions/regions.module';
import { SettingsModule } from '../settings/settings.module';
import { KycDetailsModule } from '../kyc-details/kyc-details.module';
import { TenantsModule } from '../tenants/tenants.module';
import {
  // common
  Module,
  forwardRef,
} from '@nestjs/common';

import { UsersController } from './users.controller';

import { UsersService } from './users.service';
import { DocumentUserPersistenceModule } from './infrastructure/persistence/document/document-persistence.module';
import { RelationalUserPersistenceModule } from './infrastructure/persistence/relational/relational-persistence.module';
import { DatabaseConfig } from '../database/config/database-config.type';
import databaseConfig from '../database/config/database.config';
import { FilesModule } from '../files/files.module';

// <database-block>
const infrastructurePersistenceModule = (databaseConfig() as DatabaseConfig)
  .isDocumentDatabase
  ? DocumentUserPersistenceModule
  : RelationalUserPersistenceModule;
// </database-block>

@Module({
  imports: [
    RegionsModule,

    forwardRef(() => SettingsModule),

    forwardRef(() => KycDetailsModule),

    forwardRef(() => TenantsModule),

    // import modules, etc.
    infrastructurePersistenceModule,
    FilesModule,
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService, infrastructurePersistenceModule],
})
export class UsersModule {}
