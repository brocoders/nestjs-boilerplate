import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { TenantTypeEntity } from '../entities/tenant-type.entity';
import { NullableType } from '../../../../../utils/types/nullable.type';
import { TenantType } from '../../../../domain/tenant-type';
import { TenantTypeRepository } from '../../tenant-type.repository';
import { TenantTypeMapper } from '../mappers/tenant-type.mapper';
import { IPaginationOptions } from '../../../../../utils/types/pagination-options';

@Injectable()
export class TenantTypeRelationalRepository implements TenantTypeRepository {
  constructor(
    @InjectRepository(TenantTypeEntity)
    private readonly tenantTypeRepository: Repository<TenantTypeEntity>,
  ) {}

  async create(data: TenantType): Promise<TenantType> {
    const persistenceModel = TenantTypeMapper.toPersistence(data);
    const newEntity = await this.tenantTypeRepository.save(
      this.tenantTypeRepository.create(persistenceModel),
    );
    return TenantTypeMapper.toDomain(newEntity);
  }

  async findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<TenantType[]> {
    const entities = await this.tenantTypeRepository.find({
      skip: (paginationOptions.page - 1) * paginationOptions.limit,
      take: paginationOptions.limit,
    });

    return entities.map((entity) => TenantTypeMapper.toDomain(entity));
  }

  async findById(id: TenantType['id']): Promise<NullableType<TenantType>> {
    const entity = await this.tenantTypeRepository.findOne({
      where: { id },
    });

    return entity ? TenantTypeMapper.toDomain(entity) : null;
  }

  async findByIds(ids: TenantType['id'][]): Promise<TenantType[]> {
    const entities = await this.tenantTypeRepository.find({
      where: { id: In(ids) },
    });

    return entities.map((entity) => TenantTypeMapper.toDomain(entity));
  }

  async update(
    id: TenantType['id'],
    payload: Partial<TenantType>,
  ): Promise<TenantType> {
    const entity = await this.tenantTypeRepository.findOne({
      where: { id },
    });

    if (!entity) {
      throw new Error('Record not found');
    }

    const updatedEntity = await this.tenantTypeRepository.save(
      this.tenantTypeRepository.create(
        TenantTypeMapper.toPersistence({
          ...TenantTypeMapper.toDomain(entity),
          ...payload,
        }),
      ),
    );

    return TenantTypeMapper.toDomain(updatedEntity);
  }

  async remove(id: TenantType['id']): Promise<void> {
    await this.tenantTypeRepository.delete(id);
  }
}
