import { Injectable } from '@nestjs/common';
import { LogsRepository } from '../../logs.repository';
import { LogsSchemaClass } from '../entities/logs.schema'; // Assuming this is where your entity class is defined
import { Logs } from '@/error-logs/domain/logs';
import { LogsMapper } from '../mappers/logs.mapper';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class LogsDocumentRepository implements LogsRepository {
  constructor(
    @InjectModel(LogsSchemaClass.name)
    private readonly logsModel: Model<LogsSchemaClass>,
  ) {}

  async create(data: Logs): Promise<Logs> {
    const persistenceModel = LogsMapper.toPersistence(data);
    const createdLog = new this.logsModel(persistenceModel);
    const logObject = await createdLog.save();
    return LogsMapper.toDomain(logObject);
  }
}
