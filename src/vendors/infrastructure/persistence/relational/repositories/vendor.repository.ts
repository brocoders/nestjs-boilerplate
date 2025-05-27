import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { VendorEntity } from '../entities/vendor.entity';
import { NullableType } from '../../../../../utils/types/nullable.type';
import { Vendor } from '../../../../domain/vendor';
import { VendorRepository } from '../../vendor.repository';
import { VendorMapper } from '../mappers/vendor.mapper';
import { IPaginationOptions } from '../../../../../utils/types/pagination-options';

@Injectable()
export class VendorRelationalRepository implements VendorRepository {
  constructor(
    @InjectRepository(VendorEntity)
    private readonly vendorRepository: Repository<VendorEntity>,
  ) {}

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
      where: { id },
    });

    return entity ? VendorMapper.toDomain(entity) : null;
  }

  async findByIds(ids: Vendor['id'][]): Promise<Vendor[]> {
    const entities = await this.vendorRepository.find({
      where: { id: In(ids) },
    });

    return entities.map((entity) => VendorMapper.toDomain(entity));
  }

  async update(id: Vendor['id'], payload: Partial<Vendor>): Promise<Vendor> {
    const entity = await this.vendorRepository.findOne({
      where: { id },
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
    await this.vendorRepository.delete(id);
  }
}
