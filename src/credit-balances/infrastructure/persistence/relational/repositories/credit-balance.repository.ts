import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { CreditBalanceEntity } from '../entities/credit-balance.entity';
import { NullableType } from '../../../../../utils/types/nullable.type';
import { CreditBalance } from '../../../../domain/credit-balance';
import { CreditBalanceRepository } from '../../credit-balance.repository';
import { CreditBalanceMapper } from '../mappers/credit-balance.mapper';
import { IPaginationOptions } from '../../../../../utils/types/pagination-options';

@Injectable()
export class CreditBalanceRelationalRepository
  implements CreditBalanceRepository
{
  constructor(
    @InjectRepository(CreditBalanceEntity)
    private readonly creditBalanceRepository: Repository<CreditBalanceEntity>,
  ) {}

  async create(data: CreditBalance): Promise<CreditBalance> {
    const persistenceModel = CreditBalanceMapper.toPersistence(data);
    const newEntity = await this.creditBalanceRepository.save(
      this.creditBalanceRepository.create(persistenceModel),
    );
    return CreditBalanceMapper.toDomain(newEntity);
  }

  async findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<CreditBalance[]> {
    const entities = await this.creditBalanceRepository.find({
      skip: (paginationOptions.page - 1) * paginationOptions.limit,
      take: paginationOptions.limit,
    });

    return entities.map((entity) => CreditBalanceMapper.toDomain(entity));
  }

  async findById(
    id: CreditBalance['id'],
  ): Promise<NullableType<CreditBalance>> {
    const entity = await this.creditBalanceRepository.findOne({
      where: { id },
    });

    return entity ? CreditBalanceMapper.toDomain(entity) : null;
  }

  async findByIds(ids: CreditBalance['id'][]): Promise<CreditBalance[]> {
    const entities = await this.creditBalanceRepository.find({
      where: { id: In(ids) },
    });

    return entities.map((entity) => CreditBalanceMapper.toDomain(entity));
  }

  async update(
    id: CreditBalance['id'],
    payload: Partial<CreditBalance>,
  ): Promise<CreditBalance> {
    const entity = await this.creditBalanceRepository.findOne({
      where: { id },
    });

    if (!entity) {
      throw new Error('Record not found');
    }

    const updatedEntity = await this.creditBalanceRepository.save(
      this.creditBalanceRepository.create(
        CreditBalanceMapper.toPersistence({
          ...CreditBalanceMapper.toDomain(entity),
          ...payload,
        }),
      ),
    );

    return CreditBalanceMapper.toDomain(updatedEntity);
  }

  async remove(id: CreditBalance['id']): Promise<void> {
    await this.creditBalanceRepository.delete(id);
  }
}
