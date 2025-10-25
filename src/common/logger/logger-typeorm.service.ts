/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from '@nestjs/common';
import { Logger as TypeOrmLogger, QueryRunner, LogLevel } from 'typeorm';
import { LoggerService } from './logger.service';
import { stringifyJson } from './utils/logger.helper';

@Injectable()
export class LoggerTypeOrmService implements TypeOrmLogger {
  constructor(private readonly logger: LoggerService) {}

  logQuery(
    query: string,
    parameters?: any[],
    _queryRunner?: QueryRunner,
  ): void {
    const msg = stringifyJson({
      type: 'query',
      query,
      parameters: parameters?.length ? parameters : undefined,
    });
    this.logger.debug(msg, 'TypeORM::QUERY');
  }

  logQueryError(
    error: string | Error,
    query: string,
    parameters?: any[],
    _queryRunner?: QueryRunner,
  ): void {
    const msg = stringifyJson({
      type: 'query-error',
      error: typeof error === 'string' ? error : error.message,
      query,
      parameters: parameters?.length ? parameters : undefined,
    });
    this.logger.error(msg, undefined, 'TypeORM::ERROR');
  }

  logQuerySlow(
    time: number,
    query: string,
    parameters?: any[],
    _queryRunner?: QueryRunner,
  ): void {
    const msg = stringifyJson({
      type: 'slow-query',
      time,
      query,
      parameters: parameters?.length ? parameters : undefined,
    });
    this.logger.warn(msg, 'TypeORM::SLOW');
  }

  logSchemaBuild(message: string, _queryRunner?: QueryRunner): void {
    const msg = stringifyJson({
      type: 'schema-build',
      message,
    });
    this.logger.log(msg, 'TypeORM::SCHEMA');
  }

  logMigration(message: string, _queryRunner?: QueryRunner): void {
    const msg = stringifyJson({
      type: 'migration',
      message,
    });
    this.logger.log(msg, 'TypeORM::MIGRATION');
  }

  log(level: LogLevel, message: any, _queryRunner?: QueryRunner): void {
    const msg = stringifyJson({ type: level, message });

    switch (level) {
      case 'log':
      case 'info':
        this.logger.log(msg, 'TypeORM::INFO');
        break;
      case 'warn':
        this.logger.warn(msg, 'TypeORM::WARN');
        break;
    }
  }
}
