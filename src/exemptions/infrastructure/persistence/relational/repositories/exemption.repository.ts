import { Inject, Injectable } from '@nestjs/common';
import { Repository, In, DataSource, FindOptionsWhere } from 'typeorm';
import { ExemptionEntity } from '../entities/exemption.entity';
import { NullableType } from '../../../../../utils/types/nullable.type';
import { Exemption } from '../../../../domain/exemption';
import { ExemptionRepository } from '../../exemption.repository';
import { ExemptionMapper } from '../mappers/exemption.mapper';
import { IPaginationOptions } from '../../../../../utils/types/pagination-options';
import { REQUEST } from '@nestjs/core';
import { TenantDataSource } from '../../../../../database/tenant-data-source';

@Injectable()
export class ExemptionRelationalRepository implements ExemptionRepository {
  private exemptionRepository: Repository<ExemptionEntity>;

  constructor(@Inject(REQUEST) private request: Request) {
    const dataSource: DataSource =
      this.request['tenantDataSource'] || TenantDataSource.getCoreDataSource();
    this.exemptionRepository = dataSource.getRepository(ExemptionEntity);
  }

  private applyTenantFilter(
    where: FindOptionsWhere<ExemptionEntity> = {},
  ): FindOptionsWhere<ExemptionEntity> {
    const tenantId = this.request['tenantId'];

    if (tenantId) {
      return {
        ...where,
        tenant: { id: tenantId },
      };
    }

    return where;
  }

  async create(data: Exemption): Promise<Exemption> {
    const persistenceModel = ExemptionMapper.toPersistence(data);
    const newEntity = await this.exemptionRepository.save(
      this.exemptionRepository.create(persistenceModel),
    );
    return ExemptionMapper.toDomain(newEntity);
  }

  async findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<Exemption[]> {
    const entities = await this.exemptionRepository.find({
      skip: (paginationOptions.page - 1) * paginationOptions.limit,
      take: paginationOptions.limit,
    });

    return entities.map((entity) => ExemptionMapper.toDomain(entity));
  }

  async findById(id: Exemption['id']): Promise<NullableType<Exemption>> {
    const entity = await this.exemptionRepository.findOne({
      where: this.applyTenantFilter({ id }),
    });

    return entity ? ExemptionMapper.toDomain(entity) : null;
  }

  async findByIds(ids: Exemption['id'][]): Promise<Exemption[]> {
    const entities = await this.exemptionRepository.find({
      where: this.applyTenantFilter({ id: In(ids) }),
    });

    return entities.map((entity) => ExemptionMapper.toDomain(entity));
  }

  async update(
    id: Exemption['id'],
    payload: Partial<Exemption>,
  ): Promise<Exemption> {
    const entity = await this.exemptionRepository.findOne({
      where: this.applyTenantFilter({ id }),
    });

    if (!entity) {
      throw new Error('Record not found');
    }

    const updatedEntity = await this.exemptionRepository.save(
      this.exemptionRepository.create(
        ExemptionMapper.toPersistence({
          ...ExemptionMapper.toDomain(entity),
          ...payload,
        }),
      ),
    );

    return ExemptionMapper.toDomain(updatedEntity);
  }

  async remove(id: Exemption['id']): Promise<void> {
    const entity = await this.exemptionRepository.findOne({
      where: this.applyTenantFilter({ id }),
    });

    if (!entity) {
      throw new Error('Record not found or access denied');
    }

    await this.exemptionRepository.softDelete(entity.id);
  }
}
