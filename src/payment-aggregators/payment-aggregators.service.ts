import {
  // common
  Injectable,
} from '@nestjs/common';
import { CreatePaymentAggregatorDto } from './dto/create-payment-aggregator.dto';
import { UpdatePaymentAggregatorDto } from './dto/update-payment-aggregator.dto';
import { PaymentAggregatorRepository } from './infrastructure/persistence/payment-aggregator.repository';
import { IPaginationOptions } from '../utils/types/pagination-options';
import { PaymentAggregator } from './domain/payment-aggregator';

@Injectable()
export class PaymentAggregatorsService {
  constructor(
    // Dependencies here
    private readonly paymentAggregatorRepository: PaymentAggregatorRepository,
  ) {}

  async create(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    createPaymentAggregatorDto: CreatePaymentAggregatorDto,
  ) {
    // Do not remove comment below.
    // <creating-property />

    return this.paymentAggregatorRepository.create({
      // Do not remove comment below.
      // <creating-property-payload />
    });
  }

  findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }) {
    return this.paymentAggregatorRepository.findAllWithPagination({
      paginationOptions: {
        page: paginationOptions.page,
        limit: paginationOptions.limit,
      },
    });
  }

  findById(id: PaymentAggregator['id']) {
    return this.paymentAggregatorRepository.findById(id);
  }

  findByIds(ids: PaymentAggregator['id'][]) {
    return this.paymentAggregatorRepository.findByIds(ids);
  }

  async update(
    id: PaymentAggregator['id'],
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    updatePaymentAggregatorDto: UpdatePaymentAggregatorDto,
  ) {
    // Do not remove comment below.
    // <updating-property />

    return this.paymentAggregatorRepository.update(id, {
      // Do not remove comment below.
      // <updating-property-payload />
    });
  }

  remove(id: PaymentAggregator['id']) {
    return this.paymentAggregatorRepository.remove(id);
  }
}
