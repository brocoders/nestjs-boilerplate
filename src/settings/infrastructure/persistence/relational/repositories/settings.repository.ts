import { Inject, Injectable } from '@nestjs/common';
import { Repository, In, DataSource, FindOptionsWhere } from 'typeorm';
import { SettingsEntity } from '../entities/settings.entity';
import { NullableType } from '../../../../../utils/types/nullable.type';
import { Settings } from '../../../../domain/settings';
import { SettingsRepository } from '../../settings.repository';
import { SettingsMapper } from '../mappers/settings.mapper';
import { IPaginationOptions } from '../../../../../utils/types/pagination-options';
import { REQUEST } from '@nestjs/core';
import { TenantDataSource } from '../../../../../database/tenant-data-source';

@Injectable()
export class SettingsRelationalRepository implements SettingsRepository {
  private settingsRepository: Repository<SettingsEntity>;

  constructor(@Inject(REQUEST) private request: Request) {
    const dataSource: DataSource =
      this.request['tenantDataSource'] || TenantDataSource.getCoreDataSource();
    this.settingsRepository = dataSource.getRepository(SettingsEntity);
  }

  private applyTenantFilter(
    where: FindOptionsWhere<SettingsEntity> = {},
  ): FindOptionsWhere<SettingsEntity> {
    const tenantId = this.request['tenantId'];

    if (tenantId) {
      return {
        ...where,
        tenant: { id: tenantId },
      };
    }

    return where;
  }

  async create(data: Settings): Promise<Settings> {
    const persistenceModel = SettingsMapper.toPersistence(data);
    const newEntity = await this.settingsRepository.save(
      this.settingsRepository.create(persistenceModel),
    );
    return SettingsMapper.toDomain(newEntity);
  }

  async findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<Settings[]> {
    const entities = await this.settingsRepository.find({
      skip: (paginationOptions.page - 1) * paginationOptions.limit,
      take: paginationOptions.limit,
    });

    return entities.map((entity) => SettingsMapper.toDomain(entity));
  }

  async findById(id: Settings['id']): Promise<NullableType<Settings>> {
    const entity = await this.settingsRepository.findOne({
      where: this.applyTenantFilter({ id }),
    });

    return entity ? SettingsMapper.toDomain(entity) : null;
  }

  async findByIds(ids: Settings['id'][]): Promise<Settings[]> {
    const entities = await this.settingsRepository.find({
      where: this.applyTenantFilter({ id: In(ids) }),
    });

    return entities.map((entity) => SettingsMapper.toDomain(entity));
  }

  async update(
    id: Settings['id'],
    payload: Partial<Settings>,
  ): Promise<Settings> {
    const entity = await this.settingsRepository.findOne({
      where: this.applyTenantFilter({ id }),
    });

    if (!entity) {
      throw new Error('Record not found');
    }

    const updatedEntity = await this.settingsRepository.save(
      this.settingsRepository.create(
        SettingsMapper.toPersistence({
          ...SettingsMapper.toDomain(entity),
          ...payload,
        }),
      ),
    );

    return SettingsMapper.toDomain(updatedEntity);
  }

  async remove(id: Settings['id']): Promise<void> {
    const entity = await this.settingsRepository.findOne({
      where: this.applyTenantFilter({ id }),
    });

    if (!entity) {
      throw new Error('Record not found or access denied');
    }

    await this.settingsRepository.softDelete(entity.id);
  }
}
