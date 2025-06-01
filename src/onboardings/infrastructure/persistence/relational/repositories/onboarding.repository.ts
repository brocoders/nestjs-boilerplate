import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { OnboardingEntity } from '../entities/onboarding.entity';
import { NullableType } from '../../../../../utils/types/nullable.type';
import { Onboarding } from '../../../../domain/onboarding';
import { OnboardingRepository } from '../../onboarding.repository';
import { OnboardingMapper } from '../mappers/onboarding.mapper';
import { IPaginationOptions } from '../../../../../utils/types/pagination-options';

@Injectable()
export class OnboardingRelationalRepository implements OnboardingRepository {
  constructor(
    @InjectRepository(OnboardingEntity)
    private readonly onboardingRepository: Repository<OnboardingEntity>,
  ) {}

  async create(data: Onboarding): Promise<Onboarding> {
    const persistenceModel = OnboardingMapper.toPersistence(data);
    const newEntity = await this.onboardingRepository.save(
      this.onboardingRepository.create(persistenceModel),
    );
    return OnboardingMapper.toDomain(newEntity);
  }

  async findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<Onboarding[]> {
    const entities = await this.onboardingRepository.find({
      skip: (paginationOptions.page - 1) * paginationOptions.limit,
      take: paginationOptions.limit,
    });

    return entities.map((entity) => OnboardingMapper.toDomain(entity));
  }

  async findById(id: Onboarding['id']): Promise<NullableType<Onboarding>> {
    const entity = await this.onboardingRepository.findOne({
      where: { id },
    });

    return entity ? OnboardingMapper.toDomain(entity) : null;
  }

  async findByIds(ids: Onboarding['id'][]): Promise<Onboarding[]> {
    const entities = await this.onboardingRepository.find({
      where: { id: In(ids) },
    });

    return entities.map((entity) => OnboardingMapper.toDomain(entity));
  }

  async update(
    id: Onboarding['id'],
    payload: Partial<Onboarding>,
  ): Promise<Onboarding> {
    const entity = await this.onboardingRepository.findOne({
      where: { id },
    });

    if (!entity) {
      throw new Error('Record not found');
    }

    const updatedEntity = await this.onboardingRepository.save(
      this.onboardingRepository.create(
        OnboardingMapper.toPersistence({
          ...OnboardingMapper.toDomain(entity),
          ...payload,
        }),
      ),
    );

    return OnboardingMapper.toDomain(updatedEntity);
  }

  async remove(id: Onboarding['id']): Promise<void> {
    await this.onboardingRepository.delete(id);
  }

  async findOne(
    where: import('typeorm').FindOptionsWhere<Onboarding>,
  ): Promise<NullableType<Onboarding>> {
    // Map the domain-level where filter to persistence-level where filter
    const persistenceWhere = OnboardingMapper.toPersistenceWhere
      ? OnboardingMapper.toPersistenceWhere(where)
      : (where as unknown as import('typeorm').FindOptionsWhere<OnboardingEntity>);
    const entity = await this.onboardingRepository.findOne({
      where: persistenceWhere,
    });
    return entity ? OnboardingMapper.toDomain(entity) : null;
  }

  async find(): Promise<Onboarding[]> {
    const entities = await this.onboardingRepository.find();
    return entities.map((entity) => OnboardingMapper.toDomain(entity));
  }
}
