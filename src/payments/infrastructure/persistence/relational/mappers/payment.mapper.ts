import { Payment } from '../../../../domain/payment';
import { InvoiceMapper } from '../../../../../invoices/infrastructure/persistence/relational/mappers/invoice.mapper';

import { PaymentNotificationMapper } from '../../../../../payment-notifications/infrastructure/persistence/relational/mappers/payment-notification.mapper';

import { PaymentMethodMapper } from '../../../../../payment-methods/infrastructure/persistence/relational/mappers/payment-method.mapper';

import { UserMapper } from '../../../../../users/infrastructure/persistence/relational/mappers/user.mapper';

import { TransactionMapper } from '../../../../../transactions/infrastructure/persistence/relational/mappers/transaction.mapper';

import { PaymentEntity } from '../entities/payment.entity';

export class PaymentMapper {
  static toDomain(raw: PaymentEntity): Payment {
    const domainEntity = new Payment();
    if (raw.invoice) {
      domainEntity.invoice = InvoiceMapper.toDomain(raw.invoice);
    } else if (raw.invoice === null) {
      domainEntity.invoice = null;
    }

    if (raw.notification) {
      domainEntity.notification = PaymentNotificationMapper.toDomain(
        raw.notification,
      );
    } else if (raw.notification === null) {
      domainEntity.notification = null;
    }

    if (raw.paymentMethod) {
      domainEntity.paymentMethod = PaymentMethodMapper.toDomain(
        raw.paymentMethod,
      );
    } else if (raw.paymentMethod === null) {
      domainEntity.paymentMethod = null;
    }

    if (raw.customer) {
      domainEntity.customer = UserMapper.toDomain(raw.customer);
    } else if (raw.customer === null) {
      domainEntity.customer = null;
    }

    if (raw.transactionId) {
      domainEntity.transactionId = raw.transactionId.map((item) =>
        TransactionMapper.toDomain(item),
      );
    } else if (raw.transactionId === null) {
      domainEntity.transactionId = null;
    }

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
    if (domainEntity.invoice) {
      persistenceEntity.invoice = InvoiceMapper.toPersistence(
        domainEntity.invoice,
      );
    } else if (domainEntity.invoice === null) {
      persistenceEntity.invoice = null;
    }

    if (domainEntity.notification) {
      persistenceEntity.notification = PaymentNotificationMapper.toPersistence(
        domainEntity.notification,
      );
    } else if (domainEntity.notification === null) {
      persistenceEntity.notification = null;
    }

    if (domainEntity.paymentMethod) {
      persistenceEntity.paymentMethod = PaymentMethodMapper.toPersistence(
        domainEntity.paymentMethod,
      );
    } else if (domainEntity.paymentMethod === null) {
      persistenceEntity.paymentMethod = null;
    }

    if (domainEntity.customer) {
      persistenceEntity.customer = UserMapper.toPersistence(
        domainEntity.customer,
      );
    } else if (domainEntity.customer === null) {
      persistenceEntity.customer = null;
    }

    if (domainEntity.transactionId) {
      persistenceEntity.transactionId = domainEntity.transactionId.map((item) =>
        TransactionMapper.toPersistence(item),
      );
    } else if (domainEntity.transactionId === null) {
      persistenceEntity.transactionId = null;
    }

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
