import { DeepPartial } from '../../../utils/types/deep-partial.type';
import { NullableType } from '../../../utils/types/nullable.type';
import { IPaginationOptions } from '../../../utils/types/pagination-options';
import { AccountsPayable } from '../../domain/accounts-payable';

export abstract class AccountsPayableRepository {
  abstract create(
    data: Omit<AccountsPayable, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<AccountsPayable>;

  abstract findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<AccountsPayable[]>;

  abstract findById(
    id: AccountsPayable['id'],
  ): Promise<NullableType<AccountsPayable>>;

  abstract findByIds(ids: AccountsPayable['id'][]): Promise<AccountsPayable[]>;

  abstract update(
    id: AccountsPayable['id'],
    payload: DeepPartial<AccountsPayable>,
  ): Promise<AccountsPayable | null>;

  abstract remove(id: AccountsPayable['id']): Promise<void>;
}
