import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { RegionEntity } from '../entities/region.entity';
import { NullableType } from '../../../../../utils/types/nullable.type';
import { Region } from '../../../../domain/region';
import { RegionRepository } from '../../region.repository';
import { RegionMapper } from '../mappers/region.mapper';
import { IPaginationOptions } from '../../../../../utils/types/pagination-options';

@Injectable()
export class RegionRelationalRepository implements RegionRepository {
  constructor(
    @InjectRepository(RegionEntity)
    private readonly regionRepository: Repository<RegionEntity>,
  ) {}

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
    });

    return entities.map((entity) => RegionMapper.toDomain(entity));
  }

  async findById(id: Region['id']): Promise<NullableType<Region>> {
    const entity = await this.regionRepository.findOne({
      where: { id },
    });

    return entity ? RegionMapper.toDomain(entity) : null;
  }

  async findByIds(ids: Region['id'][]): Promise<Region[]> {
    const entities = await this.regionRepository.find({
      where: { id: In(ids) },
    });

    return entities.map((entity) => RegionMapper.toDomain(entity));
  }

  async update(id: Region['id'], payload: Partial<Region>): Promise<Region> {
    const entity = await this.regionRepository.findOne({
      where: { id },
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
    await this.regionRepository.delete(id);
  }
}
