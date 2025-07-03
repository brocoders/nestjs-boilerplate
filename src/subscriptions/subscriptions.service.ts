import { TenantsService } from '../tenants/tenants.service';
import { Tenant } from '../tenants/domain/tenant';

import { PaymentPlansService } from '../payment-plans/payment-plans.service';
import { PaymentPlan } from '../payment-plans/domain/payment-plan';

import { UsersService } from '../users/users.service';
import { User } from '../users/domain/user';

import {
  // common
  Injectable,
  HttpStatus,
  UnprocessableEntityException,
} from '@nestjs/common';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { UpdateSubscriptionDto } from './dto/update-subscription.dto';
import { SubscriptionRepository } from './infrastructure/persistence/subscription.repository';
import { IPaginationOptions } from '../utils/types/pagination-options';
import { Subscription } from './domain/subscription';

@Injectable()
export class SubscriptionsService {
  constructor(
    private readonly tenantService: TenantsService,

    private readonly paymentPlanService: PaymentPlansService,

    private readonly userService: UsersService,

    // Dependencies here
    private readonly customerPlanRepository: SubscriptionRepository,
  ) {}

  async create(createSubscriptionDto: CreateSubscriptionDto) {
    // Do not remove comment below.
    // <creating-property />

    const tenantObject = await this.tenantService.findById(
      createSubscriptionDto.tenant.id,
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

    let assignedBy: User | null | undefined = undefined;

    if (createSubscriptionDto.assignedBy) {
      const assignedByObject = await this.userService.findById(
        createSubscriptionDto.assignedBy.id,
      );
      if (!assignedByObject) {
        throw new UnprocessableEntityException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            assignedBy: 'notExists',
          },
        });
      }
      assignedBy = assignedByObject;
    } else if (createSubscriptionDto.assignedBy === null) {
      assignedBy = null;
    }

    const planObjects = await this.paymentPlanService.findByIds(
      createSubscriptionDto.plan.map((entity) => entity.id),
    );
    if (planObjects.length !== createSubscriptionDto.plan.length) {
      throw new UnprocessableEntityException({
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        errors: {
          plan: 'notExists',
        },
      });
    }
    const plan = planObjects;

    const customerObjects = await this.userService.findByIds(
      createSubscriptionDto.customer.map((entity) => entity.id),
    );
    if (customerObjects.length !== createSubscriptionDto.customer.length) {
      throw new UnprocessableEntityException({
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        errors: {
          customer: 'notExists',
        },
      });
    }
    const customer = customerObjects;

    return this.customerPlanRepository.create({
      // Do not remove comment below.
      // <creating-property-payload />
      tenant,

      customSchedule: createSubscriptionDto.customSchedule,

      nextPaymentDate: createSubscriptionDto.nextPaymentDate,

      assignedBy,

      status: createSubscriptionDto.status,

      customRates: createSubscriptionDto.customRates,

      endDate: createSubscriptionDto.endDate,

      startDate: createSubscriptionDto.startDate,

      plan,

      customer,
    });
  }

  findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }) {
    return this.customerPlanRepository.findAllWithPagination({
      paginationOptions: {
        page: paginationOptions.page,
        limit: paginationOptions.limit,
      },
    });
  }

  findById(id: Subscription['id']) {
    return this.customerPlanRepository.findById(id);
  }

  findByIds(ids: Subscription['id'][]) {
    return this.customerPlanRepository.findByIds(ids);
  }

  async update(
    id: Subscription['id'],

    updateSubscriptionDto: UpdateSubscriptionDto,
  ) {
    // Do not remove comment below.
    // <updating-property />

    let tenant: Tenant | undefined = undefined;

    if (updateSubscriptionDto.tenant) {
      const tenantObject = await this.tenantService.findById(
        updateSubscriptionDto.tenant.id,
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

    let assignedBy: User | null | undefined = undefined;

    if (updateSubscriptionDto.assignedBy) {
      const assignedByObject = await this.userService.findById(
        updateSubscriptionDto.assignedBy.id,
      );
      if (!assignedByObject) {
        throw new UnprocessableEntityException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            assignedBy: 'notExists',
          },
        });
      }
      assignedBy = assignedByObject;
    } else if (updateSubscriptionDto.assignedBy === null) {
      assignedBy = null;
    }

    let plan: PaymentPlan[] | undefined = undefined;

    if (updateSubscriptionDto.plan) {
      const planObjects = await this.paymentPlanService.findByIds(
        updateSubscriptionDto.plan.map((entity) => entity.id),
      );
      if (planObjects.length !== updateSubscriptionDto.plan.length) {
        throw new UnprocessableEntityException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            plan: 'notExists',
          },
        });
      }
      plan = planObjects;
    }

    let customer: User[] | undefined = undefined;

    if (updateSubscriptionDto.customer) {
      const customerObjects = await this.userService.findByIds(
        updateSubscriptionDto.customer.map((entity) => entity.id),
      );
      if (customerObjects.length !== updateSubscriptionDto.customer.length) {
        throw new UnprocessableEntityException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            customer: 'notExists',
          },
        });
      }
      customer = customerObjects;
    }

    return this.customerPlanRepository.update(id, {
      // Do not remove comment below.
      // <updating-property-payload />
      tenant,

      customSchedule: updateSubscriptionDto.customSchedule,

      nextPaymentDate: updateSubscriptionDto.nextPaymentDate,

      assignedBy,

      status: updateSubscriptionDto.status,

      customRates: updateSubscriptionDto.customRates,

      endDate: updateSubscriptionDto.endDate,

      startDate: updateSubscriptionDto.startDate,

      plan,

      customer,
    });
  }

  remove(id: Subscription['id']) {
    return this.customerPlanRepository.remove(id);
  }
}
