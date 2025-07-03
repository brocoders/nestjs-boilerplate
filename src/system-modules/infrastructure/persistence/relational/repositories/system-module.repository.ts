import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { SystemModuleEntity } from '../entities/system-module.entity';
import { NullableType } from '../../../../../utils/types/nullable.type';
import { SystemModule } from '../../../../domain/system-module';
import { SystemModuleRepository } from '../../system-module.repository';
import { SystemModuleMapper } from '../mappers/system-module.mapper';
import { IPaginationOptions } from '../../../../../utils/types/pagination-options';

@Injectable()
export class SystemModuleRelationalRepository
  implements SystemModuleRepository
{
  constructor(
    @InjectRepository(SystemModuleEntity)
    private readonly systemModuleRepository: Repository<SystemModuleEntity>,
  ) {}

  async create(data: SystemModule): Promise<SystemModule> {
    const persistenceModel = SystemModuleMapper.toPersistence(data);
    const newEntity = await this.systemModuleRepository.save(
      this.systemModuleRepository.create(persistenceModel),
    );
    return SystemModuleMapper.toDomain(newEntity);
  }

  async findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<SystemModule[]> {
    const entities = await this.systemModuleRepository.find({
      skip: (paginationOptions.page - 1) * paginationOptions.limit,
      take: paginationOptions.limit,
    });

    return entities.map((entity) => SystemModuleMapper.toDomain(entity));
  }

  async findById(id: SystemModule['id']): Promise<NullableType<SystemModule>> {
    const entity = await this.systemModuleRepository.findOne({
      where: { id },
    });

    return entity ? SystemModuleMapper.toDomain(entity) : null;
  }

  async findByIds(ids: SystemModule['id'][]): Promise<SystemModule[]> {
    const entities = await this.systemModuleRepository.find({
      where: { id: In(ids) },
    });

    return entities.map((entity) => SystemModuleMapper.toDomain(entity));
  }

  async update(
    id: SystemModule['id'],
    payload: Partial<SystemModule>,
  ): Promise<SystemModule> {
    const entity = await this.systemModuleRepository.findOne({
      where: { id },
    });

    if (!entity) {
      throw new Error('Record not found');
    }

    const updatedEntity = await this.systemModuleRepository.save(
      this.systemModuleRepository.create(
        SystemModuleMapper.toPersistence({
          ...SystemModuleMapper.toDomain(entity),
          ...payload,
        }),
      ),
    );

    return SystemModuleMapper.toDomain(updatedEntity);
  }

  async remove(id: SystemModule['id']): Promise<void> {
    await this.systemModuleRepository.delete(id);
  }
}
