import { Exemption } from '../../../../domain/exemption';

import { TenantMapper } from '../../../../../tenants/infrastructure/persistence/relational/mappers/tenant.mapper';

import { InvoiceMapper } from '../../../../../invoices/infrastructure/persistence/relational/mappers/invoice.mapper';

import { ResidenceMapper } from '../../../../../residences/infrastructure/persistence/relational/mappers/residence.mapper';

import { RegionMapper } from '../../../../../regions/infrastructure/persistence/relational/mappers/region.mapper';

import { UserMapper } from '../../../../../users/infrastructure/persistence/relational/mappers/user.mapper';

import { ExemptionEntity } from '../entities/exemption.entity';

export class ExemptionMapper {
  static toDomain(raw: ExemptionEntity): Exemption {
    const domainEntity = new Exemption();
    domainEntity.description = raw.description;

    if (raw.tenant) {
      domainEntity.tenant = TenantMapper.toDomain(raw.tenant);
    }

    if (raw.invoice) {
      domainEntity.invoice = InvoiceMapper.toDomain(raw.invoice);
    } else if (raw.invoice === null) {
      domainEntity.invoice = null;
    }

    if (raw.residence) {
      domainEntity.residence = ResidenceMapper.toDomain(raw.residence);
    } else if (raw.residence === null) {
      domainEntity.residence = null;
    }

    if (raw.region) {
      domainEntity.region = RegionMapper.toDomain(raw.region);
    } else if (raw.region === null) {
      domainEntity.region = null;
    }

    if (raw.customer) {
      domainEntity.customer = UserMapper.toDomain(raw.customer);
    } else if (raw.customer === null) {
      domainEntity.customer = null;
    }

    domainEntity.endDate = raw.endDate;

    domainEntity.startDate = raw.startDate;

    domainEntity.reason = raw.reason;

    domainEntity.id = raw.id;
    domainEntity.createdAt = raw.createdAt;
    domainEntity.updatedAt = raw.updatedAt;

    return domainEntity;
  }

  static toPersistence(domainEntity: Exemption): ExemptionEntity {
    const persistenceEntity = new ExemptionEntity();
    persistenceEntity.description = domainEntity.description;

    if (domainEntity.tenant) {
      persistenceEntity.tenant = TenantMapper.toPersistence(
        domainEntity.tenant,
      );
    }

    if (domainEntity.invoice) {
      persistenceEntity.invoice = InvoiceMapper.toPersistence(
        domainEntity.invoice,
      );
    } else if (domainEntity.invoice === null) {
      persistenceEntity.invoice = null;
    }

    if (domainEntity.residence) {
      persistenceEntity.residence = ResidenceMapper.toPersistence(
        domainEntity.residence,
      );
    } else if (domainEntity.residence === null) {
      persistenceEntity.residence = null;
    }

    if (domainEntity.region) {
      persistenceEntity.region = RegionMapper.toPersistence(
        domainEntity.region,
      );
    } else if (domainEntity.region === null) {
      persistenceEntity.region = null;
    }

    if (domainEntity.customer) {
      persistenceEntity.customer = UserMapper.toPersistence(
        domainEntity.customer,
      );
    } else if (domainEntity.customer === null) {
      persistenceEntity.customer = null;
    }

    persistenceEntity.endDate = domainEntity.endDate;

    persistenceEntity.startDate = domainEntity.startDate;

    persistenceEntity.reason = domainEntity.reason;

    if (domainEntity.id) {
      persistenceEntity.id = domainEntity.id;
    }
    persistenceEntity.createdAt = domainEntity.createdAt;
    persistenceEntity.updatedAt = domainEntity.updatedAt;

    return persistenceEntity;
  }
}
