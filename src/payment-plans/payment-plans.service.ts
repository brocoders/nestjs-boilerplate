import {
  // common
  Injectable,
} from '@nestjs/common';
import { CreatePaymentPlanDto } from './dto/create-payment-plan.dto';
import { UpdatePaymentPlanDto } from './dto/update-payment-plan.dto';
import { PaymentPlanRepository } from './infrastructure/persistence/payment-plan.repository';
import { IPaginationOptions } from '../utils/types/pagination-options';
import { PaymentPlan } from './domain/payment-plan';

@Injectable()
export class PaymentPlansService {
  constructor(
    // Dependencies here
    private readonly paymentPlanRepository: PaymentPlanRepository,
  ) {}

  async create(createPaymentPlanDto: CreatePaymentPlanDto) {
    // Do not remove comment below.
    // <creating-property />

    return this.paymentPlanRepository.create({
      // Do not remove comment below.
      // <creating-property-payload />
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

    return this.paymentPlanRepository.update(id, {
      // Do not remove comment below.
      // <updating-property-payload />
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
