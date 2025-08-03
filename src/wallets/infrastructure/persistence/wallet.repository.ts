import { DeepPartial } from '../../../utils/types/deep-partial.type';
import { NullableType } from '../../../utils/types/nullable.type';
import { IPaginationOptions } from '../../../utils/types/pagination-options';
import { Wallet } from '../../domain/wallet';
import { User } from '../../../users/domain/user';

export abstract class WalletRepository {
  /**
   * Create a new wallet record
   */
  abstract create(
    data: Omit<Wallet, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<Wallet>;

  /**
   * Find paginated wallets
   */
  abstract findAllWithPagination(params: {
    paginationOptions: IPaginationOptions;
  }): Promise<Wallet[]>;

  /**
   * Find by ID (optionally scoped to user)
   */
  abstract findById(
    id: Wallet['id'],
    userId?: User['id'],
  ): Promise<NullableType<Wallet>>;

  /**
   * Find many wallets by IDs
   */
  abstract findByIds(ids: Wallet['id'][]): Promise<Wallet[]>;

  /**
   * Update a wallet record
   */
  abstract update(
    id: Wallet['id'],
    payload: DeepPartial<Wallet>,
  ): Promise<NullableType<Wallet>>;

  /**
   * Delete by ID
   */
  abstract remove(id: Wallet['id'], userId?: User['id']): Promise<void>;

  /**
   * Find all wallets of a user
   */
  abstract findAllByUserId(userId: User['id']): Promise<Wallet[]>;

  /**
   * Filter wallets by provider, lockupId, label, or active status
   */
  abstract filter(
    userId?: User['id'],
    provider?: Wallet['provider'],
    lockupId?: Wallet['lockupId'],
    label?: Wallet['label'],
    active?: Wallet['active'],
  ): Promise<Wallet[]>;

  /**
   * Find all active wallets, optionally scoped by user
   */
  abstract findActives(userId?: User['id']): Promise<Wallet[]>;

  abstract countAll(userId?: User['id']): Promise<number>;

  abstract countActives(userId?: User['id']): Promise<number>;
  /**
   * Find wallet by lockupId
   */
  abstract findByLockupId(
    lockupId: Wallet['lockupId'],
  ): Promise<NullableType<Wallet>>;
}
