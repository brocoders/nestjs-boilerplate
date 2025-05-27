import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { AccountsReceivableEntity } from '../entities/accounts-receivable.entity';
import { NullableType } from '../../../../../utils/types/nullable.type';
import { AccountsReceivable } from '../../../../domain/accounts-receivable';
import { AccountsReceivableRepository } from '../../accounts-receivable.repository';
import { AccountsReceivableMapper } from '../mappers/accounts-receivable.mapper';
import { IPaginationOptions } from '../../../../../utils/types/pagination-options';

@Injectable()
export class AccountsReceivableRelationalRepository
  implements AccountsReceivableRepository
{
  constructor(
    @InjectRepository(AccountsReceivableEntity)
    private readonly accountsReceivableRepository: Repository<AccountsReceivableEntity>,
  ) {}

  async create(data: AccountsReceivable): Promise<AccountsReceivable> {
    const persistenceModel = AccountsReceivableMapper.toPersistence(data);
    const newEntity = await this.accountsReceivableRepository.save(
      this.accountsReceivableRepository.create(persistenceModel),
    );
    return AccountsReceivableMapper.toDomain(newEntity);
  }

  async findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<AccountsReceivable[]> {
    const entities = await this.accountsReceivableRepository.find({
      skip: (paginationOptions.page - 1) * paginationOptions.limit,
      take: paginationOptions.limit,
    });

    return entities.map((entity) => AccountsReceivableMapper.toDomain(entity));
  }

  async findById(
    id: AccountsReceivable['id'],
  ): Promise<NullableType<AccountsReceivable>> {
    const entity = await this.accountsReceivableRepository.findOne({
      where: { id },
    });

    return entity ? AccountsReceivableMapper.toDomain(entity) : null;
  }

  async findByIds(
    ids: AccountsReceivable['id'][],
  ): Promise<AccountsReceivable[]> {
    const entities = await this.accountsReceivableRepository.find({
      where: { id: In(ids) },
    });

    return entities.map((entity) => AccountsReceivableMapper.toDomain(entity));
  }

  async update(
    id: AccountsReceivable['id'],
    payload: Partial<AccountsReceivable>,
  ): Promise<AccountsReceivable> {
    const entity = await this.accountsReceivableRepository.findOne({
      where: { id },
    });

    if (!entity) {
      throw new Error('Record not found');
    }

    const updatedEntity = await this.accountsReceivableRepository.save(
      this.accountsReceivableRepository.create(
        AccountsReceivableMapper.toPersistence({
          ...AccountsReceivableMapper.toDomain(entity),
          ...payload,
        }),
      ),
    );

    return AccountsReceivableMapper.toDomain(updatedEntity);
  }

  async remove(id: AccountsReceivable['id']): Promise<void> {
    await this.accountsReceivableRepository.delete(id);
  }
}
