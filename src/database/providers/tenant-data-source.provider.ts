import { DataSource } from 'typeorm';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';

export const TenantDataSourceProvider = {
  provide: DataSource,
  useFactory: (req: Request) => req['tenantDataSource'],
  inject: [REQUEST],
};
