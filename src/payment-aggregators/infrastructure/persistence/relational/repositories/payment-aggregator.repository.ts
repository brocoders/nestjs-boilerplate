import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { PaymentAggregatorEntity } from '../entities/payment-aggregator.entity';
import { NullableType } from '../../../../../utils/types/nullable.type';
import { PaymentAggregator } from '../../../../domain/payment-aggregator';
import { PaymentAggregatorRepository } from '../../payment-aggregator.repository';
import { PaymentAggregatorMapper } from '../mappers/payment-aggregator.mapper';
import { IPaginationOptions } from '../../../../../utils/types/pagination-options';

@Injectable()
export class PaymentAggregatorRelationalRepository
  implements PaymentAggregatorRepository
{
  constructor(
    @InjectRepository(PaymentAggregatorEntity)
    private readonly paymentAggregatorRepository: Repository<PaymentAggregatorEntity>,
  ) {}

  async create(data: PaymentAggregator): Promise<PaymentAggregator> {
    const persistenceModel = PaymentAggregatorMapper.toPersistence(data);
    const newEntity = await this.paymentAggregatorRepository.save(
      this.paymentAggregatorRepository.create(persistenceModel),
    );
    return PaymentAggregatorMapper.toDomain(newEntity);
  }

  async findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<PaymentAggregator[]> {
    const entities = await this.paymentAggregatorRepository.find({
      skip: (paginationOptions.page - 1) * paginationOptions.limit,
      take: paginationOptions.limit,
    });

    return entities.map((entity) => PaymentAggregatorMapper.toDomain(entity));
  }

  async findById(
    id: PaymentAggregator['id'],
  ): Promise<NullableType<PaymentAggregator>> {
    const entity = await this.paymentAggregatorRepository.findOne({
      where: { id },
    });

    return entity ? PaymentAggregatorMapper.toDomain(entity) : null;
  }

  async findByIds(
    ids: PaymentAggregator['id'][],
  ): Promise<PaymentAggregator[]> {
    const entities = await this.paymentAggregatorRepository.find({
      where: { id: In(ids) },
    });

    return entities.map((entity) => PaymentAggregatorMapper.toDomain(entity));
  }

  async update(
    id: PaymentAggregator['id'],
    payload: Partial<PaymentAggregator>,
  ): Promise<PaymentAggregator> {
    const entity = await this.paymentAggregatorRepository.findOne({
      where: { id },
    });

    if (!entity) {
      throw new Error('Record not found');
    }

    const updatedEntity = await this.paymentAggregatorRepository.save(
      this.paymentAggregatorRepository.create(
        PaymentAggregatorMapper.toPersistence({
          ...PaymentAggregatorMapper.toDomain(entity),
          ...payload,
        }),
      ),
    );

    return PaymentAggregatorMapper.toDomain(updatedEntity);
  }

  async remove(id: PaymentAggregator['id']): Promise<void> {
    await this.paymentAggregatorRepository.delete(id);
  }
}
