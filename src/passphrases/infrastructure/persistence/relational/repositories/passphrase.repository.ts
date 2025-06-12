import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { PassphraseEntity } from '../entities/passphrase.entity';
import { NullableType } from '../../../../../utils/types/nullable.type';
import { Passphrase } from '../../../../domain/passphrase';
import { PassphraseRepository } from '../../passphrase.repository';
import { PassphraseMapper } from '../mappers/passphrase.mapper';
import { IPaginationOptions } from '../../../../../utils/types/pagination-options';

@Injectable()
export class PassphraseRelationalRepository implements PassphraseRepository {
  constructor(
    @InjectRepository(PassphraseEntity)
    private readonly passphraseRepository: Repository<PassphraseEntity>,
  ) {}

  async create(data: Passphrase): Promise<Passphrase> {
    const persistenceModel = PassphraseMapper.toPersistence(data);
    const newEntity = await this.passphraseRepository.save(
      this.passphraseRepository.create(persistenceModel),
    );
    return PassphraseMapper.toDomain(newEntity);
  }

  async findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<Passphrase[]> {
    const entities = await this.passphraseRepository.find({
      skip: (paginationOptions.page - 1) * paginationOptions.limit,
      take: paginationOptions.limit,
    });

    return entities.map((entity) => PassphraseMapper.toDomain(entity));
  }

  async findById(id: Passphrase['id']): Promise<NullableType<Passphrase>> {
    const entity = await this.passphraseRepository.findOne({
      where: { id },
    });

    return entity ? PassphraseMapper.toDomain(entity) : null;
  }

  async findByIds(ids: Passphrase['id'][]): Promise<Passphrase[]> {
    const entities = await this.passphraseRepository.find({
      where: { id: In(ids) },
    });

    return entities.map((entity) => PassphraseMapper.toDomain(entity));
  }

  async update(
    id: Passphrase['id'],
    payload: Partial<Passphrase>,
  ): Promise<Passphrase> {
    const entity = await this.passphraseRepository.findOne({
      where: { id },
    });

    if (!entity) {
      throw new Error('Record not found');
    }

    const updatedEntity = await this.passphraseRepository.save(
      this.passphraseRepository.create(
        PassphraseMapper.toPersistence({
          ...PassphraseMapper.toDomain(entity),
          ...payload,
        }),
      ),
    );

    return PassphraseMapper.toDomain(updatedEntity);
  }

  async remove(id: Passphrase['id']): Promise<void> {
    await this.passphraseRepository.delete(id);
  }

  async findByUserId(userId: number | string): Promise<Passphrase[]> {
    // Ensure userId is a number if string
    const id = typeof userId === 'string' ? parseInt(userId, 10) : userId;
    const entities = await this.passphraseRepository.find({
      where: {
        user: {
          id: id,
        },
      },
      relations: ['user'],
    });
    return entities.map((entity) => PassphraseMapper.toDomain(entity));
  }

  async findManyWithPagination({
    filterOptions, //TODO: Filter not working
    sortOptions,
    paginationOptions,
  }: {
    filterOptions?: any | null;
    sortOptions?: any[] | null;
    paginationOptions: IPaginationOptions;
  }): Promise<Passphrase[]> {
    const where: Record<string, any> = {};
    if (filterOptions?.location) {
      where.location = filterOptions.location;
    }

    const order: Record<string, 'ASC' | 'DESC'> = {};
    if (Array.isArray(sortOptions)) {
      sortOptions.forEach((item) => {
        order[item.orderBy] = item.order;
      });
    }

    const entities = await this.passphraseRepository.find({
      skip: (paginationOptions.page - 1) * paginationOptions.limit,
      take: paginationOptions.limit,
      where,
      order,
    });
    return entities.map((entity) => PassphraseMapper.toDomain(entity));
  }
}
