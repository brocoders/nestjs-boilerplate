import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { TenantConfigEntity } from '../entities/tenant-config.entity';
import { NullableType } from '../../../../../utils/types/nullable.type';
import { TenantConfig } from '../../../../domain/tenant-config';
import { TenantConfigRepository } from '../../tenant-config.repository';
import { TenantConfigMapper } from '../mappers/tenant-config.mapper';
import { IPaginationOptions } from '../../../../../utils/types/pagination-options';

@Injectable()
export class TenantConfigRelationalRepository
  implements TenantConfigRepository
{
  constructor(
    @InjectRepository(TenantConfigEntity)
    private readonly tenantConfigRepository: Repository<TenantConfigEntity>,
  ) {}

  async create(data: TenantConfig): Promise<TenantConfig> {
    const persistenceModel = TenantConfigMapper.toPersistence(data);
    const newEntity = await this.tenantConfigRepository.save(
      this.tenantConfigRepository.create(persistenceModel),
    );
    return TenantConfigMapper.toDomain(newEntity);
  }

  async findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<TenantConfig[]> {
    const entities = await this.tenantConfigRepository.find({
      skip: (paginationOptions.page - 1) * paginationOptions.limit,
      take: paginationOptions.limit,
    });

    return entities.map((entity) => TenantConfigMapper.toDomain(entity));
  }

  async findById(id: TenantConfig['id']): Promise<NullableType<TenantConfig>> {
    const entity = await this.tenantConfigRepository.findOne({
      where: { id },
    });

    return entity ? TenantConfigMapper.toDomain(entity) : null;
  }

  async findByIds(ids: TenantConfig['id'][]): Promise<TenantConfig[]> {
    const entities = await this.tenantConfigRepository.find({
      where: { id: In(ids) },
    });

    return entities.map((entity) => TenantConfigMapper.toDomain(entity));
  }

  async update(
    id: TenantConfig['id'],
    payload: Partial<TenantConfig>,
  ): Promise<TenantConfig> {
    const entity = await this.tenantConfigRepository.findOne({
      where: { id },
    });

    if (!entity) {
      throw new Error('Record not found');
    }

    const updatedEntity = await this.tenantConfigRepository.save(
      this.tenantConfigRepository.create(
        TenantConfigMapper.toPersistence({
          ...TenantConfigMapper.toDomain(entity),
          ...payload,
        }),
      ),
    );

    return TenantConfigMapper.toDomain(updatedEntity);
  }

  async remove(id: TenantConfig['id']): Promise<void> {
    await this.tenantConfigRepository.delete(id);
  }
}
