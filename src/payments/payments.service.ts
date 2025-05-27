import {
  // common
  Injectable,
} from '@nestjs/common';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { PaymentRepository } from './infrastructure/persistence/payment.repository';
import { IPaginationOptions } from '../utils/types/pagination-options';
import { Payment } from './domain/payment';

@Injectable()
export class PaymentsService {
  constructor(
    // Dependencies here
    private readonly paymentRepository: PaymentRepository,
  ) {}

  async create(createPaymentDto: CreatePaymentDto) {
    // Do not remove comment below.
    // <creating-property />

    return this.paymentRepository.create({
      // Do not remove comment below.
      // <creating-property-payload />
      status: createPaymentDto.status,

      method: createPaymentDto.method,

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

    return this.paymentRepository.update(id, {
      // Do not remove comment below.
      // <updating-property-payload />
      status: updatePaymentDto.status,

      method: updatePaymentDto.method,

      paymentDate: updatePaymentDto.paymentDate,

      amount: updatePaymentDto.amount,
    });
  }

  remove(id: Payment['id']) {
    return this.paymentRepository.remove(id);
  }
}
