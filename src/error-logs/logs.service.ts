// error-logger.service.ts
import { Injectable } from '@nestjs/common';
import { Logs } from './domain/logs';
import { LogsRepository } from './infrastructure/persistence/logs.repository';

@Injectable()
export class LogService {
  constructor(    
    private readonly logsRepository: LogsRepository,
  ) {}

  async logError(path: string, message: JSON, stack: JSON, method: string, status: number, payload?: JSON): Promise<Logs> {
    return await this.logsRepository.create({
        path,
        message,
        stack,
        method,
        status,
        payload
      })
  }
}
