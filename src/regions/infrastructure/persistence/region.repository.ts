import { DeepPartial } from '../../../utils/types/deep-partial.type';
import { NullableType } from '../../../utils/types/nullable.type';
import { IPaginationOptions } from '../../../utils/types/pagination-options';
import { Region } from '../../domain/region';

export abstract class RegionRepository {
  abstract create(
    data: Omit<Region, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<Region>;

  abstract findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<Region[]>;

  abstract findById(id: Region['id']): Promise<NullableType<Region>>;

  abstract findByIds(ids: Region['id'][]): Promise<Region[]>;

  abstract update(
    id: Region['id'],
    payload: DeepPartial<Region>,
  ): Promise<Region | null>;

  abstract remove(id: Region['id']): Promise<void>;
}
