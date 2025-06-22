import { Inject, Injectable } from '@nestjs/common';
import { Repository, In, DataSource, FindOptionsWhere } from 'typeorm';
import { OnboardingEntity } from '../entities/onboarding.entity';
import { NullableType } from '../../../../../utils/types/nullable.type';
import { Onboarding } from '../../../../domain/onboarding';
import { OnboardingRepository } from '../../onboarding.repository';
import { OnboardingMapper } from '../mappers/onboarding.mapper';
import { IPaginationOptions } from '../../../../../utils/types/pagination-options';
import { REQUEST } from '@nestjs/core';
import { TenantDataSource } from '../../../../../database/tenant-data-source';

@Injectable()
export class OnboardingRelationalRepository implements OnboardingRepository {
  private onboardingRepository: Repository<OnboardingEntity>;

  constructor(@Inject(REQUEST) private request: Request) {
    const dataSource: DataSource =
      this.request['tenantDataSource'] || TenantDataSource.getCoreDataSource();
    this.onboardingRepository = dataSource.getRepository(OnboardingEntity);
  }

  private applyTenantFilter(
    where: FindOptionsWhere<OnboardingEntity> = {},
  ): FindOptionsWhere<OnboardingEntity> {
    const tenantId = this.request['tenantId'];

    if (tenantId) {
      return {
        ...where,
        //tenant: { id: tenantId },
      };
    }

    return where;
  }

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
      where: this.applyTenantFilter(),
    });

    return entities.map((entity) => OnboardingMapper.toDomain(entity));
  }

  async findById(id: Onboarding['id']): Promise<NullableType<Onboarding>> {
    const entity = await this.onboardingRepository.findOne({
      where: this.applyTenantFilter({ id }),
    });

    return entity ? OnboardingMapper.toDomain(entity) : null;
  }

  async findByIds(ids: Onboarding['id'][]): Promise<Onboarding[]> {
    const entities = await this.onboardingRepository.find({
      where: this.applyTenantFilter({ id: In(ids) }),
    });

    return entities.map((entity) => OnboardingMapper.toDomain(entity));
  }

  async update(
    id: Onboarding['id'],
    payload: Partial<Onboarding>,
  ): Promise<Onboarding> {
    const entity = await this.onboardingRepository.findOne({
      where: this.applyTenantFilter({ id }),
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
    const entity = await this.onboardingRepository.findOne({
      where: this.applyTenantFilter({ id }),
    });

    if (!entity) {
      throw new Error('Record not found or access denied');
    }

    await this.onboardingRepository.softDelete(entity.id);
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
