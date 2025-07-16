import { DeepPartial } from '../../../utils/types/deep-partial.type';
import { NullableType } from '../../../utils/types/nullable.type';
import { IPaginationOptions } from '../../../utils/types/pagination-options';
import { AddressBook } from '../../domain/address-book';
import { User } from '../../../users/domain/user';

export abstract class AddressBookRepository {
  /**
   * Create a new address book record
   */
  abstract create(
    data: Omit<AddressBook, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<AddressBook>;

  /**
   * Find paginated address books
   */
  abstract findAllWithPagination(params: {
    paginationOptions: IPaginationOptions;
  }): Promise<AddressBook[]>;

  /**
   * Find by ID (by any role)
   */
  abstract findById(
    id: AddressBook['id'],
    userId?: User['id'],
  ): Promise<NullableType<AddressBook>>;

  /**
   * Find many address books by IDs
   */
  abstract findByIds(ids: AddressBook['id'][]): Promise<AddressBook[]>;

  /**
   * Update an address book record
   */
  abstract update(
    id: AddressBook['id'],
    payload: DeepPartial<AddressBook>,
  ): Promise<NullableType<AddressBook>>;

  /**
   * Delete by ID
   */
  abstract remove(id: AddressBook['id'], userId?: User['id']): Promise<void>;
  /**
   * Find all by user ID
   */
  abstract findAllByUserId(userId: User['id']): Promise<AddressBook[]>;

  /**
   * Find all favorites, scoped to user if userId is provided
   */
  abstract findFavorites(userId?: User['id']): Promise<AddressBook[]>;

  /**
   * Apply filters for blockchain, asset type, isFavorite, optionally scoped by user
   */
  abstract filter(
    userId?: User['id'],
    blockchain?: AddressBook['blockchain'],
    assetType?: AddressBook['assetType'],
    isFavorite?: AddressBook['isFavorite'],
    label?: AddressBook['label'],
  ): Promise<AddressBook[]>;
}
