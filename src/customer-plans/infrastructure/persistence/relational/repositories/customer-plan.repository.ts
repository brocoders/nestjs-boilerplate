import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { CustomerPlanEntity } from '../entities/customer-plan.entity';
import { NullableType } from '../../../../../utils/types/nullable.type';
import { CustomerPlan } from '../../../../domain/customer-plan';
import { CustomerPlanRepository } from '../../customer-plan.repository';
import { CustomerPlanMapper } from '../mappers/customer-plan.mapper';
import { IPaginationOptions } from '../../../../../utils/types/pagination-options';

@Injectable()
export class CustomerPlanRelationalRepository
  implements CustomerPlanRepository
{
  constructor(
    @InjectRepository(CustomerPlanEntity)
    private readonly customerPlanRepository: Repository<CustomerPlanEntity>,
  ) {}

  async create(data: CustomerPlan): Promise<CustomerPlan> {
    const persistenceModel = CustomerPlanMapper.toPersistence(data);
    const newEntity = await this.customerPlanRepository.save(
      this.customerPlanRepository.create(persistenceModel),
    );
    return CustomerPlanMapper.toDomain(newEntity);
  }

  async findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<CustomerPlan[]> {
    const entities = await this.customerPlanRepository.find({
      skip: (paginationOptions.page - 1) * paginationOptions.limit,
      take: paginationOptions.limit,
    });

    return entities.map((entity) => CustomerPlanMapper.toDomain(entity));
  }

  async findById(id: CustomerPlan['id']): Promise<NullableType<CustomerPlan>> {
    const entity = await this.customerPlanRepository.findOne({
      where: { id },
    });

    return entity ? CustomerPlanMapper.toDomain(entity) : null;
  }

  async findByIds(ids: CustomerPlan['id'][]): Promise<CustomerPlan[]> {
    const entities = await this.customerPlanRepository.find({
      where: { id: In(ids) },
    });

    return entities.map((entity) => CustomerPlanMapper.toDomain(entity));
  }

  async update(
    id: CustomerPlan['id'],
    payload: Partial<CustomerPlan>,
  ): Promise<CustomerPlan> {
    const entity = await this.customerPlanRepository.findOne({
      where: { id },
    });

    if (!entity) {
      throw new Error('Record not found');
    }

    const updatedEntity = await this.customerPlanRepository.save(
      this.customerPlanRepository.create(
        CustomerPlanMapper.toPersistence({
          ...CustomerPlanMapper.toDomain(entity),
          ...payload,
        }),
      ),
    );

    return CustomerPlanMapper.toDomain(updatedEntity);
  }

  async remove(id: CustomerPlan['id']): Promise<void> {
    await this.customerPlanRepository.delete(id);
  }
}
