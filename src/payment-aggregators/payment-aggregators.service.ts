import { PaymentNotificationsService } from '../payment-notifications/payment-notifications.service';
import { PaymentNotification } from '../payment-notifications/domain/payment-notification';

import {
  // common
  Injectable,
  HttpStatus,
  UnprocessableEntityException,
  Inject,
  forwardRef,
} from '@nestjs/common';
import { CreatePaymentAggregatorDto } from './dto/create-payment-aggregator.dto';
import { UpdatePaymentAggregatorDto } from './dto/update-payment-aggregator.dto';
import { PaymentAggregatorRepository } from './infrastructure/persistence/payment-aggregator.repository';
import { IPaginationOptions } from '../utils/types/pagination-options';
import { PaymentAggregator } from './domain/payment-aggregator';

@Injectable()
export class PaymentAggregatorsService {
  constructor(
    @Inject(forwardRef(() => PaymentNotificationsService))
    private readonly paymentNotificationService: PaymentNotificationsService,

    // Dependencies here
    private readonly paymentAggregatorRepository: PaymentAggregatorRepository,
  ) {}

  async create(createPaymentAggregatorDto: CreatePaymentAggregatorDto) {
    // Do not remove comment below.
    // <creating-property />

    let notifications: PaymentNotification[] | null | undefined = undefined;

    if (createPaymentAggregatorDto.notifications) {
      const notificationsObjects =
        await this.paymentNotificationService.findByIds(
          createPaymentAggregatorDto.notifications.map((entity) => entity.id),
        );
      if (
        notificationsObjects.length !==
        createPaymentAggregatorDto.notifications.length
      ) {
        throw new UnprocessableEntityException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            notifications: 'notExists',
          },
        });
      }
      notifications = notificationsObjects;
    } else if (createPaymentAggregatorDto.notifications === null) {
      notifications = null;
    }

    return this.paymentAggregatorRepository.create({
      // Do not remove comment below.
      // <creating-property-payload />
      config: createPaymentAggregatorDto.config,

      name: createPaymentAggregatorDto.name,

      notifications,
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

    updatePaymentAggregatorDto: UpdatePaymentAggregatorDto,
  ) {
    // Do not remove comment below.
    // <updating-property />

    let notifications: PaymentNotification[] | null | undefined = undefined;

    if (updatePaymentAggregatorDto.notifications) {
      const notificationsObjects =
        await this.paymentNotificationService.findByIds(
          updatePaymentAggregatorDto.notifications.map((entity) => entity.id),
        );
      if (
        notificationsObjects.length !==
        updatePaymentAggregatorDto.notifications.length
      ) {
        throw new UnprocessableEntityException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            notifications: 'notExists',
          },
        });
      }
      notifications = notificationsObjects;
    } else if (updatePaymentAggregatorDto.notifications === null) {
      notifications = null;
    }

    return this.paymentAggregatorRepository.update(id, {
      // Do not remove comment below.
      // <updating-property-payload />
      config: updatePaymentAggregatorDto.config,

      name: updatePaymentAggregatorDto.name,

      notifications,
    });
  }

  remove(id: PaymentAggregator['id']) {
    return this.paymentAggregatorRepository.remove(id);
  }
}
