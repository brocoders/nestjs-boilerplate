import { Inject, Injectable } from '@nestjs/common';
import { Repository, In, DataSource, FindOptionsWhere } from 'typeorm';
import { AccountsReceivableEntity } from '../entities/accounts-receivable.entity';
import { NullableType } from '../../../../../utils/types/nullable.type';
import { AccountsReceivable } from '../../../../domain/accounts-receivable';
import { AccountsReceivableRepository } from '../../accounts-receivable.repository';
import { AccountsReceivableMapper } from '../mappers/accounts-receivable.mapper';
import { IPaginationOptions } from '../../../../../utils/types/pagination-options';
import { REQUEST } from '@nestjs/core';
import { TenantDataSource } from '../../../../../database/tenant-data-source';

@Injectable()
export class AccountsReceivableRelationalRepository
  implements AccountsReceivableRepository
{
  private accountsReceivableRepository: Repository<AccountsReceivableEntity>;

  constructor(@Inject(REQUEST) private request: Request) {
    const dataSource: DataSource =
      this.request['tenantDataSource'] || TenantDataSource.getCoreDataSource();
    this.accountsReceivableRepository = dataSource.getRepository(
      AccountsReceivableEntity,
    );
  }

  private applyTenantFilter(
    where: FindOptionsWhere<AccountsReceivableEntity> = {},
  ): FindOptionsWhere<AccountsReceivableEntity> {
    const tenantId = this.request['tenantId'];

    if (tenantId) {
      return {
        ...where,
        tenant: { id: tenantId },
      };
    }

    return where;
  }

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
      where: this.applyTenantFilter(),
    });

    return entities.map((entity) => AccountsReceivableMapper.toDomain(entity));
  }

  async findById(
    id: AccountsReceivable['id'],
  ): Promise<NullableType<AccountsReceivable>> {
    const entity = await this.accountsReceivableRepository.findOne({
      where: this.applyTenantFilter({ id }),
    });

    return entity ? AccountsReceivableMapper.toDomain(entity) : null;
  }

  async findByIds(
    ids: AccountsReceivable['id'][],
  ): Promise<AccountsReceivable[]> {
    const entities = await this.accountsReceivableRepository.find({
      where: this.applyTenantFilter({ id: In(ids) }),
    });

    return entities.map((entity) => AccountsReceivableMapper.toDomain(entity));
  }

  async update(
    id: AccountsReceivable['id'],
    payload: Partial<AccountsReceivable>,
  ): Promise<AccountsReceivable> {
    const entity = await this.accountsReceivableRepository.findOne({
      where: this.applyTenantFilter({ id }),
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
    const entity = await this.accountsReceivableRepository.findOne({
      where: this.applyTenantFilter({ id }),
    });

    if (!entity) {
      throw new Error('Record not found or access denied');
    }

    await this.accountsReceivableRepository.softDelete(entity.id);
  }
}
