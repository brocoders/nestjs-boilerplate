import { DeepPartial } from '../../../utils/types/deep-partial.type';
import { NullableType } from '../../../utils/types/nullable.type';
import { IPaginationOptions } from '../../../utils/types/pagination-options';
import { CreditBalance } from '../../domain/credit-balance';

export abstract class CreditBalanceRepository {
  abstract create(
    data: Omit<CreditBalance, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<CreditBalance>;

  abstract findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<CreditBalance[]>;

  abstract findById(
    id: CreditBalance['id'],
  ): Promise<NullableType<CreditBalance>>;

  abstract findByIds(ids: CreditBalance['id'][]): Promise<CreditBalance[]>;

  abstract update(
    id: CreditBalance['id'],
    payload: DeepPartial<CreditBalance>,
  ): Promise<CreditBalance | null>;

  abstract remove(id: CreditBalance['id']): Promise<void>;
}
