import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SettingsEntity } from '../../../../settings/infrastructure/persistence/relational/entities/settings.entity';
import { SettingsSeedService } from './settings-seed.service';

@Module({
  imports: [TypeOrmModule.forFeature([SettingsEntity])],
  providers: [SettingsSeedService],
  exports: [SettingsSeedService],
})
export class SettingsSeedModule {}
