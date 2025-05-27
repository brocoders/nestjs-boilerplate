import { DeepPartial } from '../../../utils/types/deep-partial.type';
import { NullableType } from '../../../utils/types/nullable.type';
import { IPaginationOptions } from '../../../utils/types/pagination-options';
import { Transaction } from '../../domain/transaction';

export abstract class TransactionRepository {
  abstract create(
    data: Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<Transaction>;

  abstract findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<Transaction[]>;

  abstract findById(id: Transaction['id']): Promise<NullableType<Transaction>>;

  abstract findByIds(ids: Transaction['id'][]): Promise<Transaction[]>;

  abstract update(
    id: Transaction['id'],
    payload: DeepPartial<Transaction>,
  ): Promise<Transaction | null>;

  abstract remove(id: Transaction['id']): Promise<void>;
}
