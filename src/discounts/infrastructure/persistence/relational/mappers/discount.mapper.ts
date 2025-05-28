import { Discount } from '../../../../domain/discount';
import { RegionMapper } from '../../../../../regions/infrastructure/persistence/relational/mappers/region.mapper';

import { UserMapper } from '../../../../../users/infrastructure/persistence/relational/mappers/user.mapper';

import { PaymentPlanMapper } from '../../../../../payment-plans/infrastructure/persistence/relational/mappers/payment-plan.mapper';

import { DiscountEntity } from '../entities/discount.entity';

export class DiscountMapper {
  static toDomain(raw: DiscountEntity): Discount {
    const domainEntity = new Discount();
    if (raw.region) {
      domainEntity.region = RegionMapper.toDomain(raw.region);
    } else if (raw.region === null) {
      domainEntity.region = null;
    }

    if (raw.customer) {
      domainEntity.customer = UserMapper.toDomain(raw.customer);
    } else if (raw.customer === null) {
      domainEntity.customer = null;
    }

    if (raw.plan) {
      domainEntity.plan = PaymentPlanMapper.toDomain(raw.plan);
    } else if (raw.plan === null) {
      domainEntity.plan = null;
    }

    domainEntity.isActive = raw.isActive;

    domainEntity.validTo = raw.validTo;

    domainEntity.validFrom = raw.validFrom;

    domainEntity.value = raw.value;

    domainEntity.type = raw.type;

    domainEntity.id = raw.id;
    domainEntity.createdAt = raw.createdAt;
    domainEntity.updatedAt = raw.updatedAt;

    return domainEntity;
  }

  static toPersistence(domainEntity: Discount): DiscountEntity {
    const persistenceEntity = new DiscountEntity();
    if (domainEntity.region) {
      persistenceEntity.region = RegionMapper.toPersistence(
        domainEntity.region,
      );
    } else if (domainEntity.region === null) {
      persistenceEntity.region = null;
    }

    if (domainEntity.customer) {
      persistenceEntity.customer = UserMapper.toPersistence(
        domainEntity.customer,
      );
    } else if (domainEntity.customer === null) {
      persistenceEntity.customer = null;
    }

    if (domainEntity.plan) {
      persistenceEntity.plan = PaymentPlanMapper.toPersistence(
        domainEntity.plan,
      );
    } else if (domainEntity.plan === null) {
      persistenceEntity.plan = null;
    }

    persistenceEntity.isActive = domainEntity.isActive;

    persistenceEntity.validTo = domainEntity.validTo;

    persistenceEntity.validFrom = domainEntity.validFrom;

    persistenceEntity.value = domainEntity.value;

    persistenceEntity.type = domainEntity.type;

    if (domainEntity.id) {
      persistenceEntity.id = domainEntity.id;
    }
    persistenceEntity.createdAt = domainEntity.createdAt;
    persistenceEntity.updatedAt = domainEntity.updatedAt;

    return persistenceEntity;
  }
}
