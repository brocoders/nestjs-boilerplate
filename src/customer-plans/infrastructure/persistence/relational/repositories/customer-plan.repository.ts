import { Inject, Injectable } from '@nestjs/common';
import { Repository, In, DataSource, FindOptionsWhere } from 'typeorm';
import { CustomerPlanEntity } from '../entities/customer-plan.entity';
import { NullableType } from '../../../../../utils/types/nullable.type';
import { CustomerPlan } from '../../../../domain/customer-plan';
import { CustomerPlanRepository } from '../../customer-plan.repository';
import { CustomerPlanMapper } from '../mappers/customer-plan.mapper';
import { IPaginationOptions } from '../../../../../utils/types/pagination-options';
import { REQUEST } from '@nestjs/core';
import { TenantDataSource } from '../../../../../database/tenant-data-source';

@Injectable()
export class CustomerPlanRelationalRepository
  implements CustomerPlanRepository
{
  private customerPlanRepository: Repository<CustomerPlanEntity>;

  constructor(@Inject(REQUEST) private request: Request) {
    const dataSource: DataSource =
      this.request['tenantDataSource'] || TenantDataSource.getCoreDataSource();
    this.customerPlanRepository = dataSource.getRepository(CustomerPlanEntity);
  }

  private applyTenantFilter(
    where: FindOptionsWhere<CustomerPlanEntity> = {},
  ): FindOptionsWhere<CustomerPlanEntity> {
    const tenantId = this.request['tenantId'];

    if (tenantId) {
      return {
        ...where,
        tenant: { id: tenantId },
      };
    }

    return where;
  }

  async create(data: CustomerPlan): Promise<CustomerPlan> {
    const persistenceModel = CustomerPlanMapper.toPersistence(data);
    const newEntity = await this.customerPlanRepository.save(
      this.customerPlanRepository.create(persistenceModel),
    );
    return CustomerPlanMapper.toDomain(newEntity);
  }

  async findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<CustomerPlan[]> {
    const entities = await this.customerPlanRepository.find({
      skip: (paginationOptions.page - 1) * paginationOptions.limit,
      take: paginationOptions.limit,
      where: this.applyTenantFilter(),
    });

    return entities.map((entity) => CustomerPlanMapper.toDomain(entity));
  }

  async findById(id: CustomerPlan['id']): Promise<NullableType<CustomerPlan>> {
    const entity = await this.customerPlanRepository.findOne({
      where: this.applyTenantFilter({ id }),
    });

    return entity ? CustomerPlanMapper.toDomain(entity) : null;
  }

  async findByIds(ids: CustomerPlan['id'][]): Promise<CustomerPlan[]> {
    const entities = await this.customerPlanRepository.find({
      where: this.applyTenantFilter({ id: In(ids) }),
    });

    return entities.map((entity) => CustomerPlanMapper.toDomain(entity));
  }

  async update(
    id: CustomerPlan['id'],
    payload: Partial<CustomerPlan>,
  ): Promise<CustomerPlan> {
    const entity = await this.customerPlanRepository.findOne({
      where: this.applyTenantFilter({ id }),
    });

    if (!entity) {
      throw new Error('Record not found');
    }

    const updatedEntity = await this.customerPlanRepository.save(
      this.customerPlanRepository.create(
        CustomerPlanMapper.toPersistence({
          ...CustomerPlanMapper.toDomain(entity),
          ...payload,
        }),
      ),
    );

    return CustomerPlanMapper.toDomain(updatedEntity);
  }

  async remove(id: CustomerPlan['id']): Promise<void> {
    const entity = await this.customerPlanRepository.findOne({
      where: this.applyTenantFilter({ id }),
    });

    if (!entity) {
      throw new Error('Record not found or access denied');
    }

    await this.customerPlanRepository.softDelete(entity.id);
  }
}
