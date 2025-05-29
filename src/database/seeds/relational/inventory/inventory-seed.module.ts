import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InventoryEntity } from '../../../../inventories/infrastructure/persistence/relational/entities/inventory.entity';
import { TenantEntity } from '../../../../tenants/infrastructure/persistence/relational/entities/tenant.entity';
import { InventorySeedService } from './inventory-seed.service';

@Module({
  imports: [TypeOrmModule.forFeature([InventoryEntity, TenantEntity])],
  providers: [InventorySeedService],
  exports: [InventorySeedService],
})
export class InventorySeedModule {}
