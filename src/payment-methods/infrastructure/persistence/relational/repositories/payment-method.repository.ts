import { Inject, Injectable } from '@nestjs/common';
import { Repository, In, DataSource, FindOptionsWhere } from 'typeorm';
import { PaymentMethodEntity } from '../entities/payment-method.entity';
import { NullableType } from '../../../../../utils/types/nullable.type';
import { PaymentMethod } from '../../../../domain/payment-method';
import { PaymentMethodRepository } from '../../payment-method.repository';
import { PaymentMethodMapper } from '../mappers/payment-method.mapper';
import { IPaginationOptions } from '../../../../../utils/types/pagination-options';
import { REQUEST } from '@nestjs/core';
import { TenantDataSource } from '../../../../../database/tenant-data-source';

@Injectable()
export class PaymentMethodRelationalRepository
  implements PaymentMethodRepository
{
  private paymentMethodRepository: Repository<PaymentMethodEntity>;

  constructor(@Inject(REQUEST) private request: Request) {
    const dataSource: DataSource =
      this.request['tenantDataSource'] || TenantDataSource.getCoreDataSource();
    this.paymentMethodRepository =
      dataSource.getRepository(PaymentMethodEntity);
  }

  private applyTenantFilter(
    where: FindOptionsWhere<PaymentMethodEntity> = {},
  ): FindOptionsWhere<PaymentMethodEntity> {
    const tenantId = this.request['tenantId'];

    if (tenantId) {
      return {
        ...where,
        tenant: { id: tenantId },
      };
    }

    return where;
  }

  async create(data: PaymentMethod): Promise<PaymentMethod> {
    const persistenceModel = PaymentMethodMapper.toPersistence(data);
    const newEntity = await this.paymentMethodRepository.save(
      this.paymentMethodRepository.create(persistenceModel),
    );
    return PaymentMethodMapper.toDomain(newEntity);
  }

  async findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<PaymentMethod[]> {
    const entities = await this.paymentMethodRepository.find({
      skip: (paginationOptions.page - 1) * paginationOptions.limit,
      take: paginationOptions.limit,
      where: this.applyTenantFilter(),
    });

    return entities.map((entity) => PaymentMethodMapper.toDomain(entity));
  }

  async findById(
    id: PaymentMethod['id'],
  ): Promise<NullableType<PaymentMethod>> {
    const entity = await this.paymentMethodRepository.findOne({
      where: this.applyTenantFilter({ id }),
    });

    return entity ? PaymentMethodMapper.toDomain(entity) : null;
  }

  async findByIds(ids: PaymentMethod['id'][]): Promise<PaymentMethod[]> {
    const entities = await this.paymentMethodRepository.find({
      where: this.applyTenantFilter({ id: In(ids) }),
    });

    return entities.map((entity) => PaymentMethodMapper.toDomain(entity));
  }

  async update(
    id: PaymentMethod['id'],
    payload: Partial<PaymentMethod>,
  ): Promise<PaymentMethod> {
    const entity = await this.paymentMethodRepository.findOne({
      where: this.applyTenantFilter({ id }),
    });

    if (!entity) {
      throw new Error('Record not found');
    }

    const updatedEntity = await this.paymentMethodRepository.save(
      this.paymentMethodRepository.create(
        PaymentMethodMapper.toPersistence({
          ...PaymentMethodMapper.toDomain(entity),
          ...payload,
        }),
      ),
    );

    return PaymentMethodMapper.toDomain(updatedEntity);
  }

  async remove(id: PaymentMethod['id']): Promise<void> {
    const entity = await this.paymentMethodRepository.findOne({
      where: this.applyTenantFilter({ id }),
    });

    if (!entity) {
      throw new Error('Record not found or access denied');
    }

    await this.paymentMethodRepository.softDelete(entity.id);
  }
}
