import { RegionsService } from '../regions/regions.service';
import { Region } from '../regions/domain/region';

import { UsersService } from '../users/users.service';
import { User } from '../users/domain/user';

import { PaymentPlansService } from '../payment-plans/payment-plans.service';
import { PaymentPlan } from '../payment-plans/domain/payment-plan';

import {
  // common
  Injectable,
  HttpStatus,
  UnprocessableEntityException,
} from '@nestjs/common';
import { CreateDiscountDto } from './dto/create-discount.dto';
import { UpdateDiscountDto } from './dto/update-discount.dto';
import { DiscountRepository } from './infrastructure/persistence/discount.repository';
import { IPaginationOptions } from '../utils/types/pagination-options';
import { Discount } from './domain/discount';

@Injectable()
export class DiscountsService {
  constructor(
    private readonly regionService: RegionsService,

    private readonly userService: UsersService,

    private readonly paymentPlanService: PaymentPlansService,

    // Dependencies here
    private readonly discountRepository: DiscountRepository,
  ) {}

  async create(createDiscountDto: CreateDiscountDto) {
    // Do not remove comment below.
    // <creating-property />
    let region: Region | null | undefined = undefined;

    if (createDiscountDto.region) {
      const regionObject = await this.regionService.findById(
        createDiscountDto.region.id,
      );
      if (!regionObject) {
        throw new UnprocessableEntityException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            region: 'notExists',
          },
        });
      }
      region = regionObject;
    } else if (createDiscountDto.region === null) {
      region = null;
    }

    let customer: User | null | undefined = undefined;

    if (createDiscountDto.customer) {
      const customerObject = await this.userService.findById(
        createDiscountDto.customer.id,
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
    } else if (createDiscountDto.customer === null) {
      customer = null;
    }

    let plan: PaymentPlan | null | undefined = undefined;

    if (createDiscountDto.plan) {
      const planObject = await this.paymentPlanService.findById(
        createDiscountDto.plan.id,
      );
      if (!planObject) {
        throw new UnprocessableEntityException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            plan: 'notExists',
          },
        });
      }
      plan = planObject;
    } else if (createDiscountDto.plan === null) {
      plan = null;
    }

    return this.discountRepository.create({
      // Do not remove comment below.
      // <creating-property-payload />
      region,

      customer,

      plan,

      isActive: createDiscountDto.isActive,

      validTo: createDiscountDto.validTo,

      validFrom: createDiscountDto.validFrom,

      value: createDiscountDto.value,

      type: createDiscountDto.type,
    });
  }

  findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }) {
    return this.discountRepository.findAllWithPagination({
      paginationOptions: {
        page: paginationOptions.page,
        limit: paginationOptions.limit,
      },
    });
  }

  findById(id: Discount['id']) {
    return this.discountRepository.findById(id);
  }

  findByIds(ids: Discount['id'][]) {
    return this.discountRepository.findByIds(ids);
  }

  async update(
    id: Discount['id'],

    updateDiscountDto: UpdateDiscountDto,
  ) {
    // Do not remove comment below.
    // <updating-property />
    let region: Region | null | undefined = undefined;

    if (updateDiscountDto.region) {
      const regionObject = await this.regionService.findById(
        updateDiscountDto.region.id,
      );
      if (!regionObject) {
        throw new UnprocessableEntityException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            region: 'notExists',
          },
        });
      }
      region = regionObject;
    } else if (updateDiscountDto.region === null) {
      region = null;
    }

    let customer: User | null | undefined = undefined;

    if (updateDiscountDto.customer) {
      const customerObject = await this.userService.findById(
        updateDiscountDto.customer.id,
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
    } else if (updateDiscountDto.customer === null) {
      customer = null;
    }

    let plan: PaymentPlan | null | undefined = undefined;

    if (updateDiscountDto.plan) {
      const planObject = await this.paymentPlanService.findById(
        updateDiscountDto.plan.id,
      );
      if (!planObject) {
        throw new UnprocessableEntityException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            plan: 'notExists',
          },
        });
      }
      plan = planObject;
    } else if (updateDiscountDto.plan === null) {
      plan = null;
    }

    return this.discountRepository.update(id, {
      // Do not remove comment below.
      // <updating-property-payload />
      region,

      customer,

      plan,

      isActive: updateDiscountDto.isActive,

      validTo: updateDiscountDto.validTo,

      validFrom: updateDiscountDto.validFrom,

      value: updateDiscountDto.value,

      type: updateDiscountDto.type,
    });
  }

  remove(id: Discount['id']) {
    return this.discountRepository.remove(id);
  }
}
