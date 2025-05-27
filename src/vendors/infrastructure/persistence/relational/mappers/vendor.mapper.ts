import { Vendor } from '../../../../domain/vendor';
import { VendorEntity } from '../entities/vendor.entity';

export class VendorMapper {
  static toDomain(raw: VendorEntity): Vendor {
    const domainEntity = new Vendor();
    domainEntity.id = raw.id;
    domainEntity.createdAt = raw.createdAt;
    domainEntity.updatedAt = raw.updatedAt;

    return domainEntity;
  }

  static toPersistence(domainEntity: Vendor): VendorEntity {
    const persistenceEntity = new VendorEntity();
    if (domainEntity.id) {
      persistenceEntity.id = domainEntity.id;
    }
    persistenceEntity.createdAt = domainEntity.createdAt;
    persistenceEntity.updatedAt = domainEntity.updatedAt;

    return persistenceEntity;
  }
}
