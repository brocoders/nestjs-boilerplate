import { DeepPartial } from '../../../utils/types/deep-partial.type';
import { NullableType } from '../../../utils/types/nullable.type';
import { IPaginationOptions } from '../../../utils/types/pagination-options';
import { TenantConfig } from '../../domain/tenant-config';

export abstract class TenantConfigRepository {
  abstract create(
    data: Omit<TenantConfig, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<TenantConfig>;

  abstract findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<TenantConfig[]>;

  abstract findById(
    id: TenantConfig['id'],
  ): Promise<NullableType<TenantConfig>>;

  abstract findByIds(ids: TenantConfig['id'][]): Promise<TenantConfig[]>;

  abstract update(
    id: TenantConfig['id'],
    payload: DeepPartial<TenantConfig>,
  ): Promise<TenantConfig | null>;

  abstract remove(id: TenantConfig['id']): Promise<void>;
}
