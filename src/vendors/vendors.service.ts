import { VendorBillsService } from '../vendor-bills/vendor-bills.service';
import { VendorBill } from '../vendor-bills/domain/vendor-bill';

import {
  // common
  Injectable,
  HttpStatus,
  UnprocessableEntityException,
  Inject,
  forwardRef,
} from '@nestjs/common';
import { CreateVendorDto } from './dto/create-vendor.dto';
import { UpdateVendorDto } from './dto/update-vendor.dto';
import { VendorRepository } from './infrastructure/persistence/vendor.repository';
import { IPaginationOptions } from '../utils/types/pagination-options';
import { Vendor } from './domain/vendor';

@Injectable()
export class VendorsService {
  constructor(
    @Inject(forwardRef(() => VendorBillsService))
    private readonly vendorBillService: VendorBillsService,

    // Dependencies here
    private readonly vendorRepository: VendorRepository,
  ) {}

  async create(createVendorDto: CreateVendorDto) {
    // Do not remove comment below.
    // <creating-property />
    let bills: VendorBill[] | null | undefined = undefined;

    if (createVendorDto.bills) {
      const billsObjects = await this.vendorBillService.findByIds(
        createVendorDto.bills.map((entity) => entity.id),
      );
      if (billsObjects.length !== createVendorDto.bills.length) {
        throw new UnprocessableEntityException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            bills: 'notExists',
          },
        });
      }
      bills = billsObjects;
    } else if (createVendorDto.bills === null) {
      bills = null;
    }

    return this.vendorRepository.create({
      // Do not remove comment below.
      // <creating-property-payload />
      bills,

      paymentTerms: createVendorDto.paymentTerms,

      contactEmail: createVendorDto.contactEmail,

      name: createVendorDto.name,
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

    updateVendorDto: UpdateVendorDto,
  ) {
    // Do not remove comment below.
    // <updating-property />
    let bills: VendorBill[] | null | undefined = undefined;

    if (updateVendorDto.bills) {
      const billsObjects = await this.vendorBillService.findByIds(
        updateVendorDto.bills.map((entity) => entity.id),
      );
      if (billsObjects.length !== updateVendorDto.bills.length) {
        throw new UnprocessableEntityException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            bills: 'notExists',
          },
        });
      }
      bills = billsObjects;
    } else if (updateVendorDto.bills === null) {
      bills = null;
    }

    return this.vendorRepository.update(id, {
      // Do not remove comment below.
      // <updating-property-payload />
      bills,

      paymentTerms: updateVendorDto.paymentTerms,

      contactEmail: updateVendorDto.contactEmail,

      name: updateVendorDto.name,
    });
  }

  remove(id: Vendor['id']) {
    return this.vendorRepository.remove(id);
  }
}
