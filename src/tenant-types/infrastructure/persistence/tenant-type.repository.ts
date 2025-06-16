import { FindOptionsWhere } from 'typeorm';
import { DeepPartial } from '../../../utils/types/deep-partial.type';
import { NullableType } from '../../../utils/types/nullable.type';
import { IPaginationOptions } from '../../../utils/types/pagination-options';
import { TenantType } from '../../domain/tenant-type';

export abstract class TenantTypeRepository {
  abstract create(
    data: Omit<TenantType, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<TenantType>;
  abstract find({
    where,
    order,
  }: {
    where?: FindOptionsWhere<TenantType>;
    order?: { [key in keyof TenantType]?: 'ASC' | 'DESC' };
  }): Promise<TenantType[]>;
  abstract findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<TenantType[]>;

  abstract findById(id: TenantType['id']): Promise<NullableType<TenantType>>;

  abstract findByIds(ids: TenantType['id'][]): Promise<TenantType[]>;

  abstract update(
    id: TenantType['id'],
    payload: DeepPartial<TenantType>,
  ): Promise<TenantType | null>;

  abstract remove(id: TenantType['id']): Promise<void>;
}
