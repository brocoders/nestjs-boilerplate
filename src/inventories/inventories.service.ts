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

  async create(createInventoryDto: CreateInventoryDto) {
    // Do not remove comment below.
    // <creating-property />

    return this.inventoryRepository.create({
      // Do not remove comment below.
      // <creating-property-payload />
      unitOfMeasure: createInventoryDto.unitOfMeasure,

      materialType: createInventoryDto.materialType,

      accountType: createInventoryDto.accountType,

      salePrice: createInventoryDto.salePrice,

      purchasePrice: createInventoryDto.purchasePrice,

      quantity: createInventoryDto.quantity,

      itemDescription: createInventoryDto.itemDescription,

      itemName: createInventoryDto.itemName,
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

    updateInventoryDto: UpdateInventoryDto,
  ) {
    // Do not remove comment below.
    // <updating-property />

    return this.inventoryRepository.update(id, {
      // Do not remove comment below.
      // <updating-property-payload />
      unitOfMeasure: updateInventoryDto.unitOfMeasure,

      materialType: updateInventoryDto.materialType,

      accountType: updateInventoryDto.accountType,

      salePrice: updateInventoryDto.salePrice,

      purchasePrice: updateInventoryDto.purchasePrice,

      quantity: updateInventoryDto.quantity,

      itemDescription: updateInventoryDto.itemDescription,

      itemName: updateInventoryDto.itemName,
    });
  }

  remove(id: Inventory['id']) {
    return this.inventoryRepository.remove(id);
  }
}
