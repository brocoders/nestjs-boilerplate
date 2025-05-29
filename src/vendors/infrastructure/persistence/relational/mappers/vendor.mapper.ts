import { Vendor } from '../../../../domain/vendor';
import { TenantMapper } from '../../../../../tenants/infrastructure/persistence/relational/mappers/tenant.mapper';

import { VendorBillMapper } from '../../../../../vendor-bills/infrastructure/persistence/relational/mappers/vendor-bill.mapper';

import { VendorEntity } from '../entities/vendor.entity';

export class VendorMapper {
  static toDomain(raw: VendorEntity): Vendor {
    const domainEntity = new Vendor();
    if (raw.tenant) {
      domainEntity.tenant = TenantMapper.toDomain(raw.tenant);
    }

    if (raw.bills) {
      domainEntity.bills = raw.bills.map((item) =>
        VendorBillMapper.toDomain(item),
      );
    } else if (raw.bills === null) {
      domainEntity.bills = null;
    }

    domainEntity.paymentTerms = raw.paymentTerms;

    domainEntity.contactEmail = raw.contactEmail;

    domainEntity.name = raw.name;

    domainEntity.id = raw.id;
    domainEntity.createdAt = raw.createdAt;
    domainEntity.updatedAt = raw.updatedAt;

    return domainEntity;
  }

  static toPersistence(domainEntity: Vendor): VendorEntity {
    const persistenceEntity = new VendorEntity();
    if (domainEntity.tenant) {
      persistenceEntity.tenant = TenantMapper.toPersistence(
        domainEntity.tenant,
      );
    }

    if (domainEntity.bills) {
      persistenceEntity.bills = domainEntity.bills.map((item) =>
        VendorBillMapper.toPersistence(item),
      );
    } else if (domainEntity.bills === null) {
      persistenceEntity.bills = null;
    }

    persistenceEntity.paymentTerms = domainEntity.paymentTerms;

    persistenceEntity.contactEmail = domainEntity.contactEmail;

    persistenceEntity.name = domainEntity.name;

    if (domainEntity.id) {
      persistenceEntity.id = domainEntity.id;
    }
    persistenceEntity.createdAt = domainEntity.createdAt;
    persistenceEntity.updatedAt = domainEntity.updatedAt;

    return persistenceEntity;
  }
}
