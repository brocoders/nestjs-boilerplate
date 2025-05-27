import { Exemption } from '../../../../domain/exemption';
import { ExemptionEntity } from '../entities/exemption.entity';

export class ExemptionMapper {
  static toDomain(raw: ExemptionEntity): Exemption {
    const domainEntity = new Exemption();
    domainEntity.id = raw.id;
    domainEntity.createdAt = raw.createdAt;
    domainEntity.updatedAt = raw.updatedAt;

    return domainEntity;
  }

  static toPersistence(domainEntity: Exemption): ExemptionEntity {
    const persistenceEntity = new ExemptionEntity();
    if (domainEntity.id) {
      persistenceEntity.id = domainEntity.id;
    }
    persistenceEntity.createdAt = domainEntity.createdAt;
    persistenceEntity.updatedAt = domainEntity.updatedAt;

    return persistenceEntity;
  }
}
