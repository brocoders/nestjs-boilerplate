import {
  // common
  Module,
} from '@nestjs/common';
import { ExemptionsService } from './exemptions.service';
import { ExemptionsController } from './exemptions.controller';
import { RelationalExemptionPersistenceModule } from './infrastructure/persistence/relational/relational-persistence.module';

@Module({
  imports: [
    // import modules, etc.
    RelationalExemptionPersistenceModule,
  ],
  controllers: [ExemptionsController],
  providers: [ExemptionsService],
  exports: [ExemptionsService, RelationalExemptionPersistenceModule],
})
export class ExemptionsModule {}
