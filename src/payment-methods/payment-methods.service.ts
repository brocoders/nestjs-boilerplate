import {
  // common
  Injectable,
} from '@nestjs/common';
import { CreatePaymentMethodDto } from './dto/create-payment-method.dto';
import { UpdatePaymentMethodDto } from './dto/update-payment-method.dto';
import { PaymentMethodRepository } from './infrastructure/persistence/payment-method.repository';
import { IPaginationOptions } from '../utils/types/pagination-options';
import { PaymentMethod } from './domain/payment-method';

@Injectable()
export class PaymentMethodsService {
  constructor(
    // Dependencies here
    private readonly paymentMethodRepository: PaymentMethodRepository,
  ) {}

  async create(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    createPaymentMethodDto: CreatePaymentMethodDto,
  ) {
    // Do not remove comment below.
    // <creating-property />

    return this.paymentMethodRepository.create({
      // Do not remove comment below.
      // <creating-property-payload />
    });
  }

  findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }) {
    return this.paymentMethodRepository.findAllWithPagination({
      paginationOptions: {
        page: paginationOptions.page,
        limit: paginationOptions.limit,
      },
    });
  }

  findById(id: PaymentMethod['id']) {
    return this.paymentMethodRepository.findById(id);
  }

  findByIds(ids: PaymentMethod['id'][]) {
    return this.paymentMethodRepository.findByIds(ids);
  }

  async update(
    id: PaymentMethod['id'],
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    updatePaymentMethodDto: UpdatePaymentMethodDto,
  ) {
    // Do not remove comment below.
    // <updating-property />

    return this.paymentMethodRepository.update(id, {
      // Do not remove comment below.
      // <updating-property-payload />
    });
  }

  remove(id: PaymentMethod['id']) {
    return this.paymentMethodRepository.remove(id);
  }
}
