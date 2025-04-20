import { TenantsModule } from '../tenants/tenants.module';
import { UsersModule } from '../users/users.module';
import {
  // common
  Module,
  forwardRef,
} from '@nestjs/common';
import { SettingsService } from './settings.service';
import { SettingsController } from './settings.controller';
import { RelationalSettingsPersistenceModule } from './infrastructure/persistence/relational/relational-persistence.module';

@Module({
  imports: [
    forwardRef(() => TenantsModule),

    forwardRef(() => UsersModule),

    // import modules, etc.
    RelationalSettingsPersistenceModule,
  ],
  controllers: [SettingsController],
  providers: [SettingsService],
  exports: [SettingsService, RelationalSettingsPersistenceModule],
})
export class SettingsModule {}
