import { Inject, Injectable } from '@nestjs/common';
import { Repository, In, DataSource, FindOptionsWhere } from 'typeorm';
import { PaymentEntity } from '../entities/payment.entity';
import { NullableType } from '../../../../../utils/types/nullable.type';
import { Payment } from '../../../../domain/payment';
import { PaymentRepository } from '../../payment.repository';
import { PaymentMapper } from '../mappers/payment.mapper';
import { IPaginationOptions } from '../../../../../utils/types/pagination-options';
import { REQUEST } from '@nestjs/core';
import { TenantDataSource } from '../../../../../database/tenant-data-source';

@Injectable()
export class PaymentRelationalRepository implements PaymentRepository {
  private paymentRepository: Repository<PaymentEntity>;

  constructor(@Inject(REQUEST) private request: Request) {
    const dataSource: DataSource =
      this.request['tenantDataSource'] || TenantDataSource.getCoreDataSource();
    this.paymentRepository = dataSource.getRepository(PaymentEntity);
  }

  private applyTenantFilter(
    where: FindOptionsWhere<PaymentEntity> = {},
  ): FindOptionsWhere<PaymentEntity> {
    const tenantId = this.request['tenantId'];

    if (tenantId) {
      return {
        ...where,
        tenant: { id: tenantId },
      };
    }

    return where;
  }

  async create(data: Payment): Promise<Payment> {
    const persistenceModel = PaymentMapper.toPersistence(data);
    const newEntity = await this.paymentRepository.save(
      this.paymentRepository.create(persistenceModel),
    );
    return PaymentMapper.toDomain(newEntity);
  }

  async findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<Payment[]> {
    const entities = await this.paymentRepository.find({
      skip: (paginationOptions.page - 1) * paginationOptions.limit,
      take: paginationOptions.limit,
      where: this.applyTenantFilter(),
    });

    return entities.map((entity) => PaymentMapper.toDomain(entity));
  }

  async findById(id: Payment['id']): Promise<NullableType<Payment>> {
    const entity = await this.paymentRepository.findOne({
      where: this.applyTenantFilter({ id }),
    });

    return entity ? PaymentMapper.toDomain(entity) : null;
  }

  async findByIds(ids: Payment['id'][]): Promise<Payment[]> {
    const entities = await this.paymentRepository.find({
      where: this.applyTenantFilter({ id: In(ids) }),
    });

    return entities.map((entity) => PaymentMapper.toDomain(entity));
  }

  async update(id: Payment['id'], payload: Partial<Payment>): Promise<Payment> {
    const entity = await this.paymentRepository.findOne({
      where: this.applyTenantFilter({ id }),
    });

    if (!entity) {
      throw new Error('Record not found');
    }

    const updatedEntity = await this.paymentRepository.save(
      this.paymentRepository.create(
        PaymentMapper.toPersistence({
          ...PaymentMapper.toDomain(entity),
          ...payload,
        }),
      ),
    );

    return PaymentMapper.toDomain(updatedEntity);
  }

  async remove(id: Payment['id']): Promise<void> {
    const entity = await this.paymentRepository.findOne({
      where: this.applyTenantFilter({ id }),
    });

    if (!entity) {
      throw new Error('Record not found or access denied');
    }

    await this.paymentRepository.softDelete(entity.id);
  }
}
