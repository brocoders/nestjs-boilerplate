import { DeepPartial } from '../../../utils/types/deep-partial.type';
import { NullableType } from '../../../utils/types/nullable.type';
import { IPaginationOptions } from '../../../utils/types/pagination-options';
import { Account } from '../../domain/account';

export abstract class AccountRepository {
  abstract create(
    data: Omit<Account, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<Account>;

  abstract findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<Account[]>;

  abstract findById(id: Account['id']): Promise<NullableType<Account>>;

  abstract findByIds(ids: Account['id'][]): Promise<Account[]>;

  abstract update(
    id: Account['id'],
    payload: DeepPartial<Account>,
  ): Promise<Account | null>;

  abstract remove(id: Account['id']): Promise<void>;
}
