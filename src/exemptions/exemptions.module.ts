import { InvoicesModule } from '../invoices/invoices.module';
import { ResidencesModule } from '../residences/residences.module';
import { RegionsModule } from '../regions/regions.module';
import { UsersModule } from '../users/users.module';
import {
  forwardRef,
  // common
  Module,
} from '@nestjs/common';
import { ExemptionsService } from './exemptions.service';
import { ExemptionsController } from './exemptions.controller';
import { RelationalExemptionPersistenceModule } from './infrastructure/persistence/relational/relational-persistence.module';

@Module({
  imports: [
    forwardRef(() => InvoicesModule),

    ResidencesModule,

    RegionsModule,

    UsersModule,

    // import modules, etc.
    RelationalExemptionPersistenceModule,
  ],
  controllers: [ExemptionsController],
  providers: [ExemptionsService],
  exports: [ExemptionsService, RelationalExemptionPersistenceModule],
})
export class ExemptionsModule {}
