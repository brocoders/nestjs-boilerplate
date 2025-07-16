import {
  HttpStatus,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { User } from '../users/domain/user';
import { AddressBookRepository } from './infrastructure/persistence/address-book.repository';
import {
  CreateAddressBookDto,
  CreateAddressBookUserDto,
} from './dto/create-address-book.dto';
import { UpdateAddressBookDto } from './dto/update-address-book.dto';
import { IPaginationOptions } from '../utils/types/pagination-options';
import { AddressBook } from './domain/address-book';
import { TypeMessage } from '../utils/types/message.type';
import { NullableType } from '../utils/types/nullable.type';
import { AddressBookDto } from './dto/address-book.dto';
import { RoleEnum } from '../roles/roles.enum';
import {
  GroupPlainToInstance,
  GroupPlainToInstances,
} from '../utils/transformers/class.transformer';

@Injectable()
export class AddressBooksService {
  constructor(
    private readonly userService: UsersService,
    private readonly addressBookRepository: AddressBookRepository,
  ) {}

  async create(
    createAddressBookDto: CreateAddressBookDto,
  ): Promise<AddressBookDto> {
    const user = await this.userService.findById(createAddressBookDto.user.id);
    if (!user) {
      throw new UnprocessableEntityException({
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        message: TypeMessage.getMessageByStatus(
          HttpStatus.UNPROCESSABLE_ENTITY,
        ),
        errors: { user: 'UserNotExist' },
      });
    }

    const addressBook = await this.addressBookRepository.create({
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

    return GroupPlainToInstance(AddressBookDto, addressBook, [RoleEnum.admin]);
  }

  async findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<AddressBookDto[]> {
    const result = await this.addressBookRepository.findAllWithPagination({
      paginationOptions: {
        page: paginationOptions.page,
        limit: paginationOptions.limit,
      },
    });
    return GroupPlainToInstances(AddressBookDto, result, [RoleEnum.admin]);
  }

  async findById(id: AddressBook['id']): Promise<NullableType<AddressBookDto>> {
    const addressBook = await this.addressBookRepository.findById(id);
    return addressBook
      ? GroupPlainToInstance(AddressBookDto, addressBook, [RoleEnum.admin])
      : null;
  }

  async findByIds(ids: AddressBook['id'][]): Promise<AddressBookDto[]> {
    const result = await this.addressBookRepository.findByIds(ids);
    return GroupPlainToInstances(AddressBookDto, result, [RoleEnum.admin]);
  }

  async update(
    id: AddressBook['id'],
    updateAddressBookDto: UpdateAddressBookDto,
  ): Promise<NullableType<AddressBookDto>> {
    let user: User | undefined = undefined;
    if (updateAddressBookDto.user) {
      const userObject = await this.userService.findById(
        updateAddressBookDto.user.id,
      );
      if (!userObject) {
        throw new UnprocessableEntityException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          message: TypeMessage.getMessageByStatus(
            HttpStatus.UNPROCESSABLE_ENTITY,
          ),
          errors: { user: 'UserNotExist' },
        });
      }
      user = userObject;
    }

    const updated = await this.addressBookRepository.update(id, {
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

    return updated
      ? GroupPlainToInstance(AddressBookDto, updated, [RoleEnum.admin])
      : null;
  }

  async remove(id: AddressBook['id'], userId?: User['id']): Promise<void> {
    await this.addressBookRepository.remove(id, userId);
  }

  async findFavorites(userId: User['id']): Promise<AddressBookDto[]> {
    const result = await this.addressBookRepository.findFavorites(userId);
    return GroupPlainToInstances(AddressBookDto, result, [RoleEnum.user]);
  }

  async filter(
    userId: User['id'],
    blockchain?: AddressBook['blockchain'],
    assetType?: AddressBook['assetType'],
    isFavorite?: AddressBook['isFavorite'],
  ): Promise<AddressBookDto[]> {
    const result = await this.addressBookRepository.filter(
      userId,
      blockchain,
      assetType,
      isFavorite,
    );
    return GroupPlainToInstances(AddressBookDto, result, [RoleEnum.user]);
  }

  async createByMe(
    createAddressBookUserDto: CreateAddressBookUserDto,
    userId: User['id'],
  ): Promise<AddressBookDto> {
    const user = await this.userService.findById(userId);
    if (!user) {
      throw new UnprocessableEntityException({
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        message: TypeMessage.getMessageByStatus(
          HttpStatus.UNPROCESSABLE_ENTITY,
        ),
        errors: { user: 'UserNotExist' },
      });
    }

    const created = await this.addressBookRepository.create({
      user,
      isFavorite: createAddressBookUserDto.isFavorite,
      notes: createAddressBookUserDto.notes,
      memo: createAddressBookUserDto.memo,
      tag: createAddressBookUserDto.tag,
      assetType: createAddressBookUserDto.assetType,
      blockchain: createAddressBookUserDto.blockchain,
      address: createAddressBookUserDto.address,
      label: createAddressBookUserDto.label,
    });

    return GroupPlainToInstance(AddressBookDto, created, [RoleEnum.user]);
  }

  async findAllByUserId(userId: User['id']): Promise<AddressBookDto[]> {
    const result = await this.addressBookRepository.findAllByUserId(userId);
    return GroupPlainToInstances(AddressBookDto, result, [RoleEnum.user]);
  }

  async findFavoritesByMe(userId: User['id']): Promise<AddressBookDto[]> {
    const result = await this.addressBookRepository.findFavorites(userId);
    return GroupPlainToInstances(AddressBookDto, result, [RoleEnum.user]);
  }

  async filterByMe(
    userId: User['id'],
    blockchain?: AddressBook['blockchain'],
    assetType?: AddressBook['assetType'],
    isFavorite?: AddressBook['isFavorite'],
  ): Promise<AddressBookDto[]> {
    const result = await this.addressBookRepository.filter(
      userId,
      blockchain,
      assetType,
      isFavorite,
    );
    return GroupPlainToInstances(AddressBookDto, result, [RoleEnum.user]);
  }

  async findByMe(
    id: AddressBook['id'],
    userId: User['id'],
  ): Promise<NullableType<AddressBookDto>> {
    const addressBook = await this.addressBookRepository.findById(id, userId);
    return addressBook
      ? GroupPlainToInstance(AddressBookDto, addressBook, [RoleEnum.user])
      : null;
  }
}
