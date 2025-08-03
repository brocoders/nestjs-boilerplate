import { DeepPartial } from '../../../utils/types/deep-partial.type';
import { NullableType } from '../../../utils/types/nullable.type';
import { IPaginationOptions } from '../../../utils/types/pagination-options';
import { Wallet } from '../../domain/wallet';

export abstract class WalletRepository {
  abstract create(
    data: Omit<Wallet, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<Wallet>;

  abstract findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<Wallet[]>;

  abstract findById(id: Wallet['id']): Promise<NullableType<Wallet>>;

  abstract findByIds(ids: Wallet['id'][]): Promise<Wallet[]>;

  abstract update(
    id: Wallet['id'],
    payload: DeepPartial<Wallet>,
  ): Promise<Wallet | null>;

  abstract remove(id: Wallet['id']): Promise<void>;
}
