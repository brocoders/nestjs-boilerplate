import { Inject, Injectable } from '@nestjs/common';
import { Repository, In, DataSource, FindOptionsWhere } from 'typeorm';
import { VendorBillEntity } from '../entities/vendor-bill.entity';
import { NullableType } from '../../../../../utils/types/nullable.type';
import { VendorBill } from '../../../../domain/vendor-bill';
import { VendorBillRepository } from '../../vendor-bill.repository';
import { VendorBillMapper } from '../mappers/vendor-bill.mapper';
import { IPaginationOptions } from '../../../../../utils/types/pagination-options';
import { REQUEST } from '@nestjs/core';
import { TenantDataSource } from '../../../../../database/tenant-data-source';

@Injectable()
export class VendorBillRelationalRepository implements VendorBillRepository {
  private vendorBillRepository: Repository<VendorBillEntity>;

  constructor(@Inject(REQUEST) private request: Request) {
    const dataSource: DataSource =
      this.request['tenantDataSource'] || TenantDataSource.getCoreDataSource();
    this.vendorBillRepository = dataSource.getRepository(VendorBillEntity);
  }

  private applyTenantFilter(
    where: FindOptionsWhere<VendorBillEntity> = {},
  ): FindOptionsWhere<VendorBillEntity> {
    const tenantId = this.request['tenantId'];

    if (tenantId) {
      return {
        ...where,
        tenant: { id: tenantId },
      };
    }

    return where;
  }

  async create(data: VendorBill): Promise<VendorBill> {
    const persistenceModel = VendorBillMapper.toPersistence(data);
    const newEntity = await this.vendorBillRepository.save(
      this.vendorBillRepository.create(persistenceModel),
    );
    return VendorBillMapper.toDomain(newEntity);
  }

  async findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<VendorBill[]> {
    const entities = await this.vendorBillRepository.find({
      skip: (paginationOptions.page - 1) * paginationOptions.limit,
      take: paginationOptions.limit,
    });

    return entities.map((entity) => VendorBillMapper.toDomain(entity));
  }

  async findById(id: VendorBill['id']): Promise<NullableType<VendorBill>> {
    const entity = await this.vendorBillRepository.findOne({
      where: this.applyTenantFilter({ id }),
    });

    return entity ? VendorBillMapper.toDomain(entity) : null;
  }

  async findByIds(ids: VendorBill['id'][]): Promise<VendorBill[]> {
    const entities = await this.vendorBillRepository.find({
      where: this.applyTenantFilter({ id: In(ids) }),
    });

    return entities.map((entity) => VendorBillMapper.toDomain(entity));
  }

  async update(
    id: VendorBill['id'],
    payload: Partial<VendorBill>,
  ): Promise<VendorBill> {
    const entity = await this.vendorBillRepository.findOne({
      where: this.applyTenantFilter({ id }),
    });

    if (!entity) {
      throw new Error('Record not found');
    }

    const updatedEntity = await this.vendorBillRepository.save(
      this.vendorBillRepository.create(
        VendorBillMapper.toPersistence({
          ...VendorBillMapper.toDomain(entity),
          ...payload,
        }),
      ),
    );

    return VendorBillMapper.toDomain(updatedEntity);
  }

  async remove(id: VendorBill['id']): Promise<void> {
    const entity = await this.vendorBillRepository.findOne({
      where: this.applyTenantFilter({ id }),
    });

    if (!entity) {
      throw new Error('Record not found or access denied');
    }

    await this.vendorBillRepository.softDelete(entity.id);
  }
}
