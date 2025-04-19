import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { TenantEntity } from '../entities/tenant.entity';
import { NullableType } from '../../../../../utils/types/nullable.type';
import { Tenant } from '../../../../domain/tenant';
import { TenantRepository } from '../../tenant.repository';
import { TenantMapper } from '../mappers/tenant.mapper';
import { IPaginationOptions } from '../../../../../utils/types/pagination-options';

@Injectable()
export class TenantRelationalRepository implements TenantRepository {
  constructor(
    @InjectRepository(TenantEntity)
    private readonly tenantRepository: Repository<TenantEntity>,
  ) {}

  async create(data: Tenant): Promise<Tenant> {
    const persistenceModel = TenantMapper.toPersistence(data);
    const newEntity = await this.tenantRepository.save(
      this.tenantRepository.create(persistenceModel),
    );
    return TenantMapper.toDomain(newEntity);
  }

  async findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<Tenant[]> {
    const entities = await this.tenantRepository.find({
      skip: (paginationOptions.page - 1) * paginationOptions.limit,
      take: paginationOptions.limit,
    });

    return entities.map((entity) => TenantMapper.toDomain(entity));
  }

  async findById(id: Tenant['id']): Promise<NullableType<Tenant>> {
    const entity = await this.tenantRepository.findOne({
      where: { id },
    });

    return entity ? TenantMapper.toDomain(entity) : null;
  }

  async findByIds(ids: Tenant['id'][]): Promise<Tenant[]> {
    const entities = await this.tenantRepository.find({
      where: { id: In(ids) },
    });

    return entities.map((entity) => TenantMapper.toDomain(entity));
  }

  async update(id: Tenant['id'], payload: Partial<Tenant>): Promise<Tenant> {
    const entity = await this.tenantRepository.findOne({
      where: { id },
    });

    if (!entity) {
      throw new Error('Record not found');
    }

    const updatedEntity = await this.tenantRepository.save(
      this.tenantRepository.create(
        TenantMapper.toPersistence({
          ...TenantMapper.toDomain(entity),
          ...payload,
        }),
      ),
    );

    return TenantMapper.toDomain(updatedEntity);
  }

  async remove(id: Tenant['id']): Promise<void> {
    await this.tenantRepository.delete(id);
  }
}
