import {
  Injectable,
  HttpStatus,
  NotFoundException,
  UnprocessableEntityException,
  InternalServerErrorException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { User } from '../users/domain/user';
import { AddressBookRepository } from './infrastructure/persistence/address-book.repository';
import { CreateAddressBookDto } from './dto/create-address-book.dto';
import { UpdateAddressBookDto } from './dto/update-address-book.dto';
import { CreateAddressBookUserDto } from './dto/create-address-book-user.dto';
import { AddressBookUserResponseDto } from './dto/address-book-user-response.dto';
import { IPaginationOptions } from '../utils/types/pagination-options';
import { AddressBook } from './domain/address-book';
import { JwtPayloadType } from '../auth/strategies/types/jwt-payload.type';
import { plainToInstance } from 'class-transformer';
import { validate as isUUID } from 'uuid';

@Injectable()
export class AddressBooksService {
  constructor(
    private readonly userService: UsersService,
    private readonly addressBookRepository: AddressBookRepository,
  ) {}

  async create(createAddressBookDto: CreateAddressBookDto) {
    const user = await this.userService.findById(createAddressBookDto.user.id);
    if (!user) {
      throw new UnprocessableEntityException({
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        errors: { user: 'User does not exist' },
      });
    }

    try {
      return await this.addressBookRepository.create({
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
    } catch {
      throw new InternalServerErrorException('Failed to create address book');
    }
  }

  async findAllWithPagination({
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

  async findById(id: AddressBook['id']) {
    if (!isUUID(id)) {
      throw new UnprocessableEntityException({
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        message: 'Invalid ID format. Expected UUID.',
      });
    }

    const addressBook = await this.addressBookRepository.findById(id);
    if (!addressBook) {
      throw new NotFoundException({
        status: HttpStatus.NOT_FOUND,
        message: `Address book with ID '${id}' not found`,
      });
    }

    return addressBook;
  }

  async findByIds(ids: AddressBook['id'][]) {
    const results = await this.addressBookRepository.findByIds(ids);
    if (!results?.length) {
      throw new NotFoundException({
        status: HttpStatus.NOT_FOUND,
        message: 'No address books found for given IDs',
      });
    }
    return results;
  }

  async update(
    id: AddressBook['id'],
    updateAddressBookDto: UpdateAddressBookDto,
  ) {
    if (!isUUID(id)) {
      throw new UnprocessableEntityException({
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        message: 'Invalid ID format. Expected UUID.',
      });
    }

    let user: User | undefined = undefined;
    if (updateAddressBookDto.user) {
      const userObject = await this.userService.findById(
        updateAddressBookDto.user.id,
      );
      if (!userObject) {
        throw new UnprocessableEntityException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: { user: 'User does not exist' },
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

    if (!updated) {
      throw new InternalServerErrorException('Failed to update address book');
    }

    return updated;
  }

  async remove(id: AddressBook['id']) {
    if (!isUUID(id)) {
      throw new UnprocessableEntityException({
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        message: 'Invalid ID format. Expected UUID.',
      });
    }

    const addressBook = await this.addressBookRepository.findById(id);
    if (!addressBook) {
      throw new NotFoundException({
        status: HttpStatus.NOT_FOUND,
        message: 'Address book not found',
      });
    }

    await this.addressBookRepository.remove(id);
    return {
      status: HttpStatus.OK,
      message: 'Address book deleted successfully',
    };
  }

  async findAllByUser(userId: number): Promise<AddressBook[]> {
    if (isNaN(userId)) {
      throw new UnprocessableEntityException({
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        message: 'Invalid userId. Expected number.',
      });
    }

    const results = await this.addressBookRepository.findByUserId(userId);
    if (!results?.length) {
      throw new NotFoundException({
        status: HttpStatus.NOT_FOUND,
        message: `No address books found for user ID ${userId}`,
      });
    }

    return results;
  }

  async findByLabel(userId: number, label: string): Promise<AddressBook> {
    if (isNaN(userId)) {
      throw new UnprocessableEntityException({
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        message: 'Invalid userId. Expected number.',
      });
    }

    const result = await this.addressBookRepository.findByLabel(userId, label);
    if (!result) {
      throw new NotFoundException({
        status: HttpStatus.NOT_FOUND,
        message: `No address book found with label '${label}' for user ID ${userId}`,
      });
    }

    return result;
  }

  async findFavorites(userId: number): Promise<AddressBook[]> {
    if (isNaN(userId)) {
      throw new UnprocessableEntityException({
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        message: 'Invalid userId. Expected number.',
      });
    }

    const results = await this.addressBookRepository.findFavorites(userId);
    if (!results?.length) {
      throw new NotFoundException({
        status: HttpStatus.NOT_FOUND,
        message: `No favorite address books found for user ID ${userId}`,
      });
    }

    return results;
  }

  async findByAssetType(
    userId: number,
    assetType: string,
  ): Promise<AddressBook[]> {
    if (isNaN(userId)) {
      throw new UnprocessableEntityException({
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        message: 'Invalid userId. Expected number.',
      });
    }

    const results = await this.addressBookRepository.findByAssetType(
      userId,
      assetType,
    );
    if (!results?.length) {
      throw new NotFoundException({
        status: HttpStatus.NOT_FOUND,
        message: `No address books with asset type '${assetType}' found for user ID ${userId}`,
      });
    }

    return results;
  }

  async filter(
    userId: number,
    blockchain?: string,
    assetType?: string,
  ): Promise<AddressBook[]> {
    if (isNaN(userId)) {
      throw new UnprocessableEntityException({
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        message: 'Invalid userId. Expected number.',
      });
    }

    const results = await this.addressBookRepository.filter(
      userId,
      blockchain,
      assetType,
    );
    if (!results?.length) {
      throw new NotFoundException({
        status: HttpStatus.NOT_FOUND,
        message: `No address books found for user ID ${userId} with given filters`,
      });
    }

    return results;
  }

  async createByUser(
    createAddressBookUserDto: CreateAddressBookUserDto,
    userJwtPayload: JwtPayloadType,
  ) {
    const user = await this.userService.findById(userJwtPayload.id);
    if (!user) {
      throw new UnprocessableEntityException({
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        errors: { user: 'User does not exist' },
      });
    }

    return this.addressBookRepository.create({
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
  }

  async findByme(
    userJwtPayload: JwtPayloadType,
  ): Promise<AddressBookUserResponseDto[]> {
    const addressBooks = await this.addressBookRepository.findByUserId(
      Number(userJwtPayload.id),
    );
    if (!addressBooks?.length) {
      throw new NotFoundException({
        status: HttpStatus.NOT_FOUND,
        message: 'No address books found for the user',
      });
    }

    return addressBooks.map((item) =>
      plainToInstance(AddressBookUserResponseDto, item),
    );
  }
}
