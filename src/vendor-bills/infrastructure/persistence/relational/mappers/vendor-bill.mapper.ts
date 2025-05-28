import { VendorBill } from '../../../../domain/vendor-bill';
import { AccountsPayableMapper } from '../../../../../accounts-payables/infrastructure/persistence/relational/mappers/accounts-payable.mapper';

import { VendorMapper } from '../../../../../vendors/infrastructure/persistence/relational/mappers/vendor.mapper';

import { VendorBillEntity } from '../entities/vendor-bill.entity';

export class VendorBillMapper {
  static toDomain(raw: VendorBillEntity): VendorBill {
    const domainEntity = new VendorBill();
    if (raw.accountsPayable) {
      domainEntity.accountsPayable = AccountsPayableMapper.toDomain(
        raw.accountsPayable,
      );
    } else if (raw.accountsPayable === null) {
      domainEntity.accountsPayable = null;
    }

    if (raw.vendor) {
      domainEntity.vendor = VendorMapper.toDomain(raw.vendor);
    }

    domainEntity.id = raw.id;
    domainEntity.createdAt = raw.createdAt;
    domainEntity.updatedAt = raw.updatedAt;

    return domainEntity;
  }

  static toPersistence(domainEntity: VendorBill): VendorBillEntity {
    const persistenceEntity = new VendorBillEntity();
    if (domainEntity.accountsPayable) {
      persistenceEntity.accountsPayable = AccountsPayableMapper.toPersistence(
        domainEntity.accountsPayable,
      );
    } else if (domainEntity.accountsPayable === null) {
      persistenceEntity.accountsPayable = null;
    }

    if (domainEntity.vendor) {
      persistenceEntity.vendor = VendorMapper.toPersistence(
        domainEntity.vendor,
      );
    }

    if (domainEntity.id) {
      persistenceEntity.id = domainEntity.id;
    }
    persistenceEntity.createdAt = domainEntity.createdAt;
    persistenceEntity.updatedAt = domainEntity.updatedAt;

    return persistenceEntity;
  }
}
