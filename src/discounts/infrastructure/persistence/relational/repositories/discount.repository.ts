import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { DiscountEntity } from '../entities/discount.entity';
import { NullableType } from '../../../../../utils/types/nullable.type';
import { Discount } from '../../../../domain/discount';
import { DiscountRepository } from '../../discount.repository';
import { DiscountMapper } from '../mappers/discount.mapper';
import { IPaginationOptions } from '../../../../../utils/types/pagination-options';

@Injectable()
export class DiscountRelationalRepository implements DiscountRepository {
  constructor(
    @InjectRepository(DiscountEntity)
    private readonly discountRepository: Repository<DiscountEntity>,
  ) {}

  async create(data: Discount): Promise<Discount> {
    const persistenceModel = DiscountMapper.toPersistence(data);
    const newEntity = await this.discountRepository.save(
      this.discountRepository.create(persistenceModel),
    );
    return DiscountMapper.toDomain(newEntity);
  }

  async findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<Discount[]> {
    const entities = await this.discountRepository.find({
      skip: (paginationOptions.page - 1) * paginationOptions.limit,
      take: paginationOptions.limit,
    });

    return entities.map((entity) => DiscountMapper.toDomain(entity));
  }

  async findById(id: Discount['id']): Promise<NullableType<Discount>> {
    const entity = await this.discountRepository.findOne({
      where: { id },
    });

    return entity ? DiscountMapper.toDomain(entity) : null;
  }

  async findByIds(ids: Discount['id'][]): Promise<Discount[]> {
    const entities = await this.discountRepository.find({
      where: { id: In(ids) },
    });

    return entities.map((entity) => DiscountMapper.toDomain(entity));
  }

  async update(
    id: Discount['id'],
    payload: Partial<Discount>,
  ): Promise<Discount> {
    const entity = await this.discountRepository.findOne({
      where: { id },
    });

    if (!entity) {
      throw new Error('Record not found');
    }

    const updatedEntity = await this.discountRepository.save(
      this.discountRepository.create(
        DiscountMapper.toPersistence({
          ...DiscountMapper.toDomain(entity),
          ...payload,
        }),
      ),
    );

    return DiscountMapper.toDomain(updatedEntity);
  }

  async remove(id: Discount['id']): Promise<void> {
    await this.discountRepository.delete(id);
  }
}
