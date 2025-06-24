import { Inject, Injectable } from '@nestjs/common';
import { Repository, In, DataSource, FindOptionsWhere } from 'typeorm';
import { InventoryEntity } from '../entities/inventory.entity';
import { NullableType } from '../../../../../utils/types/nullable.type';
import { Inventory } from '../../../../domain/inventory';
import { InventoryRepository } from '../../inventory.repository';
import { InventoryMapper } from '../mappers/inventory.mapper';
import { IPaginationOptions } from '../../../../../utils/types/pagination-options';
import { REQUEST } from '@nestjs/core';
import { TenantDataSource } from '../../../../../database/tenant-data-source';

@Injectable()
export class InventoryRelationalRepository implements InventoryRepository {
  private inventoryRepository: Repository<InventoryEntity>;

  constructor(@Inject(REQUEST) private request: Request) {
    const dataSource: DataSource =
      this.request['tenantDataSource'] || TenantDataSource.getCoreDataSource();
    this.inventoryRepository = dataSource.getRepository(InventoryEntity);
  }

  private applyTenantFilter(
    where: FindOptionsWhere<InventoryEntity> = {},
  ): FindOptionsWhere<InventoryEntity> {
    const tenantId = this.request['tenantId'];

    if (tenantId) {
      return {
        ...where,
        tenant: { id: tenantId },
      };
    }

    return where;
  }

  async create(data: Inventory): Promise<Inventory> {
    const persistenceModel = InventoryMapper.toPersistence(data);
    const newEntity = await this.inventoryRepository.save(
      this.inventoryRepository.create(persistenceModel),
    );
    return InventoryMapper.toDomain(newEntity);
  }

  async findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<Inventory[]> {
    const entities = await this.inventoryRepository.find({
      skip: (paginationOptions.page - 1) * paginationOptions.limit,
      take: paginationOptions.limit,
      where: this.applyTenantFilter(),
    });

    return entities.map((entity) => InventoryMapper.toDomain(entity));
  }

  async findById(id: Inventory['id']): Promise<NullableType<Inventory>> {
    const entity = await this.inventoryRepository.findOne({
      where: this.applyTenantFilter({ id }),
    });

    return entity ? InventoryMapper.toDomain(entity) : null;
  }

  async findByIds(ids: Inventory['id'][]): Promise<Inventory[]> {
    const entities = await this.inventoryRepository.find({
      where: this.applyTenantFilter({ id: In(ids) }),
    });

    return entities.map((entity) => InventoryMapper.toDomain(entity));
  }

  async update(
    id: Inventory['id'],
    payload: Partial<Inventory>,
  ): Promise<Inventory> {
    const entity = await this.inventoryRepository.findOne({
      where: this.applyTenantFilter({ id }),
    });

    if (!entity) {
      throw new Error('Record not found');
    }

    const updatedEntity = await this.inventoryRepository.save(
      this.inventoryRepository.create(
        InventoryMapper.toPersistence({
          ...InventoryMapper.toDomain(entity),
          ...payload,
        }),
      ),
    );

    return InventoryMapper.toDomain(updatedEntity);
  }

  async remove(id: Inventory['id']): Promise<void> {
    const entity = await this.inventoryRepository.findOne({
      where: this.applyTenantFilter({ id }),
    });

    if (!entity) {
      throw new Error('Record not found or access denied');
    }

    await this.inventoryRepository.softDelete(entity.id);
  }
}
