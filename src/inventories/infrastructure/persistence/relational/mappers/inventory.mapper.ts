import { Inventory } from '../../../../domain/inventory';

import { InventoryEntity } from '../entities/inventory.entity';

export class InventoryMapper {
  static toDomain(raw: InventoryEntity): Inventory {
    const domainEntity = new Inventory();
    domainEntity.unitOfMeasure = raw.unitOfMeasure;

    domainEntity.materialType = raw.materialType;

    domainEntity.accountType = raw.accountType;

    domainEntity.salePrice = raw.salePrice;

    domainEntity.purchasePrice = raw.purchasePrice;

    domainEntity.quantity = raw.quantity;

    domainEntity.itemDescription = raw.itemDescription;

    domainEntity.itemName = raw.itemName;

    domainEntity.id = raw.id;
    domainEntity.createdAt = raw.createdAt;
    domainEntity.updatedAt = raw.updatedAt;

    return domainEntity;
  }

  static toPersistence(domainEntity: Inventory): InventoryEntity {
    const persistenceEntity = new InventoryEntity();
    persistenceEntity.unitOfMeasure = domainEntity.unitOfMeasure;

    persistenceEntity.materialType = domainEntity.materialType;

    persistenceEntity.accountType = domainEntity.accountType;

    persistenceEntity.salePrice = domainEntity.salePrice;

    persistenceEntity.purchasePrice = domainEntity.purchasePrice;

    persistenceEntity.quantity = domainEntity.quantity;

    persistenceEntity.itemDescription = domainEntity.itemDescription;

    persistenceEntity.itemName = domainEntity.itemName;

    if (domainEntity.id) {
      persistenceEntity.id = domainEntity.id;
    }
    persistenceEntity.createdAt = domainEntity.createdAt;
    persistenceEntity.updatedAt = domainEntity.updatedAt;

    return persistenceEntity;
  }
}
