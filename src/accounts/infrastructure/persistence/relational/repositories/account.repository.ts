import { Inject, Injectable } from '@nestjs/common';
import { Repository, In, DataSource, FindOptionsWhere } from 'typeorm';
import { AccountEntity } from '../entities/account.entity';
import { NullableType } from '../../../../../utils/types/nullable.type';
import { Account } from '../../../../domain/account';
import { AccountRepository } from '../../account.repository';
import { AccountMapper } from '../mappers/account.mapper';
import { IPaginationOptions } from '../../../../../utils/types/pagination-options';
import { REQUEST } from '@nestjs/core';
import { TenantDataSource } from '../../../../../database/tenant-data-source';

@Injectable()
export class AccountRelationalRepository implements AccountRepository {
  private accountRepository: Repository<AccountEntity>;

  constructor(@Inject(REQUEST) private request: Request) {
    const dataSource: DataSource =
      this.request['tenantDataSource'] || TenantDataSource.getCoreDataSource();
    this.accountRepository = dataSource.getRepository(AccountEntity);
  }

  private applyTenantFilter(
    where: FindOptionsWhere<AccountEntity> = {},
  ): FindOptionsWhere<AccountEntity> {
    const tenantId = this.request['tenantId'];

    if (tenantId) {
      return {
        ...where,
        tenant: { id: tenantId },
      };
    }

    return where;
  }

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
      where: this.applyTenantFilter(),
    });

    return entities.map((entity) => AccountMapper.toDomain(entity));
  }

  async findById(id: Account['id']): Promise<NullableType<Account>> {
    const entity = await this.accountRepository.findOne({
      where: this.applyTenantFilter({ id }),
    });
    return entity ? AccountMapper.toDomain(entity) : null;
  }

  async findByIds(ids: Account['id'][]): Promise<Account[]> {
    const entities = await this.accountRepository.find({
      where: this.applyTenantFilter({ id: In(ids) }),
    });

    return entities.map((entity) => AccountMapper.toDomain(entity));
  }

  async update(id: Account['id'], payload: Partial<Account>): Promise<Account> {
    const entity = await this.accountRepository.findOne({
      where: this.applyTenantFilter({ id }),
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
    const entity = await this.accountRepository.findOne({
      where: this.applyTenantFilter({ id }),
    });

    if (!entity) {
      throw new Error('Record not found or access denied');
    }

    await this.accountRepository.softDelete(entity.id);
  }
}
