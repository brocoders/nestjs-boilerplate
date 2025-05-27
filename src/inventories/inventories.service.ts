import {
  // common
  Injectable,
} from '@nestjs/common';
import { CreateInventoryDto } from './dto/create-inventory.dto';
import { UpdateInventoryDto } from './dto/update-inventory.dto';
import { InventoryRepository } from './infrastructure/persistence/inventory.repository';
import { IPaginationOptions } from '../utils/types/pagination-options';
import { Inventory } from './domain/inventory';

@Injectable()
export class InventoriesService {
  constructor(
    // Dependencies here
    private readonly inventoryRepository: InventoryRepository,
  ) {}

  async create(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    createInventoryDto: CreateInventoryDto,
  ) {
    // Do not remove comment below.
    // <creating-property />

    return this.inventoryRepository.create({
      // Do not remove comment below.
      // <creating-property-payload />
    });
  }

  findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }) {
    return this.inventoryRepository.findAllWithPagination({
      paginationOptions: {
        page: paginationOptions.page,
        limit: paginationOptions.limit,
      },
    });
  }

  findById(id: Inventory['id']) {
    return this.inventoryRepository.findById(id);
  }

  findByIds(ids: Inventory['id'][]) {
    return this.inventoryRepository.findByIds(ids);
  }

  async update(
    id: Inventory['id'],
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    updateInventoryDto: UpdateInventoryDto,
  ) {
    // Do not remove comment below.
    // <updating-property />

    return this.inventoryRepository.update(id, {
      // Do not remove comment below.
      // <updating-property-payload />
    });
  }

  remove(id: Inventory['id']) {
    return this.inventoryRepository.remove(id);
  }
}
