import { CustomerPlan } from '../../../../domain/customer-plan';

import { PaymentPlanMapper } from '../../../../../payment-plans/infrastructure/persistence/relational/mappers/payment-plan.mapper';

import { UserMapper } from '../../../../../users/infrastructure/persistence/relational/mappers/user.mapper';

import { CustomerPlanEntity } from '../entities/customer-plan.entity';

export class CustomerPlanMapper {
  static toDomain(raw: CustomerPlanEntity): CustomerPlan {
    const domainEntity = new CustomerPlan();
    domainEntity.customSchedule = raw.customSchedule;

    domainEntity.nextPaymentDate = raw.nextPaymentDate;

    if (raw.assignedBy) {
      domainEntity.assignedBy = UserMapper.toDomain(raw.assignedBy);
    } else if (raw.assignedBy === null) {
      domainEntity.assignedBy = null;
    }

    domainEntity.status = raw.status;

    domainEntity.customRates = raw.customRates;

    domainEntity.endDate = raw.endDate;

    domainEntity.startDate = raw.startDate;

    if (raw.plan) {
      domainEntity.plan = raw.plan.map((item) =>
        PaymentPlanMapper.toDomain(item),
      );
    }

    if (raw.customer) {
      domainEntity.customer = raw.customer.map((item) =>
        UserMapper.toDomain(item),
      );
    }

    domainEntity.id = raw.id;
    domainEntity.createdAt = raw.createdAt;
    domainEntity.updatedAt = raw.updatedAt;

    return domainEntity;
  }

  static toPersistence(domainEntity: CustomerPlan): CustomerPlanEntity {
    const persistenceEntity = new CustomerPlanEntity();
    persistenceEntity.customSchedule = domainEntity.customSchedule;

    persistenceEntity.nextPaymentDate = domainEntity.nextPaymentDate;

    if (domainEntity.assignedBy) {
      persistenceEntity.assignedBy = UserMapper.toPersistence(
        domainEntity.assignedBy,
      );
    } else if (domainEntity.assignedBy === null) {
      persistenceEntity.assignedBy = null;
    }

    persistenceEntity.status = domainEntity.status;

    persistenceEntity.customRates = domainEntity.customRates;

    persistenceEntity.endDate = domainEntity.endDate;

    persistenceEntity.startDate = domainEntity.startDate;

    if (domainEntity.plan) {
      persistenceEntity.plan = domainEntity.plan.map((item) =>
        PaymentPlanMapper.toPersistence(item),
      );
    }

    if (domainEntity.customer) {
      persistenceEntity.customer = domainEntity.customer.map((item) =>
        UserMapper.toPersistence(item),
      );
    }

    if (domainEntity.id) {
      persistenceEntity.id = domainEntity.id;
    }
    persistenceEntity.createdAt = domainEntity.createdAt;
    persistenceEntity.updatedAt = domainEntity.updatedAt;

    return persistenceEntity;
  }
}
