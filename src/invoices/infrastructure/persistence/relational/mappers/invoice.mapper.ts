import { Invoice } from '../../../../domain/invoice';
import { ExemptionMapper } from '../../../../../exemptions/infrastructure/persistence/relational/mappers/exemption.mapper';

import { DiscountMapper } from '../../../../../discounts/infrastructure/persistence/relational/mappers/discount.mapper';

import { AccountsReceivableMapper } from '../../../../../accounts-receivables/infrastructure/persistence/relational/mappers/accounts-receivable.mapper';

import { PaymentPlanMapper } from '../../../../../payment-plans/infrastructure/persistence/relational/mappers/payment-plan.mapper';

import { UserMapper } from '../../../../../users/infrastructure/persistence/relational/mappers/user.mapper';

import { InvoiceEntity } from '../entities/invoice.entity';

export class InvoiceMapper {
  static toDomain(raw: InvoiceEntity): Invoice {
    const domainEntity = new Invoice();
    if (raw.exemption) {
      domainEntity.exemption = ExemptionMapper.toDomain(raw.exemption);
    } else if (raw.exemption === null) {
      domainEntity.exemption = null;
    }

    if (raw.discount) {
      domainEntity.discount = DiscountMapper.toDomain(raw.discount);
    } else if (raw.discount === null) {
      domainEntity.discount = null;
    }

    if (raw.accountsReceivable) {
      domainEntity.accountsReceivable = AccountsReceivableMapper.toDomain(
        raw.accountsReceivable,
      );
    } else if (raw.accountsReceivable === null) {
      domainEntity.accountsReceivable = null;
    }

    domainEntity.amountDue = raw.amountDue;

    domainEntity.amountPaid = raw.amountPaid;

    if (raw.plan) {
      domainEntity.plan = raw.plan.map((item) =>
        PaymentPlanMapper.toDomain(item),
      );
    } else if (raw.plan === null) {
      domainEntity.plan = null;
    }

    domainEntity.breakdown = raw.breakdown;

    domainEntity.status = raw.status;

    domainEntity.dueDate = raw.dueDate;

    domainEntity.amount = raw.amount;

    if (raw.customer) {
      domainEntity.customer = UserMapper.toDomain(raw.customer);
    } else if (raw.customer === null) {
      domainEntity.customer = null;
    }

    domainEntity.id = raw.id;
    domainEntity.createdAt = raw.createdAt;
    domainEntity.updatedAt = raw.updatedAt;

    return domainEntity;
  }

  static toPersistence(domainEntity: Invoice): InvoiceEntity {
    const persistenceEntity = new InvoiceEntity();
    if (domainEntity.exemption) {
      persistenceEntity.exemption = ExemptionMapper.toPersistence(
        domainEntity.exemption,
      );
    } else if (domainEntity.exemption === null) {
      persistenceEntity.exemption = null;
    }

    if (domainEntity.discount) {
      persistenceEntity.discount = DiscountMapper.toPersistence(
        domainEntity.discount,
      );
    } else if (domainEntity.discount === null) {
      persistenceEntity.discount = null;
    }

    if (domainEntity.accountsReceivable) {
      persistenceEntity.accountsReceivable =
        AccountsReceivableMapper.toPersistence(domainEntity.accountsReceivable);
    } else if (domainEntity.accountsReceivable === null) {
      persistenceEntity.accountsReceivable = null;
    }

    persistenceEntity.amountDue = domainEntity.amountDue;

    persistenceEntity.amountPaid = domainEntity.amountPaid;

    if (domainEntity.plan) {
      persistenceEntity.plan = domainEntity.plan.map((item) =>
        PaymentPlanMapper.toPersistence(item),
      );
    } else if (domainEntity.plan === null) {
      persistenceEntity.plan = null;
    }

    persistenceEntity.breakdown = domainEntity.breakdown;

    persistenceEntity.status = domainEntity.status;

    persistenceEntity.dueDate = domainEntity.dueDate;

    persistenceEntity.amount = domainEntity.amount;

    if (domainEntity.customer) {
      persistenceEntity.customer = UserMapper.toPersistence(
        domainEntity.customer,
      );
    } else if (domainEntity.customer === null) {
      persistenceEntity.customer = null;
    }

    if (domainEntity.id) {
      persistenceEntity.id = domainEntity.id;
    }
    persistenceEntity.createdAt = domainEntity.createdAt;
    persistenceEntity.updatedAt = domainEntity.updatedAt;

    return persistenceEntity;
  }
}
