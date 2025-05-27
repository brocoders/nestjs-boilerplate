import {
  // common
  Injectable,
} from '@nestjs/common';
import { CreateVendorBillDto } from './dto/create-vendor-bill.dto';
import { UpdateVendorBillDto } from './dto/update-vendor-bill.dto';
import { VendorBillRepository } from './infrastructure/persistence/vendor-bill.repository';
import { IPaginationOptions } from '../utils/types/pagination-options';
import { VendorBill } from './domain/vendor-bill';

@Injectable()
export class VendorBillsService {
  constructor(
    // Dependencies here
    private readonly vendorBillRepository: VendorBillRepository,
  ) {}

  async create(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    createVendorBillDto: CreateVendorBillDto,
  ) {
    // Do not remove comment below.
    // <creating-property />

    return this.vendorBillRepository.create({
      // Do not remove comment below.
      // <creating-property-payload />
    });
  }

  findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }) {
    return this.vendorBillRepository.findAllWithPagination({
      paginationOptions: {
        page: paginationOptions.page,
        limit: paginationOptions.limit,
      },
    });
  }

  findById(id: VendorBill['id']) {
    return this.vendorBillRepository.findById(id);
  }

  findByIds(ids: VendorBill['id'][]) {
    return this.vendorBillRepository.findByIds(ids);
  }

  async update(
    id: VendorBill['id'],
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    updateVendorBillDto: UpdateVendorBillDto,
  ) {
    // Do not remove comment below.
    // <updating-property />

    return this.vendorBillRepository.update(id, {
      // Do not remove comment below.
      // <updating-property-payload />
    });
  }

  remove(id: VendorBill['id']) {
    return this.vendorBillRepository.remove(id);
  }
}
