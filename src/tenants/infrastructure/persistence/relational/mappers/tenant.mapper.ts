import { Tenant } from '../../../../domain/tenant';
import { UserMapper } from '../../../../../users/infrastructure/persistence/relational/mappers/user.mapper';

import { TenantEntity } from '../entities/tenant.entity';

export class TenantMapper {
  static toDomain(raw: TenantEntity): Tenant {
    const domainEntity = new Tenant();
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
