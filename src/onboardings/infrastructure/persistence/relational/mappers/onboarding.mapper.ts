import { Onboarding } from '../../../../domain/onboarding';

import { TenantMapper } from '../../../../../tenants/infrastructure/persistence/relational/mappers/tenant.mapper';

import { UserMapper } from '../../../../../users/infrastructure/persistence/relational/mappers/user.mapper';

import { OnboardingEntity } from '../entities/onboarding.entity';

export class OnboardingMapper {
  static toPersistenceWhere: any;
  static toDomain(raw: OnboardingEntity): Onboarding {
    const domainEntity = new Onboarding();
    if (raw.performedByTenant) {
      domainEntity.performedByTenant = TenantMapper.toDomain(
        raw.performedByTenant,
      );
    }

    if (raw.performedByUser) {
      domainEntity.performedByUser = UserMapper.toDomain(raw.performedByUser);
    }

    domainEntity.completedAt = raw.completedAt;

    domainEntity.metadata = raw.metadata;

    domainEntity.isSkippable = raw.isSkippable;

    domainEntity.isRequired = raw.isRequired;

    domainEntity.order = raw.order;

    domainEntity.status = raw.status;

    domainEntity.description = raw.description;

    domainEntity.name = raw.name;

    domainEntity.stepKey = raw.stepKey;

    domainEntity.entityType = raw.entityType;

    domainEntity.id = raw.id;
    domainEntity.createdAt = raw.createdAt;
    domainEntity.updatedAt = raw.updatedAt;

    return domainEntity;
  }

  static toPersistence(domainEntity: Onboarding): OnboardingEntity {
    const persistenceEntity = new OnboardingEntity();
    if (domainEntity.performedByTenant) {
      persistenceEntity.performedByTenant = TenantMapper.toPersistence(
        domainEntity.performedByTenant,
      );
    }

    if (domainEntity.performedByUser) {
      persistenceEntity.performedByUser = UserMapper.toPersistence(
        domainEntity.performedByUser,
      );
    }

    persistenceEntity.completedAt = domainEntity.completedAt;

    persistenceEntity.metadata = domainEntity.metadata;

    persistenceEntity.isSkippable = domainEntity.isSkippable;

    persistenceEntity.isRequired = domainEntity.isRequired;

    persistenceEntity.order = domainEntity.order;

    persistenceEntity.status = domainEntity.status;

    persistenceEntity.description = domainEntity.description;

    persistenceEntity.name = domainEntity.name;

    persistenceEntity.stepKey = domainEntity.stepKey;

    persistenceEntity.entityType = domainEntity.entityType;

    if (domainEntity.id) {
      persistenceEntity.id = domainEntity.id;
    }
    persistenceEntity.createdAt = domainEntity.createdAt;
    persistenceEntity.updatedAt = domainEntity.updatedAt;

    return persistenceEntity;
  }
}
