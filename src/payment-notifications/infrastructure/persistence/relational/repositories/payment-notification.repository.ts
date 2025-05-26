import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { PaymentNotificationEntity } from '../entities/payment-notification.entity';
import { NullableType } from '../../../../../utils/types/nullable.type';
import { PaymentNotification } from '../../../../domain/payment-notification';
import { PaymentNotificationRepository } from '../../payment-notification.repository';
import { PaymentNotificationMapper } from '../mappers/payment-notification.mapper';
import { IPaginationOptions } from '../../../../../utils/types/pagination-options';

@Injectable()
export class PaymentNotificationRelationalRepository
  implements PaymentNotificationRepository
{
  constructor(
    @InjectRepository(PaymentNotificationEntity)
    private readonly paymentNotificationRepository: Repository<PaymentNotificationEntity>,
  ) {}

  async create(data: PaymentNotification): Promise<PaymentNotification> {
    const persistenceModel = PaymentNotificationMapper.toPersistence(data);
    const newEntity = await this.paymentNotificationRepository.save(
      this.paymentNotificationRepository.create(persistenceModel),
    );
    return PaymentNotificationMapper.toDomain(newEntity);
  }

  async findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<PaymentNotification[]> {
    const entities = await this.paymentNotificationRepository.find({
      skip: (paginationOptions.page - 1) * paginationOptions.limit,
      take: paginationOptions.limit,
    });

    return entities.map((entity) => PaymentNotificationMapper.toDomain(entity));
  }

  async findById(
    id: PaymentNotification['id'],
  ): Promise<NullableType<PaymentNotification>> {
    const entity = await this.paymentNotificationRepository.findOne({
      where: { id },
    });

    return entity ? PaymentNotificationMapper.toDomain(entity) : null;
  }

  async findByIds(
    ids: PaymentNotification['id'][],
  ): Promise<PaymentNotification[]> {
    const entities = await this.paymentNotificationRepository.find({
      where: { id: In(ids) },
    });

    return entities.map((entity) => PaymentNotificationMapper.toDomain(entity));
  }

  async update(
    id: PaymentNotification['id'],
    payload: Partial<PaymentNotification>,
  ): Promise<PaymentNotification> {
    const entity = await this.paymentNotificationRepository.findOne({
      where: { id },
    });

    if (!entity) {
      throw new Error('Record not found');
    }

    const updatedEntity = await this.paymentNotificationRepository.save(
      this.paymentNotificationRepository.create(
        PaymentNotificationMapper.toPersistence({
          ...PaymentNotificationMapper.toDomain(entity),
          ...payload,
        }),
      ),
    );

    return PaymentNotificationMapper.toDomain(updatedEntity);
  }

  async remove(id: PaymentNotification['id']): Promise<void> {
    await this.paymentNotificationRepository.delete(id);
  }
}
