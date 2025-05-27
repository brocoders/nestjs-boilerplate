import { Inventory } from '../../../../domain/inventory';
import { InventoryEntity } from '../entities/inventory.entity';

export class InventoryMapper {
  static toDomain(raw: InventoryEntity): Inventory {
    const domainEntity = new Inventory();
    domainEntity.id = raw.id;
    domainEntity.createdAt = raw.createdAt;
    domainEntity.updatedAt = raw.updatedAt;

    return domainEntity;
  }

  static toPersistence(domainEntity: Inventory): InventoryEntity {
    const persistenceEntity = new InventoryEntity();
    if (domainEntity.id) {
      persistenceEntity.id = domainEntity.id;
    }
    persistenceEntity.createdAt = domainEntity.createdAt;
    persistenceEntity.updatedAt = domainEntity.updatedAt;

    return persistenceEntity;
  }
}
