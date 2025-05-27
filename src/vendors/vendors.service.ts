import {
  // common
  Injectable,
} from '@nestjs/common';
import { CreateVendorDto } from './dto/create-vendor.dto';
import { UpdateVendorDto } from './dto/update-vendor.dto';
import { VendorRepository } from './infrastructure/persistence/vendor.repository';
import { IPaginationOptions } from '../utils/types/pagination-options';
import { Vendor } from './domain/vendor';

@Injectable()
export class VendorsService {
  constructor(
    // Dependencies here
    private readonly vendorRepository: VendorRepository,
  ) {}

  async create(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    createVendorDto: CreateVendorDto,
  ) {
    // Do not remove comment below.
    // <creating-property />

    return this.vendorRepository.create({
      // Do not remove comment below.
      // <creating-property-payload />
    });
  }

  findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }) {
    return this.vendorRepository.findAllWithPagination({
      paginationOptions: {
        page: paginationOptions.page,
        limit: paginationOptions.limit,
      },
    });
  }

  findById(id: Vendor['id']) {
    return this.vendorRepository.findById(id);
  }

  findByIds(ids: Vendor['id'][]) {
    return this.vendorRepository.findByIds(ids);
  }

  async update(
    id: Vendor['id'],
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    updateVendorDto: UpdateVendorDto,
  ) {
    // Do not remove comment below.
    // <updating-property />

    return this.vendorRepository.update(id, {
      // Do not remove comment below.
      // <updating-property-payload />
    });
  }

  remove(id: Vendor['id']) {
    return this.vendorRepository.remove(id);
  }
}
