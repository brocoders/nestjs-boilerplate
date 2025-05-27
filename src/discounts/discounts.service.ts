import {
  // common
  Injectable,
} from '@nestjs/common';
import { CreateDiscountDto } from './dto/create-discount.dto';
import { UpdateDiscountDto } from './dto/update-discount.dto';
import { DiscountRepository } from './infrastructure/persistence/discount.repository';
import { IPaginationOptions } from '../utils/types/pagination-options';
import { Discount } from './domain/discount';

@Injectable()
export class DiscountsService {
  constructor(
    // Dependencies here
    private readonly discountRepository: DiscountRepository,
  ) {}

  async create(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    createDiscountDto: CreateDiscountDto,
  ) {
    // Do not remove comment below.
    // <creating-property />

    return this.discountRepository.create({
      // Do not remove comment below.
      // <creating-property-payload />
    });
  }

  findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }) {
    return this.discountRepository.findAllWithPagination({
      paginationOptions: {
        page: paginationOptions.page,
        limit: paginationOptions.limit,
      },
    });
  }

  findById(id: Discount['id']) {
    return this.discountRepository.findById(id);
  }

  findByIds(ids: Discount['id'][]) {
    return this.discountRepository.findByIds(ids);
  }

  async update(
    id: Discount['id'],
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    updateDiscountDto: UpdateDiscountDto,
  ) {
    // Do not remove comment below.
    // <updating-property />

    return this.discountRepository.update(id, {
      // Do not remove comment below.
      // <updating-property-payload />
    });
  }

  remove(id: Discount['id']) {
    return this.discountRepository.remove(id);
  }
}
