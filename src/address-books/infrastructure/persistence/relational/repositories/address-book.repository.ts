import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { AddressBookEntity } from '../entities/address-book.entity';
import { NullableType } from '../../../../../utils/types/nullable.type';
import { AddressBook } from '../../../../domain/address-book';
import { AddressBookRepository } from '../../address-book.repository';
import { AddressBookMapper } from '../mappers/address-book.mapper';
import { IPaginationOptions } from '../../../../../utils/types/pagination-options';

@Injectable()
export class AddressBookRelationalRepository implements AddressBookRepository {
  constructor(
    @InjectRepository(AddressBookEntity)
    private readonly addressBookRepository: Repository<AddressBookEntity>,
  ) {}

  async create(data: AddressBook): Promise<AddressBook> {
    const persistenceModel = AddressBookMapper.toPersistence(data);
    const newEntity = await this.addressBookRepository.save(
      this.addressBookRepository.create(persistenceModel),
    );
    return AddressBookMapper.toDomain(newEntity);
  }

  async findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<AddressBook[]> {
    const entities = await this.addressBookRepository.find({
      skip: (paginationOptions.page - 1) * paginationOptions.limit,
      take: paginationOptions.limit,
    });

    return entities.map((entity) => AddressBookMapper.toDomain(entity));
  }

  async findById(id: AddressBook['id']): Promise<NullableType<AddressBook>> {
    const entity = await this.addressBookRepository.findOne({
      where: { id },
    });

    return entity ? AddressBookMapper.toDomain(entity) : null;
  }

  async findByIds(ids: AddressBook['id'][]): Promise<AddressBook[]> {
    const entities = await this.addressBookRepository.find({
      where: { id: In(ids) },
    });

    return entities.map((entity) => AddressBookMapper.toDomain(entity));
  }

  async update(
    id: AddressBook['id'],
    payload: Partial<AddressBook>,
  ): Promise<AddressBook> {
    const entity = await this.addressBookRepository.findOne({
      where: { id },
    });

    if (!entity) {
      throw new Error('Record not found');
    }

    const updatedEntity = await this.addressBookRepository.save(
      this.addressBookRepository.create(
        AddressBookMapper.toPersistence({
          ...AddressBookMapper.toDomain(entity),
          ...payload,
        }),
      ),
    );

    return AddressBookMapper.toDomain(updatedEntity);
  }

  async remove(id: AddressBook['id']): Promise<void> {
    await this.addressBookRepository.delete(id);
  }

  async findByUserId(userId: number): Promise<AddressBook[]> {
    const entities = await this.addressBookRepository.find({
      where: {
        user: {
          id: userId,
        },
      },
      relations: ['user'],
    });
    return entities.map((entity) => AddressBookMapper.toDomain(entity));
  }

  async findByLabel(
    userId: number,
    label: string,
  ): Promise<NullableType<AddressBook>> {
    const entity = await this.addressBookRepository.findOne({
      where: {
        user: {
          id: userId,
        },
        label,
      },
      relations: ['user'],
    });
    return entity ? AddressBookMapper.toDomain(entity) : null;
  }

  async findFavorites(userId: number): Promise<AddressBook[]> {
    const entities = await this.addressBookRepository.find({
      where: {
        user: {
          id: userId,
        },
        isFavorite: true,
      },
      relations: ['user'],
    });
    return entities.map((entity) => AddressBookMapper.toDomain(entity));
  }

  async findByAssetType(
    userId: number,
    assetType: string,
  ): Promise<AddressBook[]> {
    const entities = await this.addressBookRepository.find({
      where: {
        user: {
          id: userId,
        },
        assetType,
      },
      relations: ['user'],
    });
    return entities.map((entity) => AddressBookMapper.toDomain(entity));
  }

  async filter(
    userId: number,
    blockchain?: string,
    assetType?: string,
  ): Promise<AddressBook[]> {
    const where: any = {
      user: {
        id: userId,
      },
    };

    if (blockchain) {
      where.blockchain = blockchain;
    }
    if (assetType) {
      where.assetType = assetType;
    }

    const entities = await this.addressBookRepository.find({
      where,
      relations: ['user'],
    });
    return entities.map((entity) => AddressBookMapper.toDomain(entity));
  }
}
