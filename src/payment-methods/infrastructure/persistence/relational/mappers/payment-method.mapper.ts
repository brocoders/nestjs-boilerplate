import { PaymentMethod } from '../../../../domain/payment-method';
import { PaymentMethodEntity } from '../entities/payment-method.entity';

export class PaymentMethodMapper {
  static toDomain(raw: PaymentMethodEntity): PaymentMethod {
    const domainEntity = new PaymentMethod();
    domainEntity.id = raw.id;
    domainEntity.createdAt = raw.createdAt;
    domainEntity.updatedAt = raw.updatedAt;

    return domainEntity;
  }

  static toPersistence(domainEntity: PaymentMethod): PaymentMethodEntity {
    const persistenceEntity = new PaymentMethodEntity();
    if (domainEntity.id) {
      persistenceEntity.id = domainEntity.id;
    }
    persistenceEntity.createdAt = domainEntity.createdAt;
    persistenceEntity.updatedAt = domainEntity.updatedAt;

    return persistenceEntity;
  }
}
