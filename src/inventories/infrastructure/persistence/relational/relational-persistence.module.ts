import { Module } from '@nestjs/common';
import { InventoryRepository } from '../inventory.repository';
import { InventoryRelationalRepository } from './repositories/inventory.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InventoryEntity } from './entities/inventory.entity';

@Module({
  imports: [TypeOrmModule.forFeature([InventoryEntity])],
  providers: [
    {
      provide: InventoryRepository,
      useClass: InventoryRelationalRepository,
    },
  ],
  exports: [InventoryRepository],
})
export class RelationalInventoryPersistenceModule {}
