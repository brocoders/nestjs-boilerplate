import { Inject, Injectable } from '@nestjs/common';
import { Repository, In, DataSource, FindOptionsWhere } from 'typeorm';
import { KycDetailsEntity } from '../entities/kyc-details.entity';
import { NullableType } from '../../../../../utils/types/nullable.type';
import { KycDetails } from '../../../../domain/kyc-details';
import { KycDetailsRepository } from '../../kyc-details.repository';
import { KycDetailsMapper } from '../mappers/kyc-details.mapper';
import { IPaginationOptions } from '../../../../../utils/types/pagination-options';
import { REQUEST } from '@nestjs/core';
import { TenantDataSource } from '../../../../../database/tenant-data-source';

@Injectable()
export class KycDetailsRelationalRepository implements KycDetailsRepository {
  private kycDetailsRepository: Repository<KycDetailsEntity>;

  constructor(@Inject(REQUEST) private request: Request) {
    const dataSource: DataSource =
      this.request['tenantDataSource'] || TenantDataSource.getCoreDataSource();
    this.kycDetailsRepository = dataSource.getRepository(KycDetailsEntity);
  }

  private applyTenantFilter(
    where: FindOptionsWhere<KycDetailsEntity> = {},
  ): FindOptionsWhere<KycDetailsEntity> {
    const tenantId = this.request['tenantId'];

    if (tenantId) {
      return {
        ...where,
        tenant: { id: tenantId },
      };
    }

    return where;
  }

  async create(data: KycDetails): Promise<KycDetails> {
    const persistenceModel = KycDetailsMapper.toPersistence(data);
    const newEntity = await this.kycDetailsRepository.save(
      this.kycDetailsRepository.create(persistenceModel),
    );
    return KycDetailsMapper.toDomain(newEntity);
  }

  async findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<KycDetails[]> {
    const entities = await this.kycDetailsRepository.find({
      skip: (paginationOptions.page - 1) * paginationOptions.limit,
      take: paginationOptions.limit,
      where: this.applyTenantFilter(),
    });

    return entities.map((entity) => KycDetailsMapper.toDomain(entity));
  }

  async findById(id: KycDetails['id']): Promise<NullableType<KycDetails>> {
    const entity = await this.kycDetailsRepository.findOne({
      where: this.applyTenantFilter({ id }),
    });

    return entity ? KycDetailsMapper.toDomain(entity) : null;
  }

  async findByIds(ids: KycDetails['id'][]): Promise<KycDetails[]> {
    const entities = await this.kycDetailsRepository.find({
      where: this.applyTenantFilter({ id: In(ids) }),
    });

    return entities.map((entity) => KycDetailsMapper.toDomain(entity));
  }

  async update(
    id: KycDetails['id'],
    payload: Partial<KycDetails>,
  ): Promise<KycDetails> {
    const entity = await this.kycDetailsRepository.findOne({
      where: this.applyTenantFilter({ id }),
    });

    if (!entity) {
      throw new Error('Record not found');
    }

    const updatedEntity = await this.kycDetailsRepository.save(
      this.kycDetailsRepository.create(
        KycDetailsMapper.toPersistence({
          ...KycDetailsMapper.toDomain(entity),
          ...payload,
        }),
      ),
    );

    return KycDetailsMapper.toDomain(updatedEntity);
  }
  async remove(id: KycDetails['id']): Promise<void> {
    const entity = await this.kycDetailsRepository.findOne({
      where: this.applyTenantFilter({ id }),
    });

    if (!entity) {
      throw new Error('Record not found or access denied');
    }

    await this.kycDetailsRepository.softDelete(entity.id);
  }
}
