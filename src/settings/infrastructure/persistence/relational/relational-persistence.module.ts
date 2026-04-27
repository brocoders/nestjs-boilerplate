import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SettingAbstractRepository } from '../setting.abstract.repository';
import { SettingEntity } from './entities/setting.entity';
import { SettingRelationalRepository } from './repositories/setting.repository';

@Module({
  imports: [TypeOrmModule.forFeature([SettingEntity])],
  providers: [
    {
      provide: SettingAbstractRepository,
      useClass: SettingRelationalRepository,
    },
  ],
  exports: [SettingAbstractRepository],
})
export class RelationalSettingPersistenceModule {}
