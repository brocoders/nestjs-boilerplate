import { Inject, Injectable } from '@nestjs/common';
import { Repository, In, DataSource, FindOptionsWhere } from 'typeorm';
import { InvoiceEntity } from '../entities/invoice.entity';
import { NullableType } from '../../../../../utils/types/nullable.type';
import { Invoice } from '../../../../domain/invoice';
import { InvoiceRepository } from '../../invoice.repository';
import { InvoiceMapper } from '../mappers/invoice.mapper';
import { IPaginationOptions } from '../../../../../utils/types/pagination-options';
import { REQUEST } from '@nestjs/core';
import { TenantDataSource } from '../../../../../database/tenant-data-source';

@Injectable()
export class InvoiceRelationalRepository implements InvoiceRepository {
  private invoiceRepository: Repository<InvoiceEntity>;

  constructor(@Inject(REQUEST) private request: Request) {
    const dataSource: DataSource =
      this.request['tenantDataSource'] || TenantDataSource.getCoreDataSource();
    this.invoiceRepository = dataSource.getRepository(InvoiceEntity);
  }

  private applyTenantFilter(
    where: FindOptionsWhere<InvoiceEntity> = {},
  ): FindOptionsWhere<InvoiceEntity> {
    const tenantId = this.request['tenantId'];

    if (tenantId) {
      return {
        ...where,
        tenant: { id: tenantId },
      };
    }

    return where;
  }
  async create(data: Invoice): Promise<Invoice> {
    const persistenceModel = InvoiceMapper.toPersistence(data);
    const newEntity = await this.invoiceRepository.save(
      this.invoiceRepository.create(persistenceModel),
    );
    return InvoiceMapper.toDomain(newEntity);
  }

  async findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<Invoice[]> {
    const entities = await this.invoiceRepository.find({
      skip: (paginationOptions.page - 1) * paginationOptions.limit,
      take: paginationOptions.limit,
      where: this.applyTenantFilter(),
    });

    return entities.map((entity) => InvoiceMapper.toDomain(entity));
  }

  async findById(id: Invoice['id']): Promise<NullableType<Invoice>> {
    const entity = await this.invoiceRepository.findOne({
      where: this.applyTenantFilter({ id }),
    });

    return entity ? InvoiceMapper.toDomain(entity) : null;
  }

  async findByIds(ids: Invoice['id'][]): Promise<Invoice[]> {
    const entities = await this.invoiceRepository.find({
      where: this.applyTenantFilter({ id: In(ids) }),
    });

    return entities.map((entity) => InvoiceMapper.toDomain(entity));
  }

  async update(id: Invoice['id'], payload: Partial<Invoice>): Promise<Invoice> {
    const entity = await this.invoiceRepository.findOne({
      where: this.applyTenantFilter({ id }),
    });

    if (!entity) {
      throw new Error('Record not found');
    }

    const updatedEntity = await this.invoiceRepository.save(
      this.invoiceRepository.create(
        InvoiceMapper.toPersistence({
          ...InvoiceMapper.toDomain(entity),
          ...payload,
        }),
      ),
    );

    return InvoiceMapper.toDomain(updatedEntity);
  }

  async remove(id: Invoice['id']): Promise<void> {
    const entity = await this.invoiceRepository.findOne({
      where: this.applyTenantFilter({ id }),
    });

    if (!entity) {
      throw new Error('Record not found or access denied');
    }

    await this.invoiceRepository.softDelete(entity.id);
  }
}
