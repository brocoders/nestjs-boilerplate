import { PaymentAggregator } from '../../../../domain/payment-aggregator';
import { TenantMapper } from '../../../../../tenants/infrastructure/persistence/relational/mappers/tenant.mapper';

import { PaymentNotificationMapper } from '../../../../../payment-notifications/infrastructure/persistence/relational/mappers/payment-notification.mapper';

import { PaymentAggregatorEntity } from '../entities/payment-aggregator.entity';

export class PaymentAggregatorMapper {
  static toDomain(raw: PaymentAggregatorEntity): PaymentAggregator {
    const domainEntity = new PaymentAggregator();
    if (raw.tenant) {
      domainEntity.tenant = TenantMapper.toDomain(raw.tenant);
    }

    domainEntity.config = raw.config;

    domainEntity.name = raw.name;

    if (raw.notifications) {
      domainEntity.notifications = raw.notifications.map((item) =>
        PaymentNotificationMapper.toDomain(item),
      );
    } else if (raw.notifications === null) {
      domainEntity.notifications = null;
    }

    domainEntity.id = raw.id;
    domainEntity.createdAt = raw.createdAt;
    domainEntity.updatedAt = raw.updatedAt;

    return domainEntity;
  }

  static toPersistence(
    domainEntity: PaymentAggregator,
  ): PaymentAggregatorEntity {
    const persistenceEntity = new PaymentAggregatorEntity();
    if (domainEntity.tenant) {
      persistenceEntity.tenant = TenantMapper.toPersistence(
        domainEntity.tenant,
      );
    }

    persistenceEntity.config = domainEntity.config;

    persistenceEntity.name = domainEntity.name;

    if (domainEntity.notifications) {
      persistenceEntity.notifications = domainEntity.notifications.map((item) =>
        PaymentNotificationMapper.toPersistence(item),
      );
    } else if (domainEntity.notifications === null) {
      persistenceEntity.notifications = null;
    }

    if (domainEntity.id) {
      persistenceEntity.id = domainEntity.id;
    }
    persistenceEntity.createdAt = domainEntity.createdAt;
    persistenceEntity.updatedAt = domainEntity.updatedAt;

    return persistenceEntity;
  }
}
