import { Injectable, Optional } from '@nestjs/common';
import { HealthIndicator, HealthIndicatorResult } from '@nestjs/terminus';
import { DataSource } from 'typeorm';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';

@Injectable()
export class DatabaseHealthIndicator extends HealthIndicator {
  constructor(
    @Optional()
    private dataSource?: DataSource,
    @Optional()
    @InjectConnection()
    private connection?: Connection,
  ) {
    super();
  }

  async pingCheck(key: string): Promise<HealthIndicatorResult> {
    if (this.dataSource) {
      try {
        await this.dataSource.query('SELECT 1');
        return this.getStatus(key, true);
      } catch (e) {
        return this.getStatus(key, false, {
          message: (e as Error).message,
        });
      }
    }

    if (this.connection) {
      const state = this.connection.readyState;
      return this.getStatus(key, state === 1, {
        state,
      });
    }

    return this.getStatus(key, false, {
      message: 'No database connection available',
    });
  }
}
