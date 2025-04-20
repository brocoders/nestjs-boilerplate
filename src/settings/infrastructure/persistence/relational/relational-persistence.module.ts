import { Module } from '@nestjs/common';
import { SettingsRepository } from '../settings.repository';
import { SettingsRelationalRepository } from './repositories/settings.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SettingsEntity } from './entities/settings.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SettingsEntity])],
  providers: [
    {
      provide: SettingsRepository,
      useClass: SettingsRelationalRepository,
    },
  ],
  exports: [SettingsRepository],
})
export class RelationalSettingsPersistenceModule {}
