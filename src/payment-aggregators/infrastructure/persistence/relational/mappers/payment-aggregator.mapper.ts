import { PaymentAggregator } from '../../../../domain/payment-aggregator';
import { PaymentAggregatorEntity } from '../entities/payment-aggregator.entity';

export class PaymentAggregatorMapper {
  static toDomain(raw: PaymentAggregatorEntity): PaymentAggregator {
    const domainEntity = new PaymentAggregator();
    domainEntity.id = raw.id;
    domainEntity.createdAt = raw.createdAt;
    domainEntity.updatedAt = raw.updatedAt;

    return domainEntity;
  }

  static toPersistence(
    domainEntity: PaymentAggregator,
  ): PaymentAggregatorEntity {
    const persistenceEntity = new PaymentAggregatorEntity();
    if (domainEntity.id) {
      persistenceEntity.id = domainEntity.id;
    }
    persistenceEntity.createdAt = domainEntity.createdAt;
    persistenceEntity.updatedAt = domainEntity.updatedAt;

    return persistenceEntity;
  }
}
