import { DeepPartial } from '../../../utils/types/deep-partial.type';
import { NullableType } from '../../../utils/types/nullable.type';
import { IPaginationOptions } from '../../../utils/types/pagination-options';
import { Tenant } from '../../domain/tenant';

export abstract class TenantRepository {
  abstract create(
    data: Omit<Tenant, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<Tenant>;

  abstract findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<Tenant[]>;

  abstract findById(id: Tenant['id']): Promise<NullableType<Tenant>>;

  abstract findByIds(ids: Tenant['id'][]): Promise<Tenant[]>;

  abstract update(
    id: Tenant['id'],
    payload: DeepPartial<Tenant>,
  ): Promise<Tenant | null>;

  abstract remove(id: Tenant['id']): Promise<void>;
}
