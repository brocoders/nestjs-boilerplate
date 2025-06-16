import { Inject, Injectable } from '@nestjs/common';
import { Repository, In, DataSource, FindOptionsWhere } from 'typeorm';
import { ResidenceEntity } from '../entities/residence.entity';
import { NullableType } from '../../../../../utils/types/nullable.type';
import { Residence } from '../../../../domain/residence';
import { ResidenceRepository } from '../../residence.repository';
import { ResidenceMapper } from '../mappers/residence.mapper';
import { IPaginationOptions } from '../../../../../utils/types/pagination-options';
import { REQUEST } from '@nestjs/core';
import { TenantDataSource } from '../../../../../database/tenant-data-source';

@Injectable()
export class ResidenceRelationalRepository implements ResidenceRepository {
  private residenceRepository: Repository<ResidenceEntity>;

  constructor(@Inject(REQUEST) private request: Request) {
    const dataSource: DataSource =
      this.request['tenantDataSource'] || TenantDataSource.getCoreDataSource();
    this.residenceRepository = dataSource.getRepository(ResidenceEntity);
  }

  private applyTenantFilter(
    where: FindOptionsWhere<ResidenceEntity> = {},
  ): FindOptionsWhere<ResidenceEntity> {
    const tenantId = this.request['tenantId'];

    if (tenantId) {
      return {
        ...where,
        tenant: { id: tenantId },
      };
    }

    return where;
  }

  async create(data: Residence): Promise<Residence> {
    const persistenceModel = ResidenceMapper.toPersistence(data);
    const newEntity = await this.residenceRepository.save(
      this.residenceRepository.create(persistenceModel),
    );
    return ResidenceMapper.toDomain(newEntity);
  }

  async findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<Residence[]> {
    const entities = await this.residenceRepository.find({
      skip: (paginationOptions.page - 1) * paginationOptions.limit,
      take: paginationOptions.limit,
      where: this.applyTenantFilter(),
    });

    return entities.map((entity) => ResidenceMapper.toDomain(entity));
  }

  async findById(id: Residence['id']): Promise<NullableType<Residence>> {
    const entity = await this.residenceRepository.findOne({
      where: this.applyTenantFilter({ id }),
    });

    return entity ? ResidenceMapper.toDomain(entity) : null;
  }

  async findByIds(ids: Residence['id'][]): Promise<Residence[]> {
    const entities = await this.residenceRepository.find({
      where: this.applyTenantFilter({ id: In(ids) }),
    });

    return entities.map((entity) => ResidenceMapper.toDomain(entity));
  }

  async update(
    id: Residence['id'],
    payload: Partial<Residence>,
  ): Promise<Residence> {
    const entity = await this.residenceRepository.findOne({
      where: this.applyTenantFilter({ id }),
    });

    if (!entity) {
      throw new Error('Record not found');
    }

    const updatedEntity = await this.residenceRepository.save(
      this.residenceRepository.create(
        ResidenceMapper.toPersistence({
          ...ResidenceMapper.toDomain(entity),
          ...payload,
        }),
      ),
    );

    return ResidenceMapper.toDomain(updatedEntity);
  }

  async remove(id: Residence['id']): Promise<void> {
    const entity = await this.residenceRepository.findOne({
      where: this.applyTenantFilter({ id }),
    });

    if (!entity) {
      throw new Error('Record not found or access denied');
    }

    await this.residenceRepository.softDelete(entity.id);
  }
}
