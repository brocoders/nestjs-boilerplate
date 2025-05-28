import { PaymentAggregator } from '../../../../domain/payment-aggregator';

import { PaymentNotificationMapper } from '../../../../../payment-notifications/infrastructure/persistence/relational/mappers/payment-notification.mapper';

import { PaymentAggregatorEntity } from '../entities/payment-aggregator.entity';

export class PaymentAggregatorMapper {
  static toDomain(raw: PaymentAggregatorEntity): PaymentAggregator {
    const domainEntity = new PaymentAggregator();
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
