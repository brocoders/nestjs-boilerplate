import { PaymentAggregatorsService } from '../payment-aggregators/payment-aggregators.service';
import { PaymentAggregator } from '../payment-aggregators/domain/payment-aggregator';

import {
  // common
  Injectable,
  HttpStatus,
  UnprocessableEntityException,
  Inject,
  forwardRef,
} from '@nestjs/common';
import { CreatePaymentNotificationDto } from './dto/create-payment-notification.dto';
import { UpdatePaymentNotificationDto } from './dto/update-payment-notification.dto';
import { PaymentNotificationRepository } from './infrastructure/persistence/payment-notification.repository';
import { IPaginationOptions } from '../utils/types/pagination-options';
import { PaymentNotification } from './domain/payment-notification';

@Injectable()
export class PaymentNotificationsService {
  constructor(
    @Inject(forwardRef(() => PaymentAggregatorsService))
    private readonly paymentAggregatorService: PaymentAggregatorsService,

    // Dependencies here
    private readonly paymentNotificationRepository: PaymentNotificationRepository,
  ) {}

  async create(createPaymentNotificationDto: CreatePaymentNotificationDto) {
    // Do not remove comment below.
    // <creating-property />
    const aggregatorObject = await this.paymentAggregatorService.findById(
      createPaymentNotificationDto.aggregator.id,
    );
    if (!aggregatorObject) {
      throw new UnprocessableEntityException({
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        errors: {
          aggregator: 'notExists',
        },
      });
    }
    const aggregator = aggregatorObject;

    return this.paymentNotificationRepository.create({
      // Do not remove comment below.
      // <creating-property-payload />
      aggregator,

      processed_at: createPaymentNotificationDto.processed_at,

      processed: createPaymentNotificationDto.processed,

      raw_payload: createPaymentNotificationDto.raw_payload,

      status: createPaymentNotificationDto.status,

      received_at: createPaymentNotificationDto.received_at,

      payment_method: createPaymentNotificationDto.payment_method,

      currency: createPaymentNotificationDto.currency,

      amount: createPaymentNotificationDto.amount,

      external_txn_id: createPaymentNotificationDto.external_txn_id,

      provider: createPaymentNotificationDto.provider,
    });
  }

  findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }) {
    return this.paymentNotificationRepository.findAllWithPagination({
      paginationOptions: {
        page: paginationOptions.page,
        limit: paginationOptions.limit,
      },
    });
  }

  findById(id: PaymentNotification['id']) {
    return this.paymentNotificationRepository.findById(id);
  }

  findByIds(ids: PaymentNotification['id'][]) {
    return this.paymentNotificationRepository.findByIds(ids);
  }

  async update(
    id: PaymentNotification['id'],

    updatePaymentNotificationDto: UpdatePaymentNotificationDto,
  ) {
    // Do not remove comment below.
    // <updating-property />
    let aggregator: PaymentAggregator | undefined = undefined;

    if (updatePaymentNotificationDto.aggregator) {
      const aggregatorObject = await this.paymentAggregatorService.findById(
        updatePaymentNotificationDto.aggregator.id,
      );
      if (!aggregatorObject) {
        throw new UnprocessableEntityException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            aggregator: 'notExists',
          },
        });
      }
      aggregator = aggregatorObject;
    }

    return this.paymentNotificationRepository.update(id, {
      // Do not remove comment below.
      // <updating-property-payload />
      aggregator,

      processed_at: updatePaymentNotificationDto.processed_at,

      processed: updatePaymentNotificationDto.processed,

      raw_payload: updatePaymentNotificationDto.raw_payload,

      status: updatePaymentNotificationDto.status,

      received_at: updatePaymentNotificationDto.received_at,

      payment_method: updatePaymentNotificationDto.payment_method,

      currency: updatePaymentNotificationDto.currency,

      amount: updatePaymentNotificationDto.amount,

      external_txn_id: updatePaymentNotificationDto.external_txn_id,

      provider: updatePaymentNotificationDto.provider,
    });
  }

  remove(id: PaymentNotification['id']) {
    return this.paymentNotificationRepository.remove(id);
  }
}
