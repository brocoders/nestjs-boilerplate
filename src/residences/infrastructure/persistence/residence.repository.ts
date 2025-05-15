import { DeepPartial } from '../../../utils/types/deep-partial.type';
import { NullableType } from '../../../utils/types/nullable.type';
import { IPaginationOptions } from '../../../utils/types/pagination-options';
import { Residence } from '../../domain/residence';

export abstract class ResidenceRepository {
  abstract create(
    data: Omit<Residence, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<Residence>;

  abstract findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<Residence[]>;

  abstract findById(id: Residence['id']): Promise<NullableType<Residence>>;

  abstract findByIds(ids: Residence['id'][]): Promise<Residence[]>;

  abstract update(
    id: Residence['id'],
    payload: DeepPartial<Residence>,
  ): Promise<Residence | null>;

  abstract remove(id: Residence['id']): Promise<void>;
}
