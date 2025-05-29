import { Onboarding } from '../../../../domain/onboarding';

import { TenantMapper } from '../../../../../tenants/infrastructure/persistence/relational/mappers/tenant.mapper';

import { UserMapper } from '../../../../../users/infrastructure/persistence/relational/mappers/user.mapper';

import { OnboardingEntity } from '../entities/onboarding.entity';

export class OnboardingMapper {
  static toDomain(raw: OnboardingEntity): Onboarding {
    const domainEntity = new Onboarding();
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

    if (raw.tenant) {
      domainEntity.tenant = TenantMapper.toDomain(raw.tenant);
    } else if (raw.tenant === null) {
      domainEntity.tenant = null;
    }

    if (raw.user) {
      domainEntity.user = UserMapper.toDomain(raw.user);
    } else if (raw.user === null) {
      domainEntity.user = null;
    }

    domainEntity.id = raw.id;
    domainEntity.createdAt = raw.createdAt;
    domainEntity.updatedAt = raw.updatedAt;

    return domainEntity;
  }

  static toPersistence(domainEntity: Onboarding): OnboardingEntity {
    const persistenceEntity = new OnboardingEntity();
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

    if (domainEntity.tenant) {
      persistenceEntity.tenant = TenantMapper.toPersistence(
        domainEntity.tenant,
      );
    } else if (domainEntity.tenant === null) {
      persistenceEntity.tenant = null;
    }

    if (domainEntity.user) {
      persistenceEntity.user = UserMapper.toPersistence(domainEntity.user);
    } else if (domainEntity.user === null) {
      persistenceEntity.user = null;
    }

    if (domainEntity.id) {
      persistenceEntity.id = domainEntity.id;
    }
    persistenceEntity.createdAt = domainEntity.createdAt;
    persistenceEntity.updatedAt = domainEntity.updatedAt;

    return persistenceEntity;
  }
}
