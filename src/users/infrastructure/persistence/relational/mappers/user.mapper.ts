import { FileEntity } from '../../../../../files/infrastructure/persistence/relational/entities/file.entity';

import { RegionMapper } from '../../../../../regions/infrastructure/persistence/relational/mappers/region.mapper';

import { SettingsMapper } from '../../../../../settings/infrastructure/persistence/relational/mappers/settings.mapper';

import { KycDetailsMapper } from '../../../../../kyc-details/infrastructure/persistence/relational/mappers/kyc-details.mapper';

import { TenantMapper } from '../../../../../tenants/infrastructure/persistence/relational/mappers/tenant.mapper';

import { FileMapper } from '../../../../../files/infrastructure/persistence/relational/mappers/file.mapper';
import { RoleEntity } from '../../../../../roles/infrastructure/persistence/relational/entities/role.entity';
import { StatusEntity } from '../../../../../statuses/infrastructure/persistence/relational/entities/status.entity';
import { User } from '../../../../domain/user';
import { UserEntity } from '../entities/user.entity';

export class UserMapper {
  static toDomain(raw: UserEntity): User {
    const domainEntity = new User();
    domainEntity.phoneNumber = raw.phoneNumber;

    domainEntity.countryCode = raw.countryCode;

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

    if (raw.kycSubmissions) {
      domainEntity.kycSubmissions = raw.kycSubmissions.map((item) =>
        KycDetailsMapper.toDomain(item),
      );
    } else if (raw.kycSubmissions === null) {
      domainEntity.kycSubmissions = null;
    }

    if (raw.tenant) {
      domainEntity.tenant = TenantMapper.toDomain(raw.tenant);
    }

    domainEntity.id = raw.id;
    domainEntity.email = raw.email;
    domainEntity.password = raw.password;
    domainEntity.provider = raw.provider;
    domainEntity.socialId = raw.socialId;
    domainEntity.firstName = raw.firstName;
    domainEntity.lastName = raw.lastName;
    if (raw.photo) {
      domainEntity.photo = FileMapper.toDomain(raw.photo);
    }
    if (raw.role) {
      domainEntity.role = {
        ...raw.role,
        tenant: raw.role.tenant
          ? TenantMapper.toDomain(raw.role.tenant)
          : undefined,
      };
    }
    domainEntity.status = raw.status;
    domainEntity.createdAt = raw.createdAt;
    domainEntity.updatedAt = raw.updatedAt;
    domainEntity.deletedAt = raw.deletedAt;
    return domainEntity;
  }

  static toPersistence(domainEntity: User): UserEntity {
    let role: RoleEntity | undefined = undefined;

    if (domainEntity.role) {
      role = new RoleEntity();
      role.id = Number(domainEntity.role.id);
      if (domainEntity.role.tenant) {
        role.tenant = TenantMapper.toPersistence(domainEntity.role.tenant);
      }
    }

    let photo: FileEntity | undefined | null = undefined;

    if (domainEntity.photo) {
      photo = new FileEntity();
      photo.id = domainEntity.photo.id;
      photo.path = domainEntity.photo.path;
    } else if (domainEntity.photo === null) {
      photo = null;
    }

    let status: StatusEntity | undefined = undefined;

    if (domainEntity.status) {
      status = new StatusEntity();
      status.id = Number(domainEntity.status.id);
    }

    const persistenceEntity = new UserEntity();
    persistenceEntity.phoneNumber = domainEntity.phoneNumber;

    persistenceEntity.countryCode = domainEntity.countryCode;

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

    if (domainEntity.kycSubmissions) {
      persistenceEntity.kycSubmissions = domainEntity.kycSubmissions.map(
        (item) => KycDetailsMapper.toPersistence(item),
      );
    } else if (domainEntity.kycSubmissions === null) {
      persistenceEntity.kycSubmissions = null;
    }

    if (domainEntity.tenant) {
      persistenceEntity.tenant = TenantMapper.toPersistence(
        domainEntity.tenant,
      );
    }

    if (domainEntity.id && typeof domainEntity.id === 'number') {
      persistenceEntity.id = domainEntity.id;
    }
    persistenceEntity.email = domainEntity.email;
    persistenceEntity.password = domainEntity.password;
    persistenceEntity.provider = domainEntity.provider;
    persistenceEntity.socialId = domainEntity.socialId;
    persistenceEntity.firstName = domainEntity.firstName;
    persistenceEntity.lastName = domainEntity.lastName;
    persistenceEntity.photo = photo;
    persistenceEntity.role = role;
    persistenceEntity.status = status;
    persistenceEntity.createdAt = domainEntity.createdAt;
    persistenceEntity.updatedAt = domainEntity.updatedAt;
    persistenceEntity.deletedAt = domainEntity.deletedAt;
    return persistenceEntity;
  }
}
