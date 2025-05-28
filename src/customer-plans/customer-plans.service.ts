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
import { CreateCustomerPlanDto } from './dto/create-customer-plan.dto';
import { UpdateCustomerPlanDto } from './dto/update-customer-plan.dto';
import { CustomerPlanRepository } from './infrastructure/persistence/customer-plan.repository';
import { IPaginationOptions } from '../utils/types/pagination-options';
import { CustomerPlan } from './domain/customer-plan';

@Injectable()
export class CustomerPlansService {
  constructor(
    private readonly paymentPlanService: PaymentPlansService,

    private readonly userService: UsersService,

    // Dependencies here
    private readonly customerPlanRepository: CustomerPlanRepository,
  ) {}

  async create(createCustomerPlanDto: CreateCustomerPlanDto) {
    // Do not remove comment below.
    // <creating-property />

    let assignedBy: User | null | undefined = undefined;

    if (createCustomerPlanDto.assignedBy) {
      const assignedByObject = await this.userService.findById(
        createCustomerPlanDto.assignedBy.id,
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
    } else if (createCustomerPlanDto.assignedBy === null) {
      assignedBy = null;
    }

    const planObjects = await this.paymentPlanService.findByIds(
      createCustomerPlanDto.plan.map((entity) => entity.id),
    );
    if (planObjects.length !== createCustomerPlanDto.plan.length) {
      throw new UnprocessableEntityException({
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        errors: {
          plan: 'notExists',
        },
      });
    }
    const plan = planObjects;

    const customerObjects = await this.userService.findByIds(
      createCustomerPlanDto.customer.map((entity) => entity.id),
    );
    if (customerObjects.length !== createCustomerPlanDto.customer.length) {
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
      customSchedule: createCustomerPlanDto.customSchedule,

      nextPaymentDate: createCustomerPlanDto.nextPaymentDate,

      assignedBy,

      status: createCustomerPlanDto.status,

      customRates: createCustomerPlanDto.customRates,

      endDate: createCustomerPlanDto.endDate,

      startDate: createCustomerPlanDto.startDate,

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

  findById(id: CustomerPlan['id']) {
    return this.customerPlanRepository.findById(id);
  }

  findByIds(ids: CustomerPlan['id'][]) {
    return this.customerPlanRepository.findByIds(ids);
  }

  async update(
    id: CustomerPlan['id'],

    updateCustomerPlanDto: UpdateCustomerPlanDto,
  ) {
    // Do not remove comment below.
    // <updating-property />

    let assignedBy: User | null | undefined = undefined;

    if (updateCustomerPlanDto.assignedBy) {
      const assignedByObject = await this.userService.findById(
        updateCustomerPlanDto.assignedBy.id,
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
    } else if (updateCustomerPlanDto.assignedBy === null) {
      assignedBy = null;
    }

    let plan: PaymentPlan[] | undefined = undefined;

    if (updateCustomerPlanDto.plan) {
      const planObjects = await this.paymentPlanService.findByIds(
        updateCustomerPlanDto.plan.map((entity) => entity.id),
      );
      if (planObjects.length !== updateCustomerPlanDto.plan.length) {
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

    if (updateCustomerPlanDto.customer) {
      const customerObjects = await this.userService.findByIds(
        updateCustomerPlanDto.customer.map((entity) => entity.id),
      );
      if (customerObjects.length !== updateCustomerPlanDto.customer.length) {
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
      customSchedule: updateCustomerPlanDto.customSchedule,

      nextPaymentDate: updateCustomerPlanDto.nextPaymentDate,

      assignedBy,

      status: updateCustomerPlanDto.status,

      customRates: updateCustomerPlanDto.customRates,

      endDate: updateCustomerPlanDto.endDate,

      startDate: updateCustomerPlanDto.startDate,

      plan,

      customer,
    });
  }

  remove(id: CustomerPlan['id']) {
    return this.customerPlanRepository.remove(id);
  }
}
