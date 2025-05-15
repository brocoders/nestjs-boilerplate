import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { ResidenceEntity } from '../entities/residence.entity';
import { NullableType } from '../../../../../utils/types/nullable.type';
import { Residence } from '../../../../domain/residence';
import { ResidenceRepository } from '../../residence.repository';
import { ResidenceMapper } from '../mappers/residence.mapper';
import { IPaginationOptions } from '../../../../../utils/types/pagination-options';

@Injectable()
export class ResidenceRelationalRepository implements ResidenceRepository {
  constructor(
    @InjectRepository(ResidenceEntity)
    private readonly residenceRepository: Repository<ResidenceEntity>,
  ) {}

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
    });

    return entities.map((entity) => ResidenceMapper.toDomain(entity));
  }

  async findById(id: Residence['id']): Promise<NullableType<Residence>> {
    const entity = await this.residenceRepository.findOne({
      where: { id },
    });

    return entity ? ResidenceMapper.toDomain(entity) : null;
  }

  async findByIds(ids: Residence['id'][]): Promise<Residence[]> {
    const entities = await this.residenceRepository.find({
      where: { id: In(ids) },
    });

    return entities.map((entity) => ResidenceMapper.toDomain(entity));
  }

  async update(
    id: Residence['id'],
    payload: Partial<Residence>,
  ): Promise<Residence> {
    const entity = await this.residenceRepository.findOne({
      where: { id },
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
    await this.residenceRepository.delete(id);
  }
}
