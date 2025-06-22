import { Inject, Injectable } from '@nestjs/common';
import { Repository, In, DataSource, FindOptionsWhere } from 'typeorm';
import { PaymentPlanEntity } from '../entities/payment-plan.entity';
import { NullableType } from '../../../../../utils/types/nullable.type';
import { PaymentPlan } from '../../../../domain/payment-plan';
import { PaymentPlanRepository } from '../../payment-plan.repository';
import { PaymentPlanMapper } from '../mappers/payment-plan.mapper';
import { IPaginationOptions } from '../../../../../utils/types/pagination-options';
import { REQUEST } from '@nestjs/core';
import { TenantDataSource } from '../../../../../database/tenant-data-source';

@Injectable()
export class PaymentPlanRelationalRepository implements PaymentPlanRepository {
  private paymentPlanRepository: Repository<PaymentPlanEntity>;

  constructor(@Inject(REQUEST) private request: Request) {
    const dataSource: DataSource =
      this.request['tenantDataSource'] || TenantDataSource.getCoreDataSource();
    this.paymentPlanRepository = dataSource.getRepository(PaymentPlanEntity);
  }

  private applyTenantFilter(
    where: FindOptionsWhere<PaymentPlanEntity> = {},
  ): FindOptionsWhere<PaymentPlanEntity> {
    const tenantId = this.request['tenantId'];

    if (tenantId) {
      return {
        ...where,
        tenant: { id: tenantId },
      };
    }

    return where;
  }

  async create(data: PaymentPlan): Promise<PaymentPlan> {
    const persistenceModel = PaymentPlanMapper.toPersistence(data);
    const newEntity = await this.paymentPlanRepository.save(
      this.paymentPlanRepository.create(persistenceModel),
    );
    return PaymentPlanMapper.toDomain(newEntity);
  }

  async findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<PaymentPlan[]> {
    const entities = await this.paymentPlanRepository.find({
      skip: (paginationOptions.page - 1) * paginationOptions.limit,
      take: paginationOptions.limit,
      where: this.applyTenantFilter(),
    });

    return entities.map((entity) => PaymentPlanMapper.toDomain(entity));
  }

  async findById(id: PaymentPlan['id']): Promise<NullableType<PaymentPlan>> {
    const entity = await this.paymentPlanRepository.findOne({
      where: this.applyTenantFilter({ id }),
    });

    return entity ? PaymentPlanMapper.toDomain(entity) : null;
  }

  async findByIds(ids: PaymentPlan['id'][]): Promise<PaymentPlan[]> {
    const entities = await this.paymentPlanRepository.find({
      where: this.applyTenantFilter({ id: In(ids) }),
    });

    return entities.map((entity) => PaymentPlanMapper.toDomain(entity));
  }

  async update(
    id: PaymentPlan['id'],
    payload: Partial<PaymentPlan>,
  ): Promise<PaymentPlan> {
    const entity = await this.paymentPlanRepository.findOne({
      where: this.applyTenantFilter({ id }),
    });

    if (!entity) {
      throw new Error('Record not found');
    }

    const updatedEntity = await this.paymentPlanRepository.save(
      this.paymentPlanRepository.create(
        PaymentPlanMapper.toPersistence({
          ...PaymentPlanMapper.toDomain(entity),
          ...payload,
        }),
      ),
    );

    return PaymentPlanMapper.toDomain(updatedEntity);
  }

  async remove(id: PaymentPlan['id']): Promise<void> {
    const entity = await this.paymentPlanRepository.findOne({
      where: this.applyTenantFilter({ id }),
    });

    if (!entity) {
      throw new Error('Record not found or access denied');
    }

    await this.paymentPlanRepository.softDelete(entity.id);
  }
}
