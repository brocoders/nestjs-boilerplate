import { DeepPartial } from '../../../utils/types/deep-partial.type';
import { NullableType } from '../../../utils/types/nullable.type';
import { IPaginationOptions } from '../../../utils/types/pagination-options';
import { AccountsReceivable } from '../../domain/accounts-receivable';

export abstract class AccountsReceivableRepository {
  abstract create(
    data: Omit<AccountsReceivable, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<AccountsReceivable>;

  abstract findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<AccountsReceivable[]>;

  abstract findById(
    id: AccountsReceivable['id'],
  ): Promise<NullableType<AccountsReceivable>>;

  abstract findByIds(
    ids: AccountsReceivable['id'][],
  ): Promise<AccountsReceivable[]>;

  abstract update(
    id: AccountsReceivable['id'],
    payload: DeepPartial<AccountsReceivable>,
  ): Promise<AccountsReceivable | null>;

  abstract remove(id: AccountsReceivable['id']): Promise<void>;
}
