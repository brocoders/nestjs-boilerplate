import { TenantsService } from '../tenants/tenants.service';
import { Tenant } from '../tenants/domain/tenant';

import {
  // common
  Injectable,
  HttpStatus,
  UnprocessableEntityException,
} from '@nestjs/common';
import { CreatePaymentPlanDto } from './dto/create-payment-plan.dto';
import { UpdatePaymentPlanDto } from './dto/update-payment-plan.dto';
import { PaymentPlanRepository } from './infrastructure/persistence/payment-plan.repository';
import { IPaginationOptions } from '../utils/types/pagination-options';
import { PaymentPlan } from './domain/payment-plan';

@Injectable()
export class PaymentPlansService {
  constructor(
    private readonly tenantService: TenantsService,

    // Dependencies here
    private readonly paymentPlanRepository: PaymentPlanRepository,
  ) {}

  async create(createPaymentPlanDto: CreatePaymentPlanDto) {
    // Do not remove comment below.
    // <creating-property />

    const tenantObject = await this.tenantService.findById(
      createPaymentPlanDto.tenant.id,
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

    return this.paymentPlanRepository.create({
      // Do not remove comment below.
      // <creating-property-payload />
      description: createPaymentPlanDto.description,

      name: createPaymentPlanDto.name,

      tenant,

      isActive: createPaymentPlanDto.isActive,

      unit: createPaymentPlanDto.unit,

      minimumCharge: createPaymentPlanDto.minimumCharge,

      rateStructure: createPaymentPlanDto.rateStructure,

      type: createPaymentPlanDto.type,
    });
  }

  findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }) {
    return this.paymentPlanRepository.findAllWithPagination({
      paginationOptions: {
        page: paginationOptions.page,
        limit: paginationOptions.limit,
      },
    });
  }

  findById(id: PaymentPlan['id']) {
    return this.paymentPlanRepository.findById(id);
  }

  findByIds(ids: PaymentPlan['id'][]) {
    return this.paymentPlanRepository.findByIds(ids);
  }

  async update(
    id: PaymentPlan['id'],

    updatePaymentPlanDto: UpdatePaymentPlanDto,
  ) {
    // Do not remove comment below.
    // <updating-property />

    let tenant: Tenant | undefined = undefined;

    if (updatePaymentPlanDto.tenant) {
      const tenantObject = await this.tenantService.findById(
        updatePaymentPlanDto.tenant.id,
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

    return this.paymentPlanRepository.update(id, {
      // Do not remove comment below.
      // <updating-property-payload />
      description: updatePaymentPlanDto.description,

      name: updatePaymentPlanDto.name,

      tenant,

      isActive: updatePaymentPlanDto.isActive,

      unit: updatePaymentPlanDto.unit,

      minimumCharge: updatePaymentPlanDto.minimumCharge,

      rateStructure: updatePaymentPlanDto.rateStructure,

      type: updatePaymentPlanDto.type,
    });
  }

  remove(id: PaymentPlan['id']) {
    return this.paymentPlanRepository.remove(id);
  }
}
