import {
  // common
  Module,
} from '@nestjs/common';
import { TenantTypesService } from './tenant-types.service';
import { TenantTypesController } from './tenant-types.controller';
import { RelationalTenantTypePersistenceModule } from './infrastructure/persistence/relational/relational-persistence.module';

@Module({
  imports: [
    // import modules, etc.
    RelationalTenantTypePersistenceModule,
  ],
  controllers: [TenantTypesController],
  providers: [TenantTypesService],
  exports: [TenantTypesService, RelationalTenantTypePersistenceModule],
})
export class TenantTypesModule {}
