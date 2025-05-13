import { DeepPartial } from '../../../utils/types/deep-partial.type';
import { NullableType } from '../../../utils/types/nullable.type';
import { IPaginationOptions } from '../../../utils/types/pagination-options';
import { Settings } from '../../domain/settings';

export abstract class SettingsRepository {
  abstract create(
    data: Omit<Settings, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<Settings>;

  abstract findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<Settings[]>;

  abstract findById(id: Settings['id']): Promise<NullableType<Settings>>;

  abstract findByIds(ids: Settings['id'][]): Promise<Settings[]>;

  abstract update(
    id: Settings['id'],
    payload: DeepPartial<Settings>,
  ): Promise<Settings | null>;

  abstract remove(id: Settings['id']): Promise<void>;
}
