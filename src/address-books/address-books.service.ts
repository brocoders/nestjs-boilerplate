import { UsersService } from '../users/users.service';
import { User } from '../users/domain/user';

import {
  // common
  Injectable,
  HttpStatus,
  UnprocessableEntityException,
} from '@nestjs/common';
import { CreateAddressBookDto } from './dto/create-address-book.dto';
import { UpdateAddressBookDto } from './dto/update-address-book.dto';
import { AddressBookRepository } from './infrastructure/persistence/address-book.repository';
import { IPaginationOptions } from '../utils/types/pagination-options';
import { AddressBook } from './domain/address-book';

@Injectable()
export class AddressBooksService {
  constructor(
    private readonly userService: UsersService,

    // Dependencies here
    private readonly addressBookRepository: AddressBookRepository,
  ) {}

  async create(createAddressBookDto: CreateAddressBookDto) {
    // Do not remove comment below.
    // <creating-property />
    const userObject = await this.userService.findById(
      createAddressBookDto.user.id,
    );
    if (!userObject) {
      throw new UnprocessableEntityException({
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        errors: {
          user: 'notExists',
        },
      });
    }
    const user = userObject;

    return this.addressBookRepository.create({
      // Do not remove comment below.
      // <creating-property-payload />
      user,

      isFavorite: createAddressBookDto.isFavorite,

      notes: createAddressBookDto.notes,

      memo: createAddressBookDto.memo,

      tag: createAddressBookDto.tag,

      assetType: createAddressBookDto.assetType,

      blockchain: createAddressBookDto.blockchain,

      address: createAddressBookDto.address,

      label: createAddressBookDto.label,
    });
  }

  findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }) {
    return this.addressBookRepository.findAllWithPagination({
      paginationOptions: {
        page: paginationOptions.page,
        limit: paginationOptions.limit,
      },
    });
  }

  findById(id: AddressBook['id']) {
    return this.addressBookRepository.findById(id);
  }

  findByIds(ids: AddressBook['id'][]) {
    return this.addressBookRepository.findByIds(ids);
  }

  async update(
    id: AddressBook['id'],

    updateAddressBookDto: UpdateAddressBookDto,
  ) {
    // Do not remove comment below.
    // <updating-property />
    let user: User | undefined = undefined;

    if (updateAddressBookDto.user) {
      const userObject = await this.userService.findById(
        updateAddressBookDto.user.id,
      );
      if (!userObject) {
        throw new UnprocessableEntityException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            user: 'notExists',
          },
        });
      }
      user = userObject;
    }

    return this.addressBookRepository.update(id, {
      // Do not remove comment below.
      // <updating-property-payload />
      user,

      isFavorite: updateAddressBookDto.isFavorite,

      notes: updateAddressBookDto.notes,

      memo: updateAddressBookDto.memo,

      tag: updateAddressBookDto.tag,

      assetType: updateAddressBookDto.assetType,

      blockchain: updateAddressBookDto.blockchain,

      address: updateAddressBookDto.address,

      label: updateAddressBookDto.label,
    });
  }

  remove(id: AddressBook['id']) {
    return this.addressBookRepository.remove(id);
  }
}
