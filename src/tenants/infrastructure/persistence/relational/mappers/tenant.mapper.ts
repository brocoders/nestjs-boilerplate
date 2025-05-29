import { Tenant } from '../../../../domain/tenant';

import { RegionMapper } from '../../../../../regions/infrastructure/persistence/relational/mappers/region.mapper';

import { SettingsMapper } from '../../../../../settings/infrastructure/persistence/relational/mappers/settings.mapper';

import { FileMapper } from '../../../../../files/infrastructure/persistence/relational/mappers/file.mapper';

import { TenantTypeMapper } from '../../../../../tenant-types/infrastructure/persistence/relational/mappers/tenant-type.mapper';

import { KycDetailsMapper } from '../../../../../kyc-details/infrastructure/persistence/relational/mappers/kyc-details.mapper';

import { UserMapper } from '../../../../../users/infrastructure/persistence/relational/mappers/user.mapper';

import { TenantEntity } from '../entities/tenant.entity';

export class TenantMapper {
  static toDomain(raw: TenantEntity): Tenant {
    const domainEntity = new Tenant();
    domainEntity.fullyOnboarded = raw.fullyOnboarded;

    domainEntity.databaseConfig = JSON.stringify(raw.databaseConfig);

    domainEntity.domain = raw.domain;

    if (raw.regions) {
      domainEntity.regions = raw.regions.map((item) =>
        RegionMapper.toDomain(item),
      );
    } else if (raw.regions === null) {
      domainEntity.regions = null;
    }

    if (raw.settings) {
      domainEntity.settings = raw.settings.map((item) =>
        SettingsMapper.toDomain(item),
      );
    } else if (raw.settings === null) {
      domainEntity.settings = null;
    }

    domainEntity.schemaName = raw.schemaName;

    if (raw.logo) {
      domainEntity.logo = FileMapper.toDomain(raw.logo);
    } else if (raw.logo === null) {
      domainEntity.logo = null;
    }

    domainEntity.address = raw.address;

    domainEntity.primaryPhone = raw.primaryPhone;

    domainEntity.primaryEmail = raw.primaryEmail;

    domainEntity.name = raw.name;

    if (raw.type) {
      domainEntity.type = TenantTypeMapper.toDomain(raw.type);
    } else if (raw.type === null) {
      domainEntity.type = null;
    }

    if (raw.kycSubmissions) {
      domainEntity.kycSubmissions = raw.kycSubmissions.map((item) =>
        KycDetailsMapper.toDomain(item),
      );
    } else if (raw.kycSubmissions === null) {
      domainEntity.kycSubmissions = null;
    }

    if (raw.users) {
      domainEntity.users = raw.users.map((item) => UserMapper.toDomain(item));
    } else if (raw.users === null) {
      domainEntity.users = null;
    }

    domainEntity.isActive = raw.isActive;

    domainEntity.id = raw.id;
    domainEntity.createdAt = raw.createdAt;
    domainEntity.updatedAt = raw.updatedAt;

    return domainEntity;
  }

  static toPersistence(domainEntity: Tenant): TenantEntity {
    const persistenceEntity = new TenantEntity();
    persistenceEntity.fullyOnboarded = domainEntity.fullyOnboarded;

    persistenceEntity.databaseConfig = domainEntity.databaseConfig
      ? JSON.parse(domainEntity.databaseConfig)
      : undefined;

    persistenceEntity.domain = domainEntity.domain;

    if (domainEntity.regions) {
      persistenceEntity.regions = domainEntity.regions.map((item) =>
        RegionMapper.toPersistence(item),
      );
    } else if (domainEntity.regions === null) {
      persistenceEntity.regions = null;
    }

    if (domainEntity.settings) {
      persistenceEntity.settings = domainEntity.settings.map((item) =>
        SettingsMapper.toPersistence(item),
      );
    } else if (domainEntity.settings === null) {
      persistenceEntity.settings = null;
    }

    persistenceEntity.schemaName = domainEntity.schemaName;

    if (domainEntity.logo) {
      persistenceEntity.logo = FileMapper.toPersistence(domainEntity.logo);
    } else if (domainEntity.logo === null) {
      persistenceEntity.logo = null;
    }

    persistenceEntity.address = domainEntity.address;

    persistenceEntity.primaryPhone = domainEntity.primaryPhone;

    persistenceEntity.primaryEmail = domainEntity.primaryEmail;

    persistenceEntity.name = domainEntity.name;

    if (domainEntity.type) {
      persistenceEntity.type = TenantTypeMapper.toPersistence(
        domainEntity.type,
      );
    } else if (domainEntity.type === null) {
      persistenceEntity.type = null;
    }

    if (domainEntity.kycSubmissions) {
      persistenceEntity.kycSubmissions = domainEntity.kycSubmissions.map(
        (item) => KycDetailsMapper.toPersistence(item),
      );
    } else if (domainEntity.kycSubmissions === null) {
      persistenceEntity.kycSubmissions = null;
    }

    if (domainEntity.users) {
      persistenceEntity.users = domainEntity.users.map((item) =>
        UserMapper.toPersistence(item),
      );
    } else if (domainEntity.users === null) {
      persistenceEntity.users = null;
    }

    persistenceEntity.isActive = domainEntity.isActive;

    if (domainEntity.id) {
      persistenceEntity.id = domainEntity.id;
    }
    persistenceEntity.createdAt = domainEntity.createdAt;
    persistenceEntity.updatedAt = domainEntity.updatedAt;

    return persistenceEntity;
  }
}
