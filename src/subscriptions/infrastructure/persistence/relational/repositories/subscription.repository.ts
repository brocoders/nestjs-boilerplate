import { Inject, Injectable } from '@nestjs/common';
import { Repository, In, DataSource, FindOptionsWhere } from 'typeorm';
import { SubscriptionEntity } from '../entities/subscription.entity';
import { NullableType } from '../../../../../utils/types/nullable.type';
import { Subscription } from '../../../../domain/subscription';
import { SubscriptionRepository } from '../../subscription.repository';
import { SubscriptionMapper } from '../mappers/subscription.mapper';
import { IPaginationOptions } from '../../../../../utils/types/pagination-options';
import { REQUEST } from '@nestjs/core';
import { TenantDataSource } from '../../../../../database/tenant-data-source';

@Injectable()
export class SubscriptionRelationalRepository
  implements SubscriptionRepository
{
  private customerPlanRepository: Repository<SubscriptionEntity>;

  constructor(@Inject(REQUEST) private request: Request) {
    const dataSource: DataSource =
      this.request['tenantDataSource'] || TenantDataSource.getCoreDataSource();
    this.customerPlanRepository = dataSource.getRepository(SubscriptionEntity);
  }

  private applyTenantFilter(
    where: FindOptionsWhere<SubscriptionEntity> = {},
  ): FindOptionsWhere<SubscriptionEntity> {
    const tenantId = this.request['tenantId'];

    if (tenantId) {
      return {
        ...where,
        tenant: { id: tenantId },
      };
    }

    return where;
  }

  async create(data: Subscription): Promise<Subscription> {
    const persistenceModel = SubscriptionMapper.toPersistence(data);
    const newEntity = await this.customerPlanRepository.save(
      this.customerPlanRepository.create(persistenceModel),
    );
    return SubscriptionMapper.toDomain(newEntity);
  }

  async findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<Subscription[]> {
    const entities = await this.customerPlanRepository.find({
      skip: (paginationOptions.page - 1) * paginationOptions.limit,
      take: paginationOptions.limit,
      where: this.applyTenantFilter(),
    });

    return entities.map((entity) => SubscriptionMapper.toDomain(entity));
  }

  async findById(id: Subscription['id']): Promise<NullableType<Subscription>> {
    const entity = await this.customerPlanRepository.findOne({
      where: this.applyTenantFilter({ id }),
    });

    return entity ? SubscriptionMapper.toDomain(entity) : null;
  }

  async findByIds(ids: Subscription['id'][]): Promise<Subscription[]> {
    const entities = await this.customerPlanRepository.find({
      where: this.applyTenantFilter({ id: In(ids) }),
    });

    return entities.map((entity) => SubscriptionMapper.toDomain(entity));
  }

  async update(
    id: Subscription['id'],
    payload: Partial<Subscription>,
  ): Promise<Subscription> {
    const entity = await this.customerPlanRepository.findOne({
      where: this.applyTenantFilter({ id }),
    });

    if (!entity) {
      throw new Error('Record not found');
    }

    const updatedEntity = await this.customerPlanRepository.save(
      this.customerPlanRepository.create(
        SubscriptionMapper.toPersistence({
          ...SubscriptionMapper.toDomain(entity),
          ...payload,
        }),
      ),
    );

    return SubscriptionMapper.toDomain(updatedEntity);
  }

  async remove(id: Subscription['id']): Promise<void> {
    const entity = await this.customerPlanRepository.findOne({
      where: this.applyTenantFilter({ id }),
    });

    if (!entity) {
      throw new Error('Record not found or access denied');
    }

    await this.customerPlanRepository.softDelete(entity.id);
  }
}
