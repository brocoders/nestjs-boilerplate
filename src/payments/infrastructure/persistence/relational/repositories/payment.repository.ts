import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { PaymentEntity } from '../entities/payment.entity';
import { NullableType } from '../../../../../utils/types/nullable.type';
import { Payment } from '../../../../domain/payment';
import { PaymentRepository } from '../../payment.repository';
import { PaymentMapper } from '../mappers/payment.mapper';
import { IPaginationOptions } from '../../../../../utils/types/pagination-options';

@Injectable()
export class PaymentRelationalRepository implements PaymentRepository {
  constructor(
    @InjectRepository(PaymentEntity)
    private readonly paymentRepository: Repository<PaymentEntity>,
  ) {}

  async create(data: Payment): Promise<Payment> {
    const persistenceModel = PaymentMapper.toPersistence(data);
    const newEntity = await this.paymentRepository.save(
      this.paymentRepository.create(persistenceModel),
    );
    return PaymentMapper.toDomain(newEntity);
  }

  async findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<Payment[]> {
    const entities = await this.paymentRepository.find({
      skip: (paginationOptions.page - 1) * paginationOptions.limit,
      take: paginationOptions.limit,
    });

    return entities.map((entity) => PaymentMapper.toDomain(entity));
  }

  async findById(id: Payment['id']): Promise<NullableType<Payment>> {
    const entity = await this.paymentRepository.findOne({
      where: { id },
    });

    return entity ? PaymentMapper.toDomain(entity) : null;
  }

  async findByIds(ids: Payment['id'][]): Promise<Payment[]> {
    const entities = await this.paymentRepository.find({
      where: { id: In(ids) },
    });

    return entities.map((entity) => PaymentMapper.toDomain(entity));
  }

  async update(id: Payment['id'], payload: Partial<Payment>): Promise<Payment> {
    const entity = await this.paymentRepository.findOne({
      where: { id },
    });

    if (!entity) {
      throw new Error('Record not found');
    }

    const updatedEntity = await this.paymentRepository.save(
      this.paymentRepository.create(
        PaymentMapper.toPersistence({
          ...PaymentMapper.toDomain(entity),
          ...payload,
        }),
      ),
    );

    return PaymentMapper.toDomain(updatedEntity);
  }

  async remove(id: Payment['id']): Promise<void> {
    await this.paymentRepository.delete(id);
  }
}
