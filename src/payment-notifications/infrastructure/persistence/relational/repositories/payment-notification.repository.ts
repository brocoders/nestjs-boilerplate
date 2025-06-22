import { Inject, Injectable } from '@nestjs/common';
import { Repository, In, DataSource, FindOptionsWhere } from 'typeorm';
import { PaymentNotificationEntity } from '../entities/payment-notification.entity';
import { NullableType } from '../../../../../utils/types/nullable.type';
import { PaymentNotification } from '../../../../domain/payment-notification';
import { PaymentNotificationRepository } from '../../payment-notification.repository';
import { PaymentNotificationMapper } from '../mappers/payment-notification.mapper';
import { IPaginationOptions } from '../../../../../utils/types/pagination-options';
import { REQUEST } from '@nestjs/core';
import { TenantDataSource } from '../../../../../database/tenant-data-source';

@Injectable()
export class PaymentNotificationRelationalRepository
  implements PaymentNotificationRepository
{
  private paymentNotificationRepository: Repository<PaymentNotificationEntity>;

  constructor(@Inject(REQUEST) private request: Request) {
    const dataSource: DataSource =
      this.request['tenantDataSource'] || TenantDataSource.getCoreDataSource();
    this.paymentNotificationRepository = dataSource.getRepository(
      PaymentNotificationEntity,
    );
  }

  private applyTenantFilter(
    where: FindOptionsWhere<PaymentNotificationEntity> = {},
  ): FindOptionsWhere<PaymentNotificationEntity> {
    const tenantId = this.request['tenantId'];

    if (tenantId) {
      return {
        ...where,
        tenant: { id: tenantId },
      };
    }

    return where;
  }

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
      where: this.applyTenantFilter(),
    });

    return entities.map((entity) => PaymentNotificationMapper.toDomain(entity));
  }

  async findById(
    id: PaymentNotification['id'],
  ): Promise<NullableType<PaymentNotification>> {
    const entity = await this.paymentNotificationRepository.findOne({
      where: this.applyTenantFilter({ id }),
    });

    return entity ? PaymentNotificationMapper.toDomain(entity) : null;
  }

  async findByIds(
    ids: PaymentNotification['id'][],
  ): Promise<PaymentNotification[]> {
    const entities = await this.paymentNotificationRepository.find({
      where: this.applyTenantFilter({ id: In(ids) }),
    });

    return entities.map((entity) => PaymentNotificationMapper.toDomain(entity));
  }

  async update(
    id: PaymentNotification['id'],
    payload: Partial<PaymentNotification>,
  ): Promise<PaymentNotification> {
    const entity = await this.paymentNotificationRepository.findOne({
      where: this.applyTenantFilter({ id }),
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
    const entity = await this.paymentNotificationRepository.findOne({
      where: this.applyTenantFilter({ id }),
    });

    if (!entity) {
      throw new Error('Record not found or access denied');
    }

    await this.paymentNotificationRepository.softDelete(entity.id);
  }
}
