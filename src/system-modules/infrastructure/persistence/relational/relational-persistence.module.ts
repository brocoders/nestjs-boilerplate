import { Module } from '@nestjs/common';
import { SystemModuleRepository } from '../system-module.repository';
import { SystemModuleRelationalRepository } from './repositories/system-module.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SystemModuleEntity } from './entities/system-module.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SystemModuleEntity])],
  providers: [
    {
      provide: SystemModuleRepository,
      useClass: SystemModuleRelationalRepository,
    },
  ],
  exports: [SystemModuleRepository],
})
export class RelationalSystemModulePersistenceModule {}
