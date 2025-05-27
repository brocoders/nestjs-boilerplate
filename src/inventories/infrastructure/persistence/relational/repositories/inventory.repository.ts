import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { InventoryEntity } from '../entities/inventory.entity';
import { NullableType } from '../../../../../utils/types/nullable.type';
import { Inventory } from '../../../../domain/inventory';
import { InventoryRepository } from '../../inventory.repository';
import { InventoryMapper } from '../mappers/inventory.mapper';
import { IPaginationOptions } from '../../../../../utils/types/pagination-options';

@Injectable()
export class InventoryRelationalRepository implements InventoryRepository {
  constructor(
    @InjectRepository(InventoryEntity)
    private readonly inventoryRepository: Repository<InventoryEntity>,
  ) {}

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
    });

    return entities.map((entity) => InventoryMapper.toDomain(entity));
  }

  async findById(id: Inventory['id']): Promise<NullableType<Inventory>> {
    const entity = await this.inventoryRepository.findOne({
      where: { id },
    });

    return entity ? InventoryMapper.toDomain(entity) : null;
  }

  async findByIds(ids: Inventory['id'][]): Promise<Inventory[]> {
    const entities = await this.inventoryRepository.find({
      where: { id: In(ids) },
    });

    return entities.map((entity) => InventoryMapper.toDomain(entity));
  }

  async update(
    id: Inventory['id'],
    payload: Partial<Inventory>,
  ): Promise<Inventory> {
    const entity = await this.inventoryRepository.findOne({
      where: { id },
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
    await this.inventoryRepository.delete(id);
  }
}
