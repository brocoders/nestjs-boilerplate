import { DeepPartial } from '../../../utils/types/deep-partial.type';
import { NullableType } from '../../../utils/types/nullable.type';
import { IPaginationOptions } from '../../../utils/types/pagination-options';
import { SystemModule } from '../../domain/system-module';

export abstract class SystemModuleRepository {
  abstract create(
    data: Omit<SystemModule, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<SystemModule>;

  abstract findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<SystemModule[]>;

  abstract findById(
    id: SystemModule['id'],
  ): Promise<NullableType<SystemModule>>;

  abstract findByIds(ids: SystemModule['id'][]): Promise<SystemModule[]>;

  abstract update(
    id: SystemModule['id'],
    payload: DeepPartial<SystemModule>,
  ): Promise<SystemModule | null>;

  abstract remove(id: SystemModule['id']): Promise<void>;
}
