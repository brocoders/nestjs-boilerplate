import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LogsEntity } from './entities/logs.entity';
import { LogsRepository } from '../logs.repository';
import { LogsRelationalRepository } from './repositories/logs.repository';

@Module({
  imports: [TypeOrmModule.forFeature([LogsEntity])],
  providers: [
    {
      provide: LogsRepository,
      useClass: LogsRelationalRepository,
    },
  ],
  exports: [LogsRepository],
})
export class RelationalLogsPersistenceModule {}
