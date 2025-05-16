import { UsersModule } from '../users/users.module';
import { RegionsModule } from '../regions/regions.module';
import { TenantsModule } from '../tenants/tenants.module';
import {
  // common
  Module,
} from '@nestjs/common';
import { ResidencesService } from './residences.service';
import { ResidencesController } from './residences.controller';
import { RelationalResidencePersistenceModule } from './infrastructure/persistence/relational/relational-persistence.module';

@Module({
  imports: [
    UsersModule,

    RegionsModule,

    TenantsModule,

    // import modules, etc.
    RelationalResidencePersistenceModule,
  ],
  controllers: [ResidencesController],
  providers: [ResidencesService],
  exports: [ResidencesService, RelationalResidencePersistenceModule],
})
export class ResidencesModule {}
