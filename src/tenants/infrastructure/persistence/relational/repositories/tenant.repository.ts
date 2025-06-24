import { Inject, Injectable } from '@nestjs/common';
import { Repository, In, DataSource } from 'typeorm';
import { TenantEntity } from '../entities/tenant.entity';
import { NullableType } from '../../../../../utils/types/nullable.type';
import { Tenant } from '../../../../domain/tenant';
import { TenantRepository } from '../../tenant.repository';
import { TenantMapper } from '../mappers/tenant.mapper';
import { IPaginationOptions } from '../../../../../utils/types/pagination-options';
import { REQUEST } from '@nestjs/core';
import { TenantDataSource } from '../../../../../database/tenant-data-source';
import { plainToClass } from 'class-transformer';

@Injectable()
export class TenantRelationalRepository implements TenantRepository {
  private tenantRepository: Repository<TenantEntity>;

  constructor(@Inject(REQUEST) private request: Request) {
    const dataSource: DataSource =
      this.request['tenantDataSource'] || TenantDataSource.getCoreDataSource();
    this.tenantRepository = dataSource.getRepository(TenantEntity);
  }
  async findByTypeId(typeId: string): Promise<NullableType<Tenant>> {
    const entity = await this.tenantRepository.findOne({
      where: {
        type: { id: typeId },
      },
      relations: ['type'],
    });
    return entity ? plainToClass(Tenant, entity) : null;
  }

  async findByIdWithRelations(
    id: Tenant['id'],
    relations: string[],
  ): Promise<NullableType<Tenant>> {
    const entity = await this.tenantRepository.findOne({
      where: { id },
      relations,
    });
    return entity ? plainToClass(Tenant, entity) : null;
  }

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
