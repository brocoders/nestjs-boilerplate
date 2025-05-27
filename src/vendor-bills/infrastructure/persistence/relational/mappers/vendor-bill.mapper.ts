import { VendorBill } from '../../../../domain/vendor-bill';
import { VendorBillEntity } from '../entities/vendor-bill.entity';

export class VendorBillMapper {
  static toDomain(raw: VendorBillEntity): VendorBill {
    const domainEntity = new VendorBill();
    domainEntity.id = raw.id;
    domainEntity.createdAt = raw.createdAt;
    domainEntity.updatedAt = raw.updatedAt;

    return domainEntity;
  }

  static toPersistence(domainEntity: VendorBill): VendorBillEntity {
    const persistenceEntity = new VendorBillEntity();
    if (domainEntity.id) {
      persistenceEntity.id = domainEntity.id;
    }
    persistenceEntity.createdAt = domainEntity.createdAt;
    persistenceEntity.updatedAt = domainEntity.updatedAt;

    return persistenceEntity;
  }
}
