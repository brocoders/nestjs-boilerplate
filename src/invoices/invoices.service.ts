import { TenantsService } from '../tenants/tenants.service';
import { Tenant } from '../tenants/domain/tenant';

import { ExemptionsService } from '../exemptions/exemptions.service';
import { Exemption } from '../exemptions/domain/exemption';

import { DiscountsService } from '../discounts/discounts.service';
import { Discount } from '../discounts/domain/discount';

import { AccountsReceivablesService } from '../accounts-receivables/accounts-receivables.service';
import { AccountsReceivable } from '../accounts-receivables/domain/accounts-receivable';

import { PaymentPlansService } from '../payment-plans/payment-plans.service';
import { PaymentPlan } from '../payment-plans/domain/payment-plan';

import { UsersService } from '../users/users.service';
import { User } from '../users/domain/user';

import {
  // common
  Injectable,
  HttpStatus,
  UnprocessableEntityException,
  forwardRef,
  Inject,
} from '@nestjs/common';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { UpdateInvoiceDto } from './dto/update-invoice.dto';
import { InvoiceRepository } from './infrastructure/persistence/invoice.repository';
import { IPaginationOptions } from '../utils/types/pagination-options';
import { Invoice } from './domain/invoice';

@Injectable()
export class InvoicesService {
  constructor(
    private readonly tenantService: TenantsService,

    @Inject(forwardRef(() => ExemptionsService))
    private readonly exemptionService: ExemptionsService,

    private readonly discountService: DiscountsService,

    private readonly accountsReceivableService: AccountsReceivablesService,

    private readonly paymentPlanService: PaymentPlansService,

    private readonly userService: UsersService,

    // Dependencies here
    private readonly invoiceRepository: InvoiceRepository,
  ) {}

  async create(createInvoiceDto: CreateInvoiceDto) {
    // Do not remove comment below.
    // <creating-property />
    const tenantObject = await this.tenantService.findById(
      createInvoiceDto.tenant.id,
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

    let exemption: Exemption | null | undefined = undefined;

    if (createInvoiceDto.exemption) {
      const exemptionObject = await this.exemptionService.findById(
        createInvoiceDto.exemption.id,
      );
      if (!exemptionObject) {
        throw new UnprocessableEntityException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            exemption: 'notExists',
          },
        });
      }
      exemption = exemptionObject;
    } else if (createInvoiceDto.exemption === null) {
      exemption = null;
    }

    let discount: Discount | null | undefined = undefined;

    if (createInvoiceDto.discount) {
      const discountObject = await this.discountService.findById(
        createInvoiceDto.discount.id,
      );
      if (!discountObject) {
        throw new UnprocessableEntityException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            discount: 'notExists',
          },
        });
      }
      discount = discountObject;
    } else if (createInvoiceDto.discount === null) {
      discount = null;
    }

    let accountsReceivable: AccountsReceivable | null | undefined = undefined;

    if (createInvoiceDto.accountsReceivable) {
      const accountsReceivableObject =
        await this.accountsReceivableService.findById(
          createInvoiceDto.accountsReceivable.id,
        );
      if (!accountsReceivableObject) {
        throw new UnprocessableEntityException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            accountsReceivable: 'notExists',
          },
        });
      }
      accountsReceivable = accountsReceivableObject;
    } else if (createInvoiceDto.accountsReceivable === null) {
      accountsReceivable = null;
    }

    let plan: PaymentPlan[] | null | undefined = undefined;

    if (createInvoiceDto.plan) {
      const planObjects = await this.paymentPlanService.findByIds(
        createInvoiceDto.plan.map((entity) => entity.id),
      );
      if (planObjects.length !== createInvoiceDto.plan.length) {
        throw new UnprocessableEntityException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            plan: 'notExists',
          },
        });
      }
      plan = planObjects;
    } else if (createInvoiceDto.plan === null) {
      plan = null;
    }

    let customer: User | null | undefined = undefined;

    if (createInvoiceDto.customer) {
      const customerObject = await this.userService.findById(
        createInvoiceDto.customer.id,
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
    } else if (createInvoiceDto.customer === null) {
      customer = null;
    }

    return this.invoiceRepository.create({
      // Do not remove comment below.
      // <creating-property-payload />
      tenant,

      exemption,

      discount,

      accountsReceivable,

      amountDue: createInvoiceDto.amountDue,

      amountPaid: createInvoiceDto.amountPaid,

      plan,

      breakdown: createInvoiceDto.breakdown,

      status: createInvoiceDto.status,

      dueDate: createInvoiceDto.dueDate,

      amount: createInvoiceDto.amount,

      customer,
    });
  }

  findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }) {
    return this.invoiceRepository.findAllWithPagination({
      paginationOptions: {
        page: paginationOptions.page,
        limit: paginationOptions.limit,
      },
    });
  }

  findById(id: Invoice['id']) {
    return this.invoiceRepository.findById(id);
  }

  findByIds(ids: Invoice['id'][]) {
    return this.invoiceRepository.findByIds(ids);
  }

  async update(
    id: Invoice['id'],

    updateInvoiceDto: UpdateInvoiceDto,
  ) {
    // Do not remove comment below.
    // <updating-property />
    let tenant: Tenant | undefined = undefined;

    if (updateInvoiceDto.tenant) {
      const tenantObject = await this.tenantService.findById(
        updateInvoiceDto.tenant.id,
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

    let exemption: Exemption | null | undefined = undefined;

    if (updateInvoiceDto.exemption) {
      const exemptionObject = await this.exemptionService.findById(
        updateInvoiceDto.exemption.id,
      );
      if (!exemptionObject) {
        throw new UnprocessableEntityException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            exemption: 'notExists',
          },
        });
      }
      exemption = exemptionObject;
    } else if (updateInvoiceDto.exemption === null) {
      exemption = null;
    }

    let discount: Discount | null | undefined = undefined;

    if (updateInvoiceDto.discount) {
      const discountObject = await this.discountService.findById(
        updateInvoiceDto.discount.id,
      );
      if (!discountObject) {
        throw new UnprocessableEntityException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            discount: 'notExists',
          },
        });
      }
      discount = discountObject;
    } else if (updateInvoiceDto.discount === null) {
      discount = null;
    }

    let accountsReceivable: AccountsReceivable | null | undefined = undefined;

    if (updateInvoiceDto.accountsReceivable) {
      const accountsReceivableObject =
        await this.accountsReceivableService.findById(
          updateInvoiceDto.accountsReceivable.id,
        );
      if (!accountsReceivableObject) {
        throw new UnprocessableEntityException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            accountsReceivable: 'notExists',
          },
        });
      }
      accountsReceivable = accountsReceivableObject;
    } else if (updateInvoiceDto.accountsReceivable === null) {
      accountsReceivable = null;
    }

    let plan: PaymentPlan[] | null | undefined = undefined;

    if (updateInvoiceDto.plan) {
      const planObjects = await this.paymentPlanService.findByIds(
        updateInvoiceDto.plan.map((entity) => entity.id),
      );
      if (planObjects.length !== updateInvoiceDto.plan.length) {
        throw new UnprocessableEntityException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            plan: 'notExists',
          },
        });
      }
      plan = planObjects;
    } else if (updateInvoiceDto.plan === null) {
      plan = null;
    }

    let customer: User | null | undefined = undefined;

    if (updateInvoiceDto.customer) {
      const customerObject = await this.userService.findById(
        updateInvoiceDto.customer.id,
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
    } else if (updateInvoiceDto.customer === null) {
      customer = null;
    }

    return this.invoiceRepository.update(id, {
      // Do not remove comment below.
      // <updating-property-payload />
      tenant,

      exemption,

      discount,

      accountsReceivable,

      amountDue: updateInvoiceDto.amountDue,

      amountPaid: updateInvoiceDto.amountPaid,

      plan,

      breakdown: updateInvoiceDto.breakdown,

      status: updateInvoiceDto.status,

      dueDate: updateInvoiceDto.dueDate,

      amount: updateInvoiceDto.amount,

      customer,
    });
  }

  remove(id: Invoice['id']) {
    return this.invoiceRepository.remove(id);
  }
}
