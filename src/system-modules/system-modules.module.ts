import {
  // common
  Module,
} from '@nestjs/common';
import { SystemModulesService } from './system-modules.service';
import { SystemModulesController } from './system-modules.controller';
import { RelationalSystemModulePersistenceModule } from './infrastructure/persistence/relational/relational-persistence.module';

@Module({
  imports: [
    // import modules, etc.
    RelationalSystemModulePersistenceModule,
  ],
  controllers: [SystemModulesController],
  providers: [SystemModulesService],
  exports: [SystemModulesService, RelationalSystemModulePersistenceModule],
})
export class SystemModulesModule {}
