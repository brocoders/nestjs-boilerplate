import { Inject, Injectable } from '@nestjs/common';
import { Repository, In, DataSource, FindOptionsWhere } from 'typeorm';
import { TransactionEntity } from '../entities/transaction.entity';
import { NullableType } from '../../../../../utils/types/nullable.type';
import { Transaction } from '../../../../domain/transaction';
import { TransactionRepository } from '../../transaction.repository';
import { TransactionMapper } from '../mappers/transaction.mapper';
import { IPaginationOptions } from '../../../../../utils/types/pagination-options';
import { REQUEST } from '@nestjs/core';
import { TenantDataSource } from '../../../../../database/tenant-data-source';

@Injectable()
export class TransactionRelationalRepository implements TransactionRepository {
  private transactionRepository: Repository<TransactionEntity>;

  constructor(@Inject(REQUEST) private request: Request) {
    const dataSource: DataSource =
      this.request['tenantDataSource'] || TenantDataSource.getCoreDataSource();
    this.transactionRepository = dataSource.getRepository(TransactionEntity);
  }

  private applyTenantFilter(
    where: FindOptionsWhere<TransactionEntity> = {},
  ): FindOptionsWhere<TransactionEntity> {
    const tenantId = this.request['tenantId'];

    if (tenantId) {
      return {
        ...where,
        tenant: { id: tenantId },
      };
    }

    return where;
  }

  async create(data: Transaction): Promise<Transaction> {
    const persistenceModel = TransactionMapper.toPersistence(data);
    const newEntity = await this.transactionRepository.save(
      this.transactionRepository.create(persistenceModel),
    );
    return TransactionMapper.toDomain(newEntity);
  }

  async findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<Transaction[]> {
    const entities = await this.transactionRepository.find({
      skip: (paginationOptions.page - 1) * paginationOptions.limit,
      take: paginationOptions.limit,
    });

    return entities.map((entity) => TransactionMapper.toDomain(entity));
  }

  async findById(id: Transaction['id']): Promise<NullableType<Transaction>> {
    const entity = await this.transactionRepository.findOne({
      where: this.applyTenantFilter({ id }),
    });

    return entity ? TransactionMapper.toDomain(entity) : null;
  }

  async findByIds(ids: Transaction['id'][]): Promise<Transaction[]> {
    const entities = await this.transactionRepository.find({
      where: this.applyTenantFilter({ id: In(ids) }),
    });

    return entities.map((entity) => TransactionMapper.toDomain(entity));
  }

  async update(
    id: Transaction['id'],
    payload: Partial<Transaction>,
  ): Promise<Transaction> {
    const entity = await this.transactionRepository.findOne({
      where: this.applyTenantFilter({ id }),
    });

    if (!entity) {
      throw new Error('Record not found');
    }

    const updatedEntity = await this.transactionRepository.save(
      this.transactionRepository.create(
        TransactionMapper.toPersistence({
          ...TransactionMapper.toDomain(entity),
          ...payload,
        }),
      ),
    );

    return TransactionMapper.toDomain(updatedEntity);
  }

  async remove(id: Transaction['id']): Promise<void> {
    const entity = await this.transactionRepository.findOne({
      where: this.applyTenantFilter({ id }),
    });

    if (!entity) {
      throw new Error('Record not found or access denied');
    }

    await this.transactionRepository.softDelete(entity.id);
  }
}
