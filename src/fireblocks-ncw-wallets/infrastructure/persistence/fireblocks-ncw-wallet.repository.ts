import { DeepPartial } from '../../../utils/types/deep-partial.type';
import { NullableType } from '../../../utils/types/nullable.type';
import { IPaginationOptions } from '../../../utils/types/pagination-options';
import { FireblocksNcwWallet } from '../../domain/fireblocks-ncw-wallet';

export abstract class FireblocksNcwWalletRepository {
  abstract create(
    data: Omit<FireblocksNcwWallet, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<FireblocksNcwWallet>;

  abstract findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<FireblocksNcwWallet[]>;

  abstract findById(
    id: FireblocksNcwWallet['id'],
  ): Promise<NullableType<FireblocksNcwWallet>>;

  abstract findByIds(
    ids: FireblocksNcwWallet['id'][],
  ): Promise<FireblocksNcwWallet[]>;

  abstract update(
    id: FireblocksNcwWallet['id'],
    payload: DeepPartial<FireblocksNcwWallet>,
  ): Promise<FireblocksNcwWallet | null>;

  abstract remove(id: FireblocksNcwWallet['id']): Promise<void>;
}
