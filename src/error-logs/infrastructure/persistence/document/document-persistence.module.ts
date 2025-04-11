import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { LogsSchema, LogsSchemaClass } from './entities/logs.schema';
import { LogsRepository } from '../logs.repository';
import { LogsDocumentRepository } from './repositories/logs.repository';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: LogsSchemaClass.name, schema: LogsSchema },
    ]),
  ],
  providers: [
    {
      provide: LogsRepository,
      useClass: LogsDocumentRepository,
    },
  ],
  exports: [LogsRepository],
})
export class DocumentLogsPersistenceModule {}
