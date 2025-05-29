import { PaymentMethod } from '../../../../domain/payment-method';
import { TenantMapper } from '../../../../../tenants/infrastructure/persistence/relational/mappers/tenant.mapper';

import { PaymentMethodEntity } from '../entities/payment-method.entity';

export class PaymentMethodMapper {
  static toDomain(raw: PaymentMethodEntity): PaymentMethod {
    const domainEntity = new PaymentMethod();
    if (raw.tenant) {
      domainEntity.tenant = TenantMapper.toDomain(raw.tenant);
    }

    domainEntity.config = raw.config;

    domainEntity.processorType = raw.processorType;

    domainEntity.name = raw.name;

    domainEntity.id = raw.id;
    domainEntity.createdAt = raw.createdAt;
    domainEntity.updatedAt = raw.updatedAt;

    return domainEntity;
  }

  static toPersistence(domainEntity: PaymentMethod): PaymentMethodEntity {
    const persistenceEntity = new PaymentMethodEntity();
    if (domainEntity.tenant) {
      persistenceEntity.tenant = TenantMapper.toPersistence(
        domainEntity.tenant,
      );
    }

    persistenceEntity.config = domainEntity.config;

    persistenceEntity.processorType = domainEntity.processorType;

    persistenceEntity.name = domainEntity.name;

    if (domainEntity.id) {
      persistenceEntity.id = domainEntity.id;
    }
    persistenceEntity.createdAt = domainEntity.createdAt;
    persistenceEntity.updatedAt = domainEntity.updatedAt;

    return persistenceEntity;
  }
}
