import { PaymentNotification } from '../../../../domain/payment-notification';
import { TenantMapper } from '../../../../../tenants/infrastructure/persistence/relational/mappers/tenant.mapper';

import { PaymentAggregatorMapper } from '../../../../../payment-aggregators/infrastructure/persistence/relational/mappers/payment-aggregator.mapper';

import { PaymentNotificationEntity } from '../entities/payment-notification.entity';

export class PaymentNotificationMapper {
  static toDomain(raw: PaymentNotificationEntity): PaymentNotification {
    const domainEntity = new PaymentNotification();
    if (raw.tenant) {
      domainEntity.tenant = TenantMapper.toDomain(raw.tenant);
    }

    if (raw.aggregator) {
      domainEntity.aggregator = PaymentAggregatorMapper.toDomain(
        raw.aggregator,
      );
    }

    domainEntity.processed_at = raw.processed_at;

    domainEntity.processed = raw.processed;

    domainEntity.raw_payload = raw.raw_payload;

    domainEntity.status = raw.status;

    domainEntity.received_at = raw.received_at;

    domainEntity.payment_method = raw.payment_method;

    domainEntity.currency = raw.currency;

    domainEntity.amount = raw.amount;

    domainEntity.external_txn_id = raw.external_txn_id;

    domainEntity.provider = raw.provider;

    domainEntity.id = raw.id;
    domainEntity.createdAt = raw.createdAt;
    domainEntity.updatedAt = raw.updatedAt;

    return domainEntity;
  }

  static toPersistence(
    domainEntity: PaymentNotification,
  ): PaymentNotificationEntity {
    const persistenceEntity = new PaymentNotificationEntity();
    if (domainEntity.tenant) {
      persistenceEntity.tenant = TenantMapper.toPersistence(
        domainEntity.tenant,
      );
    }

    if (domainEntity.aggregator) {
      persistenceEntity.aggregator = PaymentAggregatorMapper.toPersistence(
        domainEntity.aggregator,
      );
    }

    persistenceEntity.processed_at = domainEntity.processed_at;

    persistenceEntity.processed = domainEntity.processed;

    persistenceEntity.raw_payload = domainEntity.raw_payload;

    persistenceEntity.status = domainEntity.status;

    persistenceEntity.received_at = domainEntity.received_at;

    persistenceEntity.payment_method = domainEntity.payment_method;

    persistenceEntity.currency = domainEntity.currency;

    persistenceEntity.amount = domainEntity.amount;

    persistenceEntity.external_txn_id = domainEntity.external_txn_id;

    persistenceEntity.provider = domainEntity.provider;

    if (domainEntity.id) {
      persistenceEntity.id = domainEntity.id;
    }
    persistenceEntity.createdAt = domainEntity.createdAt;
    persistenceEntity.updatedAt = domainEntity.updatedAt;

    return persistenceEntity;
  }
}
