import { TenantsService } from '../tenants/tenants.service';
import { Tenant } from '../tenants/domain/tenant';

import { InvoicesService } from '../invoices/invoices.service';
import { Invoice } from '../invoices/domain/invoice';

import { PaymentNotificationsService } from '../payment-notifications/payment-notifications.service';
import { PaymentNotification } from '../payment-notifications/domain/payment-notification';

import { PaymentMethodsService } from '../payment-methods/payment-methods.service';
import { PaymentMethod } from '../payment-methods/domain/payment-method';

import { UsersService } from '../users/users.service';
import { User } from '../users/domain/user';

import { TransactionsService } from '../transactions/transactions.service';
import { Transaction } from '../transactions/domain/transaction';

import {
  // common
  Injectable,
  HttpStatus,
  UnprocessableEntityException,
  Inject,
  forwardRef,
} from '@nestjs/common';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { PaymentRepository } from './infrastructure/persistence/payment.repository';
import { IPaginationOptions } from '../utils/types/pagination-options';
import { Payment } from './domain/payment';

@Injectable()
export class PaymentsService {
  constructor(
    private readonly tenantService: TenantsService,

    private readonly invoiceService: InvoicesService,

    private readonly paymentNotificationService: PaymentNotificationsService,

    private readonly paymentMethodService: PaymentMethodsService,

    private readonly userService: UsersService,

    @Inject(forwardRef(() => TransactionsService))
    private readonly transactionService: TransactionsService,

    // Dependencies here
    private readonly paymentRepository: PaymentRepository,
  ) {}

  async create(createPaymentDto: CreatePaymentDto) {
    // Do not remove comment below.
    // <creating-property />
    const tenantObject = await this.tenantService.findById(
      createPaymentDto.tenant.id,
    );
    if (!tenantObject) {
      throw new UnprocessableEntityException({
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        errors: {
          tenant: 'notExists',
        },
      });
    }
    const tenant = tenantObject;

    let invoice: Invoice | null | undefined = undefined;

    if (createPaymentDto.invoice) {
      const invoiceObject = await this.invoiceService.findById(
        createPaymentDto.invoice.id,
      );
      if (!invoiceObject) {
        throw new UnprocessableEntityException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            invoice: 'notExists',
          },
        });
      }
      invoice = invoiceObject;
    } else if (createPaymentDto.invoice === null) {
      invoice = null;
    }

    let notification: PaymentNotification | null | undefined = undefined;

    if (createPaymentDto.notification) {
      const notificationObject = await this.paymentNotificationService.findById(
        createPaymentDto.notification.id,
      );
      if (!notificationObject) {
        throw new UnprocessableEntityException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            notification: 'notExists',
          },
        });
      }
      notification = notificationObject;
    } else if (createPaymentDto.notification === null) {
      notification = null;
    }

    let paymentMethod: PaymentMethod | null | undefined = undefined;

    if (createPaymentDto.paymentMethod) {
      const paymentMethodObject = await this.paymentMethodService.findById(
        createPaymentDto.paymentMethod.id,
      );
      if (!paymentMethodObject) {
        throw new UnprocessableEntityException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            paymentMethod: 'notExists',
          },
        });
      }
      paymentMethod = paymentMethodObject;
    } else if (createPaymentDto.paymentMethod === null) {
      paymentMethod = null;
    }

    let customer: User | null | undefined = undefined;

    if (createPaymentDto.customer) {
      const customerObject = await this.userService.findById(
        createPaymentDto.customer.id,
      );
      if (!customerObject) {
        throw new UnprocessableEntityException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            customer: 'notExists',
          },
        });
      }
      customer = customerObject;
    } else if (createPaymentDto.customer === null) {
      customer = null;
    }

    let transactionId: Transaction[] | null | undefined = undefined;

    if (createPaymentDto.transactionId) {
      const transactionIdObjects = await this.transactionService.findByIds(
        createPaymentDto.transactionId.map((entity) => entity.id),
      );
      if (
        transactionIdObjects.length !== createPaymentDto.transactionId.length
      ) {
        throw new UnprocessableEntityException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            transactionId: 'notExists',
          },
        });
      }
      transactionId = transactionIdObjects;
    } else if (createPaymentDto.transactionId === null) {
      transactionId = null;
    }

    return this.paymentRepository.create({
      // Do not remove comment below.
      // <creating-property-payload />
      tenant,

      invoice,

      notification,

      paymentMethod,

      customer,

      transactionId,

      status: createPaymentDto.status,

      paymentDate: createPaymentDto.paymentDate,

      amount: createPaymentDto.amount,
    });
  }

  findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }) {
    return this.paymentRepository.findAllWithPagination({
      paginationOptions: {
        page: paginationOptions.page,
        limit: paginationOptions.limit,
      },
    });
  }

  findById(id: Payment['id']) {
    return this.paymentRepository.findById(id);
  }

  findByIds(ids: Payment['id'][]) {
    return this.paymentRepository.findByIds(ids);
  }

  async update(
    id: Payment['id'],

    updatePaymentDto: UpdatePaymentDto,
  ) {
    // Do not remove comment below.
    // <updating-property />
    let tenant: Tenant | undefined = undefined;

    if (updatePaymentDto.tenant) {
      const tenantObject = await this.tenantService.findById(
        updatePaymentDto.tenant.id,
      );
      if (!tenantObject) {
        throw new UnprocessableEntityException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            tenant: 'notExists',
          },
        });
      }
      tenant = tenantObject;
    }

    let invoice: Invoice | null | undefined = undefined;

    if (updatePaymentDto.invoice) {
      const invoiceObject = await this.invoiceService.findById(
        updatePaymentDto.invoice.id,
      );
      if (!invoiceObject) {
        throw new UnprocessableEntityException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            invoice: 'notExists',
          },
        });
      }
      invoice = invoiceObject;
    } else if (updatePaymentDto.invoice === null) {
      invoice = null;
    }

    let notification: PaymentNotification | null | undefined = undefined;

    if (updatePaymentDto.notification) {
      const notificationObject = await this.paymentNotificationService.findById(
        updatePaymentDto.notification.id,
      );
      if (!notificationObject) {
        throw new UnprocessableEntityException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            notification: 'notExists',
          },
        });
      }
      notification = notificationObject;
    } else if (updatePaymentDto.notification === null) {
      notification = null;
    }

    let paymentMethod: PaymentMethod | null | undefined = undefined;

    if (updatePaymentDto.paymentMethod) {
      const paymentMethodObject = await this.paymentMethodService.findById(
        updatePaymentDto.paymentMethod.id,
      );
      if (!paymentMethodObject) {
        throw new UnprocessableEntityException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            paymentMethod: 'notExists',
          },
        });
      }
      paymentMethod = paymentMethodObject;
    } else if (updatePaymentDto.paymentMethod === null) {
      paymentMethod = null;
    }

    let customer: User | null | undefined = undefined;

    if (updatePaymentDto.customer) {
      const customerObject = await this.userService.findById(
        updatePaymentDto.customer.id,
      );
      if (!customerObject) {
        throw new UnprocessableEntityException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            customer: 'notExists',
          },
        });
      }
      customer = customerObject;
    } else if (updatePaymentDto.customer === null) {
      customer = null;
    }

    let transactionId: Transaction[] | null | undefined = undefined;

    if (updatePaymentDto.transactionId) {
      const transactionIdObjects = await this.transactionService.findByIds(
        updatePaymentDto.transactionId.map((entity) => entity.id),
      );
      if (
        transactionIdObjects.length !== updatePaymentDto.transactionId.length
      ) {
        throw new UnprocessableEntityException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            transactionId: 'notExists',
          },
        });
      }
      transactionId = transactionIdObjects;
    } else if (updatePaymentDto.transactionId === null) {
      transactionId = null;
    }

    return this.paymentRepository.update(id, {
      // Do not remove comment below.
      // <updating-property-payload />
      tenant,

      invoice,

      notification,

      paymentMethod,

      customer,

      transactionId,

      status: updatePaymentDto.status,

      paymentDate: updatePaymentDto.paymentDate,

      amount: updatePaymentDto.amount,
    });
  }

  remove(id: Payment['id']) {
    return this.paymentRepository.remove(id);
  }
}
