import { Discount } from '../../../../domain/discount';
import { DiscountEntity } from '../entities/discount.entity';

export class DiscountMapper {
  static toDomain(raw: DiscountEntity): Discount {
    const domainEntity = new Discount();
    domainEntity.id = raw.id;
    domainEntity.createdAt = raw.createdAt;
    domainEntity.updatedAt = raw.updatedAt;

    return domainEntity;
  }

  static toPersistence(domainEntity: Discount): DiscountEntity {
    const persistenceEntity = new DiscountEntity();
    if (domainEntity.id) {
      persistenceEntity.id = domainEntity.id;
    }
    persistenceEntity.createdAt = domainEntity.createdAt;
    persistenceEntity.updatedAt = domainEntity.updatedAt;

    return persistenceEntity;
  }
}
