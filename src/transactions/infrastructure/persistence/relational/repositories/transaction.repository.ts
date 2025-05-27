import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { TransactionEntity } from '../entities/transaction.entity';
import { NullableType } from '../../../../../utils/types/nullable.type';
import { Transaction } from '../../../../domain/transaction';
import { TransactionRepository } from '../../transaction.repository';
import { TransactionMapper } from '../mappers/transaction.mapper';
import { IPaginationOptions } from '../../../../../utils/types/pagination-options';

@Injectable()
export class TransactionRelationalRepository implements TransactionRepository {
  constructor(
    @InjectRepository(TransactionEntity)
    private readonly transactionRepository: Repository<TransactionEntity>,
  ) {}

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
      where: { id },
    });

    return entity ? TransactionMapper.toDomain(entity) : null;
  }

  async findByIds(ids: Transaction['id'][]): Promise<Transaction[]> {
    const entities = await this.transactionRepository.find({
      where: { id: In(ids) },
    });

    return entities.map((entity) => TransactionMapper.toDomain(entity));
  }

  async update(
    id: Transaction['id'],
    payload: Partial<Transaction>,
  ): Promise<Transaction> {
    const entity = await this.transactionRepository.findOne({
      where: { id },
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
    await this.transactionRepository.delete(id);
  }
}
