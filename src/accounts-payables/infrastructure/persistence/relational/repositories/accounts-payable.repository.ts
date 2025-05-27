import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { AccountsPayableEntity } from '../entities/accounts-payable.entity';
import { NullableType } from '../../../../../utils/types/nullable.type';
import { AccountsPayable } from '../../../../domain/accounts-payable';
import { AccountsPayableRepository } from '../../accounts-payable.repository';
import { AccountsPayableMapper } from '../mappers/accounts-payable.mapper';
import { IPaginationOptions } from '../../../../../utils/types/pagination-options';

@Injectable()
export class AccountsPayableRelationalRepository
  implements AccountsPayableRepository
{
  constructor(
    @InjectRepository(AccountsPayableEntity)
    private readonly accountsPayableRepository: Repository<AccountsPayableEntity>,
  ) {}

  async create(data: AccountsPayable): Promise<AccountsPayable> {
    const persistenceModel = AccountsPayableMapper.toPersistence(data);
    const newEntity = await this.accountsPayableRepository.save(
      this.accountsPayableRepository.create(persistenceModel),
    );
    return AccountsPayableMapper.toDomain(newEntity);
  }

  async findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<AccountsPayable[]> {
    const entities = await this.accountsPayableRepository.find({
      skip: (paginationOptions.page - 1) * paginationOptions.limit,
      take: paginationOptions.limit,
    });

    return entities.map((entity) => AccountsPayableMapper.toDomain(entity));
  }

  async findById(
    id: AccountsPayable['id'],
  ): Promise<NullableType<AccountsPayable>> {
    const entity = await this.accountsPayableRepository.findOne({
      where: { id },
    });

    return entity ? AccountsPayableMapper.toDomain(entity) : null;
  }

  async findByIds(ids: AccountsPayable['id'][]): Promise<AccountsPayable[]> {
    const entities = await this.accountsPayableRepository.find({
      where: { id: In(ids) },
    });

    return entities.map((entity) => AccountsPayableMapper.toDomain(entity));
  }

  async update(
    id: AccountsPayable['id'],
    payload: Partial<AccountsPayable>,
  ): Promise<AccountsPayable> {
    const entity = await this.accountsPayableRepository.findOne({
      where: { id },
    });

    if (!entity) {
      throw new Error('Record not found');
    }

    const updatedEntity = await this.accountsPayableRepository.save(
      this.accountsPayableRepository.create(
        AccountsPayableMapper.toPersistence({
          ...AccountsPayableMapper.toDomain(entity),
          ...payload,
        }),
      ),
    );

    return AccountsPayableMapper.toDomain(updatedEntity);
  }

  async remove(id: AccountsPayable['id']): Promise<void> {
    await this.accountsPayableRepository.delete(id);
  }
}
