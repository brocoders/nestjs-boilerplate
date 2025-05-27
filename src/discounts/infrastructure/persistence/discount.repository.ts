import { DeepPartial } from '../../../utils/types/deep-partial.type';
import { NullableType } from '../../../utils/types/nullable.type';
import { IPaginationOptions } from '../../../utils/types/pagination-options';
import { Discount } from '../../domain/discount';

export abstract class DiscountRepository {
  abstract create(
    data: Omit<Discount, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<Discount>;

  abstract findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<Discount[]>;

  abstract findById(id: Discount['id']): Promise<NullableType<Discount>>;

  abstract findByIds(ids: Discount['id'][]): Promise<Discount[]>;

  abstract update(
    id: Discount['id'],
    payload: DeepPartial<Discount>,
  ): Promise<Discount | null>;

  abstract remove(id: Discount['id']): Promise<void>;
}
