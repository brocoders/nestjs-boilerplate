import { UsersModule } from '../users/users.module';
import { TenantsModule } from '../tenants/tenants.module';

import {
  // common
  Module,
} from '@nestjs/common';
import { AuditLogsService } from './audit-logs.service';
import { AuditLogsController } from './audit-logs.controller';
import { RelationalAuditLogPersistenceModule } from './infrastructure/persistence/relational/relational-persistence.module';

@Module({
  imports: [
    UsersModule,

    TenantsModule,

    // import modules, etc.
    RelationalAuditLogPersistenceModule,
  ],
  controllers: [AuditLogsController],
  providers: [AuditLogsService],
  exports: [AuditLogsService, RelationalAuditLogPersistenceModule],
})
export class AuditLogsModule {}
