import { Module } from '@nestjs/common';
import databaseConfig from '@/database/config/database.config';
import { DatabaseConfig } from '@/database/config/database-config.type';
import { LogService } from './logs.service';
import { RelationalLogsPersistenceModule } from './infrastructure/persistence/relational/relational-persistence.module';
import { DocumentLogsPersistenceModule } from './infrastructure/persistence/document/document-persistence.module';


const infrastructurePersistenceModule = (databaseConfig() as DatabaseConfig)
  .isDocumentDatabase
  ? DocumentLogsPersistenceModule
  : RelationalLogsPersistenceModule;

@Module({
  imports: [infrastructurePersistenceModule],
  providers: [LogService],
  exports: [LogService, infrastructurePersistenceModule],
})

export class LogsModule {}