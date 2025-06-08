import { DeepPartial } from '../../../utils/types/deep-partial.type';
import { NullableType } from '../../../utils/types/nullable.type';
import { IPaginationOptions } from '../../../utils/types/pagination-options';
import { AddressBook } from '../../domain/address-book';

export abstract class AddressBookRepository {
  abstract create(
    data: Omit<AddressBook, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<AddressBook>;

  abstract findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<AddressBook[]>;

  abstract findById(id: AddressBook['id']): Promise<NullableType<AddressBook>>;

  abstract findByIds(ids: AddressBook['id'][]): Promise<AddressBook[]>;

  abstract update(
    id: AddressBook['id'],
    payload: DeepPartial<AddressBook>,
  ): Promise<AddressBook | null>;

  abstract remove(id: AddressBook['id']): Promise<void>;
}
