import { Injectable } from '@nestjs/common';
import { LoggerService } from './logger.service';
import { Logger as TypeOrmLogger, QueryRunner } from 'typeorm';
import { stringifyJson } from './logger.helper';

@Injectable()
export class LoggerTypeOrmService implements TypeOrmLogger {
  constructor(private readonly logger: LoggerService) {}

  logQuery(
    query: string,
    parameters?: any[],
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _queryRunner?: QueryRunner,
  ): void {
    this.logger.debug(
      stringifyJson({
        type: 'query',
        query,
        parameters: parameters?.length ? parameters : undefined,
      }),
      'TypeORM QUERY',
    );
  }

  logQueryError(
    error: string | Error,
    query: string,
    parameters?: any[],
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _queryRunner?: QueryRunner,
  ): void {
    this.logger.error(
      stringifyJson({
        type: 'query-error',
        error: typeof error === 'string' ? error : error.message,
        query,
        parameters: parameters?.length ? parameters : undefined,
      }),
      'TypeORM ERROR',
    );
  }

  logQuerySlow(
    time: number,
    query: string,
    parameters?: any[],
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _queryRunner?: QueryRunner,
  ): void {
    this.logger.warn(
      stringifyJson({
        type: 'slow-query',
        time,
        query,
        parameters: parameters?.length ? parameters : undefined,
      }),
      'TypeORM SLOW',
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  logSchemaBuild(message: string, _queryRunner?: QueryRunner): void {
    this.logger.log(
      stringifyJson({ type: 'schema-build', message }),
      'TypeORM SCHEMA',
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  logMigration(message: string, _queryRunner?: QueryRunner): void {
    this.logger.log(
      stringifyJson({ type: 'migration', message }),
      'TypeORM MIGRATION',
    );
  }

  log(
    level: 'log' | 'info' | 'warn',
    message: any,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _queryRunner?: QueryRunner,
  ): void {
    const formatted = stringifyJson({ type: level, message });

    switch (level) {
      case 'log':
      case 'info':
        this.logger.log(formatted, 'TypeORM INFO');
        break;
      case 'warn':
        this.logger.warn(formatted, 'TypeORM WARN');
        break;
    }
  }
}
