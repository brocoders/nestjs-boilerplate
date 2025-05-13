import {
  // common
  Module,
} from '@nestjs/common';
import { TenantConfigsService } from './tenant-configs.service';
import { TenantConfigsController } from './tenant-configs.controller';
import { RelationalTenantConfigPersistenceModule } from './infrastructure/persistence/relational/relational-persistence.module';

@Module({
  imports: [
    // import modules, etc.
    RelationalTenantConfigPersistenceModule,
  ],
  controllers: [TenantConfigsController],
  providers: [TenantConfigsService],
  exports: [TenantConfigsService, RelationalTenantConfigPersistenceModule],
})
export class TenantConfigsModule {}
