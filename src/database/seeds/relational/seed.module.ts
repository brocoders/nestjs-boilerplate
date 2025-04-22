import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { DataSource, DataSourceOptions } from 'typeorm';
import { TypeOrmConfigService } from '../../typeorm-config.service';
import { RoleSeedModule } from './role/role-seed.module';
import { StatusSeedModule } from './status/status-seed.module';
import { UserSeedModule } from './user/user-seed.module';
import databaseConfig from '../../config/database.config';
import appConfig from '../../../config/app.config';

import { RegionSeedModule } from './region/region-seed.module';

import { TenantSeedModule } from './tenant/tenant-seed.module';

import { KycDetailSeedModule } from './kyc-detail/kyc-detail-seed.module';

import { SettingsSeedModule } from './settings/settings-seed.module';

import { TenantTypesSeedModule } from './tenant-types/tenant-types-seed.module';

@Module({
  imports: [
    TenantTypesSeedModule,
    TenantSeedModule,
    RoleSeedModule,
    StatusSeedModule,
    RegionSeedModule,
    KycDetailSeedModule,
    // SettingsSeedModule,
    //

    UserSeedModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig, appConfig],
      envFilePath: ['.env'],
    }),
    TypeOrmModule.forRootAsync({
      useClass: TypeOrmConfigService,
      dataSourceFactory: async (options: DataSourceOptions) => {
        return new DataSource(options).initialize();
      },
    }),
  ],
})
export class SeedModule {}
