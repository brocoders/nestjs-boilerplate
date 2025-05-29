import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InventoryEntity } from '../../../../inventories/infrastructure/persistence/relational/entities/inventory.entity';
import { TenantEntity } from '../../../../tenants/infrastructure/persistence/relational/entities/tenant.entity';

@Injectable()
export class InventorySeedService {
  private readonly logger = new Logger(InventorySeedService.name);

  constructor(
    @InjectRepository(InventoryEntity)
    private readonly repository: Repository<InventoryEntity>,
    @InjectRepository(TenantEntity)
    private readonly tenantRepository: Repository<TenantEntity>,
  ) {}

  async run() {
    const tenants = await this.tenantRepository.find();

    if (!tenants.length) {
      this.logger.warn('No tenants found. Skipping inventory seeding.');
      return;
    }

    for (const tenant of tenants) {
      await this.seedInventoryForTenant(tenant);
    }
  }

  private async seedInventoryForTenant(tenant: TenantEntity) {
    const existingInventoryCount = await this.repository.count({
      where: { tenant: { id: tenant.id } },
    });

    if (existingInventoryCount > 0) {
      this.logger.log(`Inventory already exists for tenant: ${tenant.name}`);
      return;
    }

    const inventoryItems = this.getInventoryConfigurations(tenant);

    for (const item of inventoryItems) {
      const createdItem = await this.repository.save(
        this.repository.create(item),
      );
      this.logger.log(
        `Created inventory item '${createdItem.itemName}' for tenant: ${tenant.name}`,
      );
    }
  }

  private getInventoryConfigurations(
    tenant: TenantEntity,
  ): Partial<InventoryEntity>[] {
    return [
      // Recycling Materials
      {
        tenant,
        itemName: 'PET Plastic Bales',
        itemDescription: 'Compressed PET plastic ready for recycling',
        materialType: 'Plastic',
        unitOfMeasure: 'kg',
        quantity: 2500,
        purchasePrice: 5,
        salePrice: 100,
        accountType: 'Recyclable Materials',
      },
      {
        tenant,
        itemName: 'Sorted Aluminum Cans',
        itemDescription: 'Cleaned and sorted aluminum beverage cans',
        materialType: 'Metal',
        unitOfMeasure: 'kg',
        quantity: 1800,
        purchasePrice: 8,
        salePrice: 100,
        accountType: 'Recyclable Materials',
      },
      {
        tenant,
        itemName: 'Corrugated Cardboard',
        itemDescription: 'Baled OCC (Old Corrugated Containers)',
        materialType: 'Paper',
        unitOfMeasure: 'kg',
        quantity: 3200,
        purchasePrice: 3,
        salePrice: 100,
        accountType: 'Recyclable Materials',
      },

      // Waste Collection Equipment
      {
        tenant,
        itemName: '110L Wheelie Bins',
        itemDescription: 'Standard household waste bins',
        materialType: 'Plastic',
        unitOfMeasure: 'units',
        quantity: 500,
        purchasePrice: 25,
        salePrice: null,
        accountType: 'Fixed Assets',
      },
      {
        tenant,
        itemName: '240L Commercial Bins',
        itemDescription: 'Heavy-duty bins for commercial use',
        materialType: 'Plastic',
        unitOfMeasure: 'units',
        quantity: 200,
        purchasePrice: 45,
        salePrice: null,
        accountType: 'Fixed Assets',
      },
      {
        tenant,
        itemName: 'Waste Collection Truck Tires',
        itemDescription: 'Replacement tires for collection vehicles',
        materialType: 'Rubber',
        unitOfMeasure: 'units',
        quantity: 24,
        purchasePrice: 250,
        salePrice: null,
        accountType: 'Maintenance Supplies',
      },

      // Personal Protective Equipment
      {
        tenant,
        itemName: 'Safety Gloves',
        itemDescription: 'Heavy-duty gloves for waste handlers',
        materialType: 'Rubber',
        unitOfMeasure: 'pairs',
        quantity: 500,
        purchasePrice: 5,
        salePrice: null,
        accountType: 'Safety Equipment',
      },
      {
        tenant,
        itemName: 'High-Visibility Vests',
        itemDescription: 'Reflective safety vests for field staff',
        materialType: 'Polyester',
        unitOfMeasure: 'units',
        quantity: 200,
        purchasePrice: 8,
        salePrice: null,
        accountType: 'Safety Equipment',
      },

      // Consumables
      {
        tenant,
        itemName: 'Diesel Fuel',
        itemDescription: 'Fuel for waste collection vehicles',
        materialType: 'Petroleum',
        unitOfMeasure: 'liters',
        quantity: 5000,
        purchasePrice: 1,
        salePrice: null,
        accountType: 'Operating Supplies',
      },
      {
        tenant,
        itemName: 'Bin Liners',
        itemDescription: 'Heavy-duty plastic bags for bins',
        materialType: 'Plastic',
        unitOfMeasure: 'rolls',
        quantity: 300,
        purchasePrice: 12,
        salePrice: null,
        accountType: 'Operating Supplies',
      },
      {
        tenant,
        itemName: 'Sanitizing Solution',
        itemDescription: 'Concentrated cleaner for bin washing',
        materialType: 'Chemical',
        unitOfMeasure: 'liters',
        quantity: 400,
        purchasePrice: 8,
        salePrice: null,
        accountType: 'Cleaning Supplies',
      },

      // Compost Products
      {
        tenant,
        itemName: 'Organic Compost',
        itemDescription: 'Premium compost from food waste processing',
        materialType: 'Organic',
        unitOfMeasure: 'kg',
        quantity: 10000,
        purchasePrice: 1,
        salePrice: 1,
        accountType: 'Finished Goods',
      },
      {
        tenant,
        itemName: 'Vermicompost',
        itemDescription: 'Worm-processed organic fertilizer',
        materialType: 'Organic',
        unitOfMeasure: 'kg',
        quantity: 3000,
        purchasePrice: 1,
        salePrice: 2,
        accountType: 'Finished Goods',
      },
    ];
  }
}
