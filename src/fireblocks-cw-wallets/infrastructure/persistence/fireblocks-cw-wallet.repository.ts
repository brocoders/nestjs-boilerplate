import { DeepPartial } from '../../../utils/types/deep-partial.type';
import { NullableType } from '../../../utils/types/nullable.type';
import { IPaginationOptions } from '../../../utils/types/pagination-options';
import { FireblocksCwWallet } from '../../domain/fireblocks-cw-wallet';

export abstract class FireblocksCwWalletRepository {
  abstract create(
    data: Omit<FireblocksCwWallet, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<FireblocksCwWallet>;

  abstract findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<FireblocksCwWallet[]>;

  abstract findById(
    id: FireblocksCwWallet['id'],
  ): Promise<NullableType<FireblocksCwWallet>>;

  abstract findByIds(
    ids: FireblocksCwWallet['id'][],
  ): Promise<FireblocksCwWallet[]>;

  abstract update(
    id: FireblocksCwWallet['id'],
    payload: DeepPartial<FireblocksCwWallet>,
  ): Promise<FireblocksCwWallet | null>;

  abstract remove(id: FireblocksCwWallet['id']): Promise<void>;
}
