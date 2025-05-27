import { DeepPartial } from '../../../utils/types/deep-partial.type';
import { NullableType } from '../../../utils/types/nullable.type';
import { IPaginationOptions } from '../../../utils/types/pagination-options';
import { Vendor } from '../../domain/vendor';

export abstract class VendorRepository {
  abstract create(
    data: Omit<Vendor, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<Vendor>;

  abstract findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<Vendor[]>;

  abstract findById(id: Vendor['id']): Promise<NullableType<Vendor>>;

  abstract findByIds(ids: Vendor['id'][]): Promise<Vendor[]>;

  abstract update(
    id: Vendor['id'],
    payload: DeepPartial<Vendor>,
  ): Promise<Vendor | null>;

  abstract remove(id: Vendor['id']): Promise<void>;
}
