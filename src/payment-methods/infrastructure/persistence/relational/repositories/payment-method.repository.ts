import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { PaymentMethodEntity } from '../entities/payment-method.entity';
import { NullableType } from '../../../../../utils/types/nullable.type';
import { PaymentMethod } from '../../../../domain/payment-method';
import { PaymentMethodRepository } from '../../payment-method.repository';
import { PaymentMethodMapper } from '../mappers/payment-method.mapper';
import { IPaginationOptions } from '../../../../../utils/types/pagination-options';

@Injectable()
export class PaymentMethodRelationalRepository
  implements PaymentMethodRepository
{
  constructor(
    @InjectRepository(PaymentMethodEntity)
    private readonly paymentMethodRepository: Repository<PaymentMethodEntity>,
  ) {}

  async create(data: PaymentMethod): Promise<PaymentMethod> {
    const persistenceModel = PaymentMethodMapper.toPersistence(data);
    const newEntity = await this.paymentMethodRepository.save(
      this.paymentMethodRepository.create(persistenceModel),
    );
    return PaymentMethodMapper.toDomain(newEntity);
  }

  async findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<PaymentMethod[]> {
    const entities = await this.paymentMethodRepository.find({
      skip: (paginationOptions.page - 1) * paginationOptions.limit,
      take: paginationOptions.limit,
    });

    return entities.map((entity) => PaymentMethodMapper.toDomain(entity));
  }

  async findById(
    id: PaymentMethod['id'],
  ): Promise<NullableType<PaymentMethod>> {
    const entity = await this.paymentMethodRepository.findOne({
      where: { id },
    });

    return entity ? PaymentMethodMapper.toDomain(entity) : null;
  }

  async findByIds(ids: PaymentMethod['id'][]): Promise<PaymentMethod[]> {
    const entities = await this.paymentMethodRepository.find({
      where: { id: In(ids) },
    });

    return entities.map((entity) => PaymentMethodMapper.toDomain(entity));
  }

  async update(
    id: PaymentMethod['id'],
    payload: Partial<PaymentMethod>,
  ): Promise<PaymentMethod> {
    const entity = await this.paymentMethodRepository.findOne({
      where: { id },
    });

    if (!entity) {
      throw new Error('Record not found');
    }

    const updatedEntity = await this.paymentMethodRepository.save(
      this.paymentMethodRepository.create(
        PaymentMethodMapper.toPersistence({
          ...PaymentMethodMapper.toDomain(entity),
          ...payload,
        }),
      ),
    );

    return PaymentMethodMapper.toDomain(updatedEntity);
  }

  async remove(id: PaymentMethod['id']): Promise<void> {
    await this.paymentMethodRepository.delete(id);
  }
}
