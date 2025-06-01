import { TenantsModule } from '../tenants/tenants.module';
import {
  // common
  Module,
  forwardRef,
} from '@nestjs/common';
import { RegionsService } from './regions.service';
import { RegionsController } from './regions.controller';
import { RelationalRegionPersistenceModule } from './infrastructure/persistence/relational/relational-persistence.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    forwardRef(() => TenantsModule),
    forwardRef(() => UsersModule),
    // import modules, etc.
    RelationalRegionPersistenceModule,
  ],
  controllers: [RegionsController],
  providers: [RegionsService],
  exports: [RegionsService, RelationalRegionPersistenceModule],
})
export class RegionsModule {}
