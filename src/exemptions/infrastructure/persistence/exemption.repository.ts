import { DeepPartial } from '../../../utils/types/deep-partial.type';
import { NullableType } from '../../../utils/types/nullable.type';
import { IPaginationOptions } from '../../../utils/types/pagination-options';
import { Exemption } from '../../domain/exemption';

export abstract class ExemptionRepository {
  abstract create(
    data: Omit<Exemption, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<Exemption>;

  abstract findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<Exemption[]>;

  abstract findById(id: Exemption['id']): Promise<NullableType<Exemption>>;

  abstract findByIds(ids: Exemption['id'][]): Promise<Exemption[]>;

  abstract update(
    id: Exemption['id'],
    payload: DeepPartial<Exemption>,
  ): Promise<Exemption | null>;

  abstract remove(id: Exemption['id']): Promise<void>;
}
