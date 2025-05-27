import {
  // common
  Module,
} from '@nestjs/common';
import { InventoriesService } from './inventories.service';
import { InventoriesController } from './inventories.controller';
import { RelationalInventoryPersistenceModule } from './infrastructure/persistence/relational/relational-persistence.module';

@Module({
  imports: [
    // import modules, etc.
    RelationalInventoryPersistenceModule,
  ],
  controllers: [InventoriesController],
  providers: [InventoriesService],
  exports: [InventoriesService, RelationalInventoryPersistenceModule],
})
export class InventoriesModule {}
