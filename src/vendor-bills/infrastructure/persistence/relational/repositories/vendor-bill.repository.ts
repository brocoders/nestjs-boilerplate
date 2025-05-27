import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { VendorBillEntity } from '../entities/vendor-bill.entity';
import { NullableType } from '../../../../../utils/types/nullable.type';
import { VendorBill } from '../../../../domain/vendor-bill';
import { VendorBillRepository } from '../../vendor-bill.repository';
import { VendorBillMapper } from '../mappers/vendor-bill.mapper';
import { IPaginationOptions } from '../../../../../utils/types/pagination-options';

@Injectable()
export class VendorBillRelationalRepository implements VendorBillRepository {
  constructor(
    @InjectRepository(VendorBillEntity)
    private readonly vendorBillRepository: Repository<VendorBillEntity>,
  ) {}

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
      where: { id },
    });

    return entity ? VendorBillMapper.toDomain(entity) : null;
  }

  async findByIds(ids: VendorBill['id'][]): Promise<VendorBill[]> {
    const entities = await this.vendorBillRepository.find({
      where: { id: In(ids) },
    });

    return entities.map((entity) => VendorBillMapper.toDomain(entity));
  }

  async update(
    id: VendorBill['id'],
    payload: Partial<VendorBill>,
  ): Promise<VendorBill> {
    const entity = await this.vendorBillRepository.findOne({
      where: { id },
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
    await this.vendorBillRepository.delete(id);
  }
}
