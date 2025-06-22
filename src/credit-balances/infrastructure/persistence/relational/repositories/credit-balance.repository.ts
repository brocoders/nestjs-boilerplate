import { Inject, Injectable } from '@nestjs/common';
import { Repository, In, DataSource, FindOptionsWhere } from 'typeorm';
import { CreditBalanceEntity } from '../entities/credit-balance.entity';
import { NullableType } from '../../../../../utils/types/nullable.type';
import { CreditBalance } from '../../../../domain/credit-balance';
import { CreditBalanceRepository } from '../../credit-balance.repository';
import { CreditBalanceMapper } from '../mappers/credit-balance.mapper';
import { IPaginationOptions } from '../../../../../utils/types/pagination-options';
import { REQUEST } from '@nestjs/core';
import { TenantDataSource } from '../../../../../database/tenant-data-source';

@Injectable()
export class CreditBalanceRelationalRepository
  implements CreditBalanceRepository
{
  private creditBalanceRepository: Repository<CreditBalanceEntity>;

  constructor(@Inject(REQUEST) private request: Request) {
    const dataSource: DataSource =
      this.request['tenantDataSource'] || TenantDataSource.getCoreDataSource();
    this.creditBalanceRepository =
      dataSource.getRepository(CreditBalanceEntity);
  }

  private applyTenantFilter(
    where: FindOptionsWhere<CreditBalanceEntity> = {},
  ): FindOptionsWhere<CreditBalanceEntity> {
    const tenantId = this.request['tenantId'];

    if (tenantId) {
      return {
        ...where,
        tenant: { id: tenantId },
      };
    }

    return where;
  }

  async create(data: CreditBalance): Promise<CreditBalance> {
    const persistenceModel = CreditBalanceMapper.toPersistence(data);
    const newEntity = await this.creditBalanceRepository.save(
      this.creditBalanceRepository.create(persistenceModel),
    );
    return CreditBalanceMapper.toDomain(newEntity);
  }

  async findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<CreditBalance[]> {
    const entities = await this.creditBalanceRepository.find({
      skip: (paginationOptions.page - 1) * paginationOptions.limit,
      take: paginationOptions.limit,
      where: this.applyTenantFilter(),
    });

    return entities.map((entity) => CreditBalanceMapper.toDomain(entity));
  }

  async findById(
    id: CreditBalance['id'],
  ): Promise<NullableType<CreditBalance>> {
    const entity = await this.creditBalanceRepository.findOne({
      where: this.applyTenantFilter({ id }),
    });

    return entity ? CreditBalanceMapper.toDomain(entity) : null;
  }

  async findByIds(ids: CreditBalance['id'][]): Promise<CreditBalance[]> {
    const entities = await this.creditBalanceRepository.find({
      where: this.applyTenantFilter({ id: In(ids) }),
    });

    return entities.map((entity) => CreditBalanceMapper.toDomain(entity));
  }

  async update(
    id: CreditBalance['id'],
    payload: Partial<CreditBalance>,
  ): Promise<CreditBalance> {
    const entity = await this.creditBalanceRepository.findOne({
      where: this.applyTenantFilter({ id }),
    });

    if (!entity) {
      throw new Error('Record not found');
    }

    const updatedEntity = await this.creditBalanceRepository.save(
      this.creditBalanceRepository.create(
        CreditBalanceMapper.toPersistence({
          ...CreditBalanceMapper.toDomain(entity),
          ...payload,
        }),
      ),
    );

    return CreditBalanceMapper.toDomain(updatedEntity);
  }

  async remove(id: CreditBalance['id']): Promise<void> {
    const entity = await this.creditBalanceRepository.findOne({
      where: this.applyTenantFilter({ id }),
    });

    if (!entity) {
      throw new Error('Record not found or access denied');
    }

    await this.creditBalanceRepository.softDelete(entity.id);
  }
}
