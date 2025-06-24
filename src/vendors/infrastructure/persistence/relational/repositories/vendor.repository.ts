import { Inject, Injectable } from '@nestjs/common';
import { Repository, In, DataSource, FindOptionsWhere } from 'typeorm';
import { VendorEntity } from '../entities/vendor.entity';
import { NullableType } from '../../../../../utils/types/nullable.type';
import { Vendor } from '../../../../domain/vendor';
import { VendorRepository } from '../../vendor.repository';
import { VendorMapper } from '../mappers/vendor.mapper';
import { IPaginationOptions } from '../../../../../utils/types/pagination-options';
import { REQUEST } from '@nestjs/core';
import { TenantDataSource } from '../../../../../database/tenant-data-source';

@Injectable()
export class VendorRelationalRepository implements VendorRepository {
  private vendorRepository: Repository<VendorEntity>;

  constructor(@Inject(REQUEST) private request: Request) {
    const dataSource: DataSource =
      this.request['tenantDataSource'] || TenantDataSource.getCoreDataSource();
    this.vendorRepository = dataSource.getRepository(VendorEntity);
  }

  private applyTenantFilter(
    where: FindOptionsWhere<VendorEntity> = {},
  ): FindOptionsWhere<VendorEntity> {
    const tenantId = this.request['tenantId'];

    if (tenantId) {
      return {
        ...where,
        tenant: { id: tenantId },
      };
    }

    return where;
  }

  async create(data: Vendor): Promise<Vendor> {
    const persistenceModel = VendorMapper.toPersistence(data);
    const newEntity = await this.vendorRepository.save(
      this.vendorRepository.create(persistenceModel),
    );
    return VendorMapper.toDomain(newEntity);
  }

  async findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<Vendor[]> {
    const entities = await this.vendorRepository.find({
      skip: (paginationOptions.page - 1) * paginationOptions.limit,
      take: paginationOptions.limit,
    });

    return entities.map((entity) => VendorMapper.toDomain(entity));
  }

  async findById(id: Vendor['id']): Promise<NullableType<Vendor>> {
    const entity = await this.vendorRepository.findOne({
      where: this.applyTenantFilter({ id }),
    });

    return entity ? VendorMapper.toDomain(entity) : null;
  }

  async findByIds(ids: Vendor['id'][]): Promise<Vendor[]> {
    const entities = await this.vendorRepository.find({
      where: this.applyTenantFilter({ id: In(ids) }),
    });

    return entities.map((entity) => VendorMapper.toDomain(entity));
  }

  async update(id: Vendor['id'], payload: Partial<Vendor>): Promise<Vendor> {
    const entity = await this.vendorRepository.findOne({
      where: this.applyTenantFilter({ id }),
    });

    if (!entity) {
      throw new Error('Record not found');
    }

    const updatedEntity = await this.vendorRepository.save(
      this.vendorRepository.create(
        VendorMapper.toPersistence({
          ...VendorMapper.toDomain(entity),
          ...payload,
        }),
      ),
    );

    return VendorMapper.toDomain(updatedEntity);
  }

  async remove(id: Vendor['id']): Promise<void> {
    const entity = await this.vendorRepository.findOne({
      where: this.applyTenantFilter({ id }),
    });

    if (!entity) {
      throw new Error('Record not found or access denied');
    }

    await this.vendorRepository.softDelete(entity.id);
  }
}
