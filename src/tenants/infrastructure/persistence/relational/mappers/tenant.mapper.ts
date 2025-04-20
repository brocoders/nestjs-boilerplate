import { Tenant } from '../../../../domain/tenant';
import { KycDetailsMapper } from '../../../../../kyc-details/infrastructure/persistence/relational/mappers/kyc-details.mapper';

import { UserMapper } from '../../../../../users/infrastructure/persistence/relational/mappers/user.mapper';

import { TenantEntity } from '../entities/tenant.entity';

export class TenantMapper {
  static toDomain(raw: TenantEntity): Tenant {
    const domainEntity = new Tenant();
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
