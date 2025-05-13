import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SettingsEntity } from '../../../../settings/infrastructure/persistence/relational/entities/settings.entity';
import { SettingsSeedService } from './settings-seed.service';
import { UserEntity } from 'src/users/infrastructure/persistence/relational/entities/user.entity';
import { TenantEntity } from 'src/tenants/infrastructure/persistence/relational/entities/tenant.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([SettingsEntity, UserEntity, TenantEntity]),
  ],
  providers: [SettingsSeedService],
  exports: [SettingsSeedService],
})
export class SettingsSeedModule {}
