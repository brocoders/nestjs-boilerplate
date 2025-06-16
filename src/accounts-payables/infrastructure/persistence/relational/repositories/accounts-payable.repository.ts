import { Inject, Injectable } from '@nestjs/common';
import { Repository, In, DataSource, FindOptionsWhere } from 'typeorm';
import { AccountsPayableEntity } from '../entities/accounts-payable.entity';
import { NullableType } from '../../../../../utils/types/nullable.type';
import { AccountsPayable } from '../../../../domain/accounts-payable';
import { AccountsPayableRepository } from '../../accounts-payable.repository';
import { AccountsPayableMapper } from '../mappers/accounts-payable.mapper';
import { IPaginationOptions } from '../../../../../utils/types/pagination-options';
import { REQUEST } from '@nestjs/core';
import { TenantDataSource } from '../../../../../database/tenant-data-source';

@Injectable()
export class AccountsPayableRelationalRepository
  implements AccountsPayableRepository
{
  private accountsPayableRepository: Repository<AccountsPayableEntity>;

  constructor(@Inject(REQUEST) private request: Request) {
    const dataSource: DataSource =
      this.request['tenantDataSource'] || TenantDataSource.getCoreDataSource();
    this.accountsPayableRepository = dataSource.getRepository(
      AccountsPayableEntity,
    );
  }

  private applyTenantFilter(
    where: FindOptionsWhere<AccountsPayableEntity> = {},
  ): FindOptionsWhere<AccountsPayableEntity> {
    const tenantId = this.request['tenantId'];

    if (tenantId) {
      return {
        ...where,
        tenant: { id: tenantId },
      };
    }

    return where;
  }

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
      where: this.applyTenantFilter(),
    });

    return entities.map((entity) => AccountsPayableMapper.toDomain(entity));
  }

  async findById(
    id: AccountsPayable['id'],
  ): Promise<NullableType<AccountsPayable>> {
    const entity = await this.accountsPayableRepository.findOne({
      where: this.applyTenantFilter({ id }),
    });

    return entity ? AccountsPayableMapper.toDomain(entity) : null;
  }

  async findByIds(ids: AccountsPayable['id'][]): Promise<AccountsPayable[]> {
    const entities = await this.accountsPayableRepository.find({
      where: this.applyTenantFilter({ id: In(ids) }),
    });

    return entities.map((entity) => AccountsPayableMapper.toDomain(entity));
  }

  async update(
    id: AccountsPayable['id'],
    payload: Partial<AccountsPayable>,
  ): Promise<AccountsPayable> {
    const entity = await this.accountsPayableRepository.findOne({
      where: this.applyTenantFilter({ id }),
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
    const entity = await this.accountsPayableRepository.findOne({
      where: this.applyTenantFilter({ id }),
    });

    if (!entity) {
      throw new Error('Record not found or access denied');
    }

    await this.accountsPayableRepository.softDelete(entity.id);
  }
}
