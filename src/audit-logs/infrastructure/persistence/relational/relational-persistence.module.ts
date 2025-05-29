import { Module } from '@nestjs/common';
import { AuditLogRepository } from '../audit-log.repository';
import { AuditLogRelationalRepository } from './repositories/audit-log.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuditLogEntity } from './entities/audit-log.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AuditLogEntity])],
  providers: [
    {
      provide: AuditLogRepository,
      useClass: AuditLogRelationalRepository,
    },
  ],
  exports: [AuditLogRepository],
})
export class RelationalAuditLogPersistenceModule {}
