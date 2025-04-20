import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { SettingsEntity } from '../entities/settings.entity';
import { NullableType } from '../../../../../utils/types/nullable.type';
import { Settings } from '../../../../domain/settings';
import { SettingsRepository } from '../../settings.repository';
import { SettingsMapper } from '../mappers/settings.mapper';
import { IPaginationOptions } from '../../../../../utils/types/pagination-options';

@Injectable()
export class SettingsRelationalRepository implements SettingsRepository {
  constructor(
    @InjectRepository(SettingsEntity)
    private readonly settingsRepository: Repository<SettingsEntity>,
  ) {}

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
      where: { id },
    });

    return entity ? SettingsMapper.toDomain(entity) : null;
  }

  async findByIds(ids: Settings['id'][]): Promise<Settings[]> {
    const entities = await this.settingsRepository.find({
      where: { id: In(ids) },
    });

    return entities.map((entity) => SettingsMapper.toDomain(entity));
  }

  async update(
    id: Settings['id'],
    payload: Partial<Settings>,
  ): Promise<Settings> {
    const entity = await this.settingsRepository.findOne({
      where: { id },
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
    await this.settingsRepository.delete(id);
  }
}
