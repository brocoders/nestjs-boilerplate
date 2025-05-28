import { PaymentPlan } from '../../../../domain/payment-plan';
import { TenantMapper } from '../../../../../tenants/infrastructure/persistence/relational/mappers/tenant.mapper';

import { PaymentPlanEntity } from '../entities/payment-plan.entity';

export class PaymentPlanMapper {
  static toDomain(raw: PaymentPlanEntity): PaymentPlan {
    const domainEntity = new PaymentPlan();
    if (raw.tenant) {
      domainEntity.tenant = TenantMapper.toDomain(raw.tenant);
    }

    if (raw.tenant) {
      domainEntity.tenant = TenantMapper.toDomain(raw.tenant);
    }

    domainEntity.isActive = raw.isActive;

    domainEntity.unit = raw.unit;

    domainEntity.minimumCharge = raw.minimumCharge;

    domainEntity.rateStructure = raw.rateStructure;

    domainEntity.type = raw.type;

    domainEntity.id = raw.id;
    domainEntity.createdAt = raw.createdAt;
    domainEntity.updatedAt = raw.updatedAt;

    return domainEntity;
  }

  static toPersistence(domainEntity: PaymentPlan): PaymentPlanEntity {
    const persistenceEntity = new PaymentPlanEntity();
    if (domainEntity.tenant) {
      persistenceEntity.tenant = TenantMapper.toPersistence(
        domainEntity.tenant,
      );
    }

    if (domainEntity.tenant) {
      persistenceEntity.tenant = TenantMapper.toPersistence(
        domainEntity.tenant,
      );
    }

    persistenceEntity.isActive = domainEntity.isActive;

    persistenceEntity.unit = domainEntity.unit;

    persistenceEntity.minimumCharge = domainEntity.minimumCharge;

    persistenceEntity.rateStructure = domainEntity.rateStructure;

    persistenceEntity.type = domainEntity.type;

    if (domainEntity.id) {
      persistenceEntity.id = domainEntity.id;
    }
    persistenceEntity.createdAt = domainEntity.createdAt;
    persistenceEntity.updatedAt = domainEntity.updatedAt;

    return persistenceEntity;
  }
}
