import { Inject, Injectable } from '@nestjs/common';
import { Repository, In, DataSource, FindOptionsWhere } from 'typeorm';
import { RegionEntity } from '../entities/region.entity';
import { NullableType } from '../../../../../utils/types/nullable.type';
import { Region } from '../../../../domain/region';
import { RegionRepository } from '../../region.repository';
import { RegionMapper } from '../mappers/region.mapper';
import { IPaginationOptions } from '../../../../../utils/types/pagination-options';
import { REQUEST } from '@nestjs/core';
import { TenantDataSource } from '../../../../../database/tenant-data-source';

@Injectable()
export class RegionRelationalRepository implements RegionRepository {
  private regionRepository: Repository<RegionEntity>;

  constructor(@Inject(REQUEST) private request: Request) {
    const dataSource: DataSource =
      this.request['tenantDataSource'] || TenantDataSource.getCoreDataSource();
    this.regionRepository = dataSource.getRepository(RegionEntity);
  }

  private applyTenantFilter(
    where: FindOptionsWhere<RegionEntity> = {},
  ): FindOptionsWhere<RegionEntity> {
    const tenantId = this.request['tenantId'];

    if (tenantId) {
      return {
        ...where,
        tenant: { id: tenantId },
      };
    }

    return where;
  }

  async create(data: Region): Promise<Region> {
    const persistenceModel = RegionMapper.toPersistence(data);
    const newEntity = await this.regionRepository.save(
      this.regionRepository.create(persistenceModel),
    );
    return RegionMapper.toDomain(newEntity);
  }

  async findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<Region[]> {
    const entities = await this.regionRepository.find({
      skip: (paginationOptions.page - 1) * paginationOptions.limit,
      take: paginationOptions.limit,
      where: this.applyTenantFilter(),
    });

    return entities.map((entity) => RegionMapper.toDomain(entity));
  }

  async findById(id: Region['id']): Promise<NullableType<Region>> {
    const entity = await this.regionRepository.findOne({
      where: this.applyTenantFilter({ id }),
    });

    return entity ? RegionMapper.toDomain(entity) : null;
  }

  async findByIds(ids: Region['id'][]): Promise<Region[]> {
    const entities = await this.regionRepository.find({
      where: this.applyTenantFilter({ id: In(ids) }),
    });

    return entities.map((entity) => RegionMapper.toDomain(entity));
  }

  async update(id: Region['id'], payload: Partial<Region>): Promise<Region> {
    const entity = await this.regionRepository.findOne({
      where: this.applyTenantFilter({ id }),
    });

    if (!entity) {
      throw new Error('Record not found');
    }

    const updatedEntity = await this.regionRepository.save(
      this.regionRepository.create(
        RegionMapper.toPersistence({
          ...RegionMapper.toDomain(entity),
          ...payload,
        }),
      ),
    );

    return RegionMapper.toDomain(updatedEntity);
  }

  async remove(id: Region['id']): Promise<void> {
    const entity = await this.regionRepository.findOne({
      where: this.applyTenantFilter({ id }),
    });

    if (!entity) {
      throw new Error('Record not found or access denied');
    }

    await this.regionRepository.softDelete(entity.id);
  }
}
