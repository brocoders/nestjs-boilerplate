import { Inject, Injectable } from '@nestjs/common';
import { Repository, In, DataSource, FindOptionsWhere } from 'typeorm';
import { DiscountEntity } from '../entities/discount.entity';
import { NullableType } from '../../../../../utils/types/nullable.type';
import { Discount } from '../../../../domain/discount';
import { DiscountRepository } from '../../discount.repository';
import { DiscountMapper } from '../mappers/discount.mapper';
import { IPaginationOptions } from '../../../../../utils/types/pagination-options';
import { REQUEST } from '@nestjs/core';
import { TenantDataSource } from '../../../../../database/tenant-data-source';

@Injectable()
export class DiscountRelationalRepository implements DiscountRepository {
  private discountRepository: Repository<DiscountEntity>;

  constructor(@Inject(REQUEST) private request: Request) {
    const dataSource: DataSource =
      this.request['tenantDataSource'] || TenantDataSource.getCoreDataSource();
    this.discountRepository = dataSource.getRepository(DiscountEntity);
  }

  private applyTenantFilter(
    where: FindOptionsWhere<DiscountEntity> = {},
  ): FindOptionsWhere<DiscountEntity> {
    const tenantId = this.request['tenantId'];

    if (tenantId) {
      return {
        ...where,
        tenant: { id: tenantId },
      };
    }

    return where;
  }

  async create(data: Discount): Promise<Discount> {
    const persistenceModel = DiscountMapper.toPersistence(data);
    const newEntity = await this.discountRepository.save(
      this.discountRepository.create(persistenceModel),
    );
    return DiscountMapper.toDomain(newEntity);
  }

  async findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<Discount[]> {
    const entities = await this.discountRepository.find({
      skip: (paginationOptions.page - 1) * paginationOptions.limit,
      take: paginationOptions.limit,
      where: this.applyTenantFilter(),
    });

    return entities.map((entity) => DiscountMapper.toDomain(entity));
  }

  async findById(id: Discount['id']): Promise<NullableType<Discount>> {
    const entity = await this.discountRepository.findOne({
      where: this.applyTenantFilter({ id }),
    });

    return entity ? DiscountMapper.toDomain(entity) : null;
  }

  async findByIds(ids: Discount['id'][]): Promise<Discount[]> {
    const entities = await this.discountRepository.find({
      where: this.applyTenantFilter({ id: In(ids) }),
    });

    return entities.map((entity) => DiscountMapper.toDomain(entity));
  }

  async update(
    id: Discount['id'],
    payload: Partial<Discount>,
  ): Promise<Discount> {
    const entity = await this.discountRepository.findOne({
      where: this.applyTenantFilter({ id }),
    });

    if (!entity) {
      throw new Error('Record not found');
    }

    const updatedEntity = await this.discountRepository.save(
      this.discountRepository.create(
        DiscountMapper.toPersistence({
          ...DiscountMapper.toDomain(entity),
          ...payload,
        }),
      ),
    );

    return DiscountMapper.toDomain(updatedEntity);
  }

  async remove(id: Discount['id']): Promise<void> {
    const entity = await this.discountRepository.findOne({
      where: this.applyTenantFilter({ id }),
    });

    if (!entity) {
      throw new Error('Record not found or access denied');
    }

    await this.discountRepository.softDelete(entity.id);
  }
}
