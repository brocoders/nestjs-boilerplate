import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { AddressBookEntity } from '../entities/address-book.entity';
import { NullableType } from '../../../../../utils/types/nullable.type';
import { AddressBook } from '../../../../domain/address-book';
import { AddressBookRepository } from '../../address-book.repository';
import { AddressBookMapper } from '../mappers/address-book.mapper';
import { IPaginationOptions } from '../../../../../utils/types/pagination-options';
import { User } from '../../../../../users/domain/user';

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

  async findById(
    id: AddressBook['id'],
    userId?: User['id'],
  ): Promise<NullableType<AddressBook>> {
    const where = userId ? { id, user: { id: Number(userId) } } : { id };

    const entity = await this.addressBookRepository.findOne({
      where,
      relations: ['user'],
    });

    return entity ? AddressBookMapper.toDomain(entity) : null;
  }

  async findByIds(ids: AddressBook['id'][]): Promise<AddressBook[]> {
    const entities = await this.addressBookRepository.find({
      where: { id: In(ids) },
      relations: ['user'],
    });

    return entities.map((entity) => AddressBookMapper.toDomain(entity));
  }

  async update(
    id: AddressBook['id'],
    payload: Partial<AddressBook>,
  ): Promise<AddressBook> {
    const entity = await this.addressBookRepository.findOne({
      where: { id },
      relations: ['user'],
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

  async remove(id: AddressBook['id'], userId?: User['id']): Promise<void> {
    const whereCondition: any = { id: Number(id) };

    if (userId) {
      whereCondition.user = { id: Number(userId) };
    }

    const entity = await this.addressBookRepository.findOne({
      where: whereCondition,
      relations: ['user'],
    });

    if (entity) {
      await this.addressBookRepository.remove(entity);
    }
  }

  async findAllByUserId(userId: User['id']): Promise<AddressBook[]> {
    const entities = await this.addressBookRepository.find({
      where: {
        user: {
          id: Number(userId),
        },
      },
      relations: ['user'],
    });
    return entities.map((entity) => AddressBookMapper.toDomain(entity));
  }

  async findFavorites(userId?: User['id']): Promise<AddressBook[]> {
    const where: any = { isFavorite: true };
    if (userId !== undefined) {
      where.user = { id: Number(userId) };
    }

    const entities = await this.addressBookRepository.find({
      where,
      relations: ['user'],
    });
    return entities.map((entity) => AddressBookMapper.toDomain(entity));
  }

  async filter(
    userId?: User['id'],
    blockchain?: AddressBook['blockchain'],
    assetType?: AddressBook['assetType'],
    isFavorite?: AddressBook['isFavorite'],
    label?: AddressBook['label'],
  ): Promise<AddressBook[]> {
    const where: any = {};

    if (userId !== undefined) {
      where.user = { id: Number(userId) };
    }
    if (blockchain !== undefined) {
      where.blockchain = blockchain;
    }
    if (assetType !== undefined) {
      where.assetType = assetType;
    }
    if (isFavorite !== undefined) {
      where.isFavorite = isFavorite;
    }
    if (label !== undefined) {
      where.label = label;
    }

    const entities = await this.addressBookRepository.find({
      where,
      relations: ['user'],
    });
    return entities.map((entity) => AddressBookMapper.toDomain(entity));
  }
}
