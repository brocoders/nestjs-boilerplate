import { Inject, Injectable } from '@nestjs/common';
import { Repository, In, DataSource, FindOptionsWhere } from 'typeorm';
import { PaymentAggregatorEntity } from '../entities/payment-aggregator.entity';
import { NullableType } from '../../../../../utils/types/nullable.type';
import { PaymentAggregator } from '../../../../domain/payment-aggregator';
import { PaymentAggregatorRepository } from '../../payment-aggregator.repository';
import { PaymentAggregatorMapper } from '../mappers/payment-aggregator.mapper';
import { IPaginationOptions } from '../../../../../utils/types/pagination-options';
import { REQUEST } from '@nestjs/core';
import { TenantDataSource } from '../../../../../database/tenant-data-source';

@Injectable()
export class PaymentAggregatorRelationalRepository
  implements PaymentAggregatorRepository
{
  private paymentAggregatorRepository: Repository<PaymentAggregatorEntity>;

  constructor(@Inject(REQUEST) private request: Request) {
    const dataSource: DataSource =
      this.request['tenantDataSource'] || TenantDataSource.getCoreDataSource();
    this.paymentAggregatorRepository = dataSource.getRepository(
      PaymentAggregatorEntity,
    );
  }

  private applyTenantFilter(
    where: FindOptionsWhere<PaymentAggregatorEntity> = {},
  ): FindOptionsWhere<PaymentAggregatorEntity> {
    const tenantId = this.request['tenantId'];

    if (tenantId) {
      return {
        ...where,
        tenant: { id: tenantId },
      };
    }

    return where;
  }

  async create(data: PaymentAggregator): Promise<PaymentAggregator> {
    const persistenceModel = PaymentAggregatorMapper.toPersistence(data);
    const newEntity = await this.paymentAggregatorRepository.save(
      this.paymentAggregatorRepository.create(persistenceModel),
    );
    return PaymentAggregatorMapper.toDomain(newEntity);
  }

  async findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<PaymentAggregator[]> {
    const entities = await this.paymentAggregatorRepository.find({
      skip: (paginationOptions.page - 1) * paginationOptions.limit,
      take: paginationOptions.limit,
      where: this.applyTenantFilter(),
    });

    return entities.map((entity) => PaymentAggregatorMapper.toDomain(entity));
  }

  async findById(
    id: PaymentAggregator['id'],
  ): Promise<NullableType<PaymentAggregator>> {
    const entity = await this.paymentAggregatorRepository.findOne({
      where: this.applyTenantFilter({ id }),
    });

    return entity ? PaymentAggregatorMapper.toDomain(entity) : null;
  }

  async findByIds(
    ids: PaymentAggregator['id'][],
  ): Promise<PaymentAggregator[]> {
    const entities = await this.paymentAggregatorRepository.find({
      where: this.applyTenantFilter({ id: In(ids) }),
    });

    return entities.map((entity) => PaymentAggregatorMapper.toDomain(entity));
  }

  async update(
    id: PaymentAggregator['id'],
    payload: Partial<PaymentAggregator>,
  ): Promise<PaymentAggregator> {
    const entity = await this.paymentAggregatorRepository.findOne({
      where: this.applyTenantFilter({ id }),
    });

    if (!entity) {
      throw new Error('Record not found');
    }

    const updatedEntity = await this.paymentAggregatorRepository.save(
      this.paymentAggregatorRepository.create(
        PaymentAggregatorMapper.toPersistence({
          ...PaymentAggregatorMapper.toDomain(entity),
          ...payload,
        }),
      ),
    );

    return PaymentAggregatorMapper.toDomain(updatedEntity);
  }

  async remove(id: PaymentAggregator['id']): Promise<void> {
    const entity = await this.paymentAggregatorRepository.findOne({
      where: this.applyTenantFilter({ id }),
    });

    if (!entity) {
      throw new Error('Record not found or access denied');
    }

    await this.paymentAggregatorRepository.softDelete(entity.id);
  }
}
