import { Payment } from '../../../../domain/payment';

import { PaymentEntity } from '../entities/payment.entity';

export class PaymentMapper {
  static toDomain(raw: PaymentEntity): Payment {
    const domainEntity = new Payment();
    domainEntity.status = raw.status;

    domainEntity.method = raw.method;

    domainEntity.paymentDate = raw.paymentDate;

    domainEntity.amount = raw.amount;

    domainEntity.id = raw.id;
    domainEntity.createdAt = raw.createdAt;
    domainEntity.updatedAt = raw.updatedAt;

    return domainEntity;
  }

  static toPersistence(domainEntity: Payment): PaymentEntity {
    const persistenceEntity = new PaymentEntity();
    persistenceEntity.status = domainEntity.status;

    persistenceEntity.method = domainEntity.method;

    persistenceEntity.paymentDate = domainEntity.paymentDate;

    persistenceEntity.amount = domainEntity.amount;

    if (domainEntity.id) {
      persistenceEntity.id = domainEntity.id;
    }
    persistenceEntity.createdAt = domainEntity.createdAt;
    persistenceEntity.updatedAt = domainEntity.updatedAt;

    return persistenceEntity;
  }
}
