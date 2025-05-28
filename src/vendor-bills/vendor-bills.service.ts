import { AccountsPayablesService } from '../accounts-payables/accounts-payables.service';
import { AccountsPayable } from '../accounts-payables/domain/accounts-payable';

import { VendorsService } from '../vendors/vendors.service';
import {
  // common
  Injectable,
  HttpStatus,
  UnprocessableEntityException,
  Inject,
  forwardRef,
} from '@nestjs/common';
import { CreateVendorBillDto } from './dto/create-vendor-bill.dto';
import { UpdateVendorBillDto } from './dto/update-vendor-bill.dto';
import { VendorBillRepository } from './infrastructure/persistence/vendor-bill.repository';
import { IPaginationOptions } from '../utils/types/pagination-options';
import { VendorBill } from './domain/vendor-bill';
import { Vendor } from '../vendors/domain/vendor';

@Injectable()
export class VendorBillsService {
  constructor(
    private readonly accountsPayableService: AccountsPayablesService,

    @Inject(forwardRef(() => VendorsService))
    private readonly vendorService: VendorsService,

    // Dependencies here
    private readonly vendorBillRepository: VendorBillRepository,
  ) {}

  async create(createVendorBillDto: CreateVendorBillDto) {
    // Do not remove comment below.
    // <creating-property />
    let accountsPayable: AccountsPayable | null | undefined = undefined;

    if (createVendorBillDto.accountsPayable) {
      const accountsPayableObject = await this.accountsPayableService.findById(
        createVendorBillDto.accountsPayable.id,
      );
      if (!accountsPayableObject) {
        throw new UnprocessableEntityException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            accountsPayable: 'notExists',
          },
        });
      }
      accountsPayable = accountsPayableObject;
    } else if (createVendorBillDto.accountsPayable === null) {
      accountsPayable = null;
    }

    const vendorObject = await this.vendorService.findById(
      createVendorBillDto.vendor.id,
    );
    if (!vendorObject) {
      throw new UnprocessableEntityException({
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        errors: {
          vendor: 'notExists',
        },
      });
    }
    const vendor = vendorObject;

    return this.vendorBillRepository.create({
      // Do not remove comment below.
      // <creating-property-payload />
      accountsPayable,

      vendor,
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

    updateVendorBillDto: UpdateVendorBillDto,
  ) {
    // Do not remove comment below.
    // <updating-property />
    let accountsPayable: AccountsPayable | null | undefined = undefined;

    if (updateVendorBillDto.accountsPayable) {
      const accountsPayableObject = await this.accountsPayableService.findById(
        updateVendorBillDto.accountsPayable.id,
      );
      if (!accountsPayableObject) {
        throw new UnprocessableEntityException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            accountsPayable: 'notExists',
          },
        });
      }
      accountsPayable = accountsPayableObject;
    } else if (updateVendorBillDto.accountsPayable === null) {
      accountsPayable = null;
    }

    let vendor: Vendor | undefined = undefined;

    if (updateVendorBillDto.vendor) {
      const vendorObject = await this.vendorService.findById(
        updateVendorBillDto.vendor.id,
      );
      if (!vendorObject) {
        throw new UnprocessableEntityException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            vendor: 'notExists',
          },
        });
      }
      vendor = vendorObject;
    }

    return this.vendorBillRepository.update(id, {
      // Do not remove comment below.
      // <updating-property-payload />
      accountsPayable,

      vendor,
    });
  }

  remove(id: VendorBill['id']) {
    return this.vendorBillRepository.remove(id);
  }
}
