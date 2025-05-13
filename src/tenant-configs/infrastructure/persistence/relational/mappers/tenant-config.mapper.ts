import { TenantConfig } from '../../../../domain/tenant-config';

import { TenantConfigEntity } from '../entities/tenant-config.entity';

export class TenantConfigMapper {
  static toDomain(raw: TenantConfigEntity): TenantConfig {
    const domainEntity = new TenantConfig();
    domainEntity.value = raw.value;

    domainEntity.key = raw.key;

    domainEntity.tenantId = raw.tenantId;

    domainEntity.id = raw.id;
    domainEntity.createdAt = raw.createdAt;
    domainEntity.updatedAt = raw.updatedAt;

    return domainEntity;
  }

  static toPersistence(domainEntity: TenantConfig): TenantConfigEntity {
    const persistenceEntity = new TenantConfigEntity();
    persistenceEntity.value = domainEntity.value;

    persistenceEntity.key = domainEntity.key;

    persistenceEntity.tenantId = domainEntity.tenantId;

    if (domainEntity.id) {
      persistenceEntity.id = domainEntity.id;
    }
    persistenceEntity.createdAt = domainEntity.createdAt;
    persistenceEntity.updatedAt = domainEntity.updatedAt;

    return persistenceEntity;
  }
}
