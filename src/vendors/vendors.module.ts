import { Module } from '@nestjs/common';
import { VendorPublicController } from './vendor-public.controller';
import { VendorSelfController } from './vendor-self.controller';
import { VendorAdminController } from './vendor-admin.controller';
import { VendorsService } from './vendors.service';
import { RelationalVendorPersistenceModule } from './infrastructure/persistence/relational/relational-persistence.module';
import { UsersModule } from '../users/users.module';
import { RegionsModule } from '../regions/regions.module';
import { SettingsModule } from '../settings/settings.module';

@Module({
  imports: [
    RelationalVendorPersistenceModule,
    UsersModule,
    RegionsModule,
    SettingsModule,
  ],
  controllers: [
    VendorPublicController,
    VendorSelfController,
    VendorAdminController,
  ],
  providers: [VendorsService],
  exports: [VendorsService],
})
export class VendorsModule {}
