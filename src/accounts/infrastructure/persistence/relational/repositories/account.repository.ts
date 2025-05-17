import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { AccountEntity } from '../entities/account.entity';
import { NullableType } from '../../../../../utils/types/nullable.type';
import { Account } from '../../../../domain/account';
import { AccountRepository } from '../../account.repository';
import { AccountMapper } from '../mappers/account.mapper';
import { IPaginationOptions } from '../../../../../utils/types/pagination-options';

@Injectable()
export class AccountRelationalRepository implements AccountRepository {
  constructor(
    @InjectRepository(AccountEntity)
    private readonly accountRepository: Repository<AccountEntity>,
  ) {}

  async create(data: Account): Promise<Account> {
    const persistenceModel = AccountMapper.toPersistence(data);
    const newEntity = await this.accountRepository.save(
      this.accountRepository.create(persistenceModel),
    );
    return AccountMapper.toDomain(newEntity);
  }

  async findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<Account[]> {
    const entities = await this.accountRepository.find({
      skip: (paginationOptions.page - 1) * paginationOptions.limit,
      take: paginationOptions.limit,
    });

    return entities.map((entity) => AccountMapper.toDomain(entity));
  }

  async findById(id: Account['id']): Promise<NullableType<Account>> {
    const entity = await this.accountRepository.findOne({
      where: { id },
    });

    return entity ? AccountMapper.toDomain(entity) : null;
  }

  async findByIds(ids: Account['id'][]): Promise<Account[]> {
    const entities = await this.accountRepository.find({
      where: { id: In(ids) },
    });

    return entities.map((entity) => AccountMapper.toDomain(entity));
  }

  async update(id: Account['id'], payload: Partial<Account>): Promise<Account> {
    const entity = await this.accountRepository.findOne({
      where: { id },
    });

    if (!entity) {
      throw new Error('Record not found');
    }

    const updatedEntity = await this.accountRepository.save(
      this.accountRepository.create(
        AccountMapper.toPersistence({
          ...AccountMapper.toDomain(entity),
          ...payload,
        }),
      ),
    );

    return AccountMapper.toDomain(updatedEntity);
  }

  async remove(id: Account['id']): Promise<void> {
    await this.accountRepository.delete(id);
  }
}
