import { Settings } from '../../../../domain/settings';

import { TenantMapper } from '../../../../../tenants/infrastructure/persistence/relational/mappers/tenant.mapper';

import { UserMapper } from '../../../../../users/infrastructure/persistence/relational/mappers/user.mapper';

import {
  SettingsEntity,
  SettingsSubjectType,
  SettingsType,
} from '../entities/settings.entity';

export class SettingsMapper {
  static toDomain(raw: SettingsEntity): Settings {
    const domainEntity = new Settings();
    if (raw.tenant) {
      domainEntity.tenant = TenantMapper.toDomain(raw.tenant);
    }

    domainEntity.config = raw.config;

    domainEntity.settingsType = raw.settingsType;

    domainEntity.subjectType = raw.subjectType;

    domainEntity.subjectType = raw.subjectType;

    if (raw.tenant) {
      domainEntity.tenant = TenantMapper.toDomain(raw.tenant);
    }

    if (raw.user) {
      domainEntity.user = UserMapper.toDomain(raw.user);
    }

    domainEntity.id = raw.id;
    domainEntity.createdAt = raw.createdAt;
    domainEntity.updatedAt = raw.updatedAt;

    return domainEntity;
  }

  static toPersistence(domainEntity: Settings): SettingsEntity {
    const persistenceEntity = new SettingsEntity();
    if (domainEntity.tenant) {
      persistenceEntity.tenant = TenantMapper.toPersistence(
        domainEntity.tenant,
      );
    }

    if (domainEntity.config) {
      persistenceEntity.config = domainEntity.config;
    }

    persistenceEntity.settingsType = domainEntity.settingsType as SettingsType;

    persistenceEntity.subjectType =
      domainEntity.subjectType as SettingsSubjectType;

    if (domainEntity.tenant) {
      persistenceEntity.tenant = TenantMapper.toPersistence(
        domainEntity.tenant,
      );
    }

    if (domainEntity.user) {
      persistenceEntity.user = UserMapper.toPersistence(domainEntity.user);
    }

    if (domainEntity.id) {
      persistenceEntity.id = domainEntity.id;
    }
    persistenceEntity.createdAt = domainEntity.createdAt;
    persistenceEntity.updatedAt = domainEntity.updatedAt;

    return persistenceEntity;
  }
}
