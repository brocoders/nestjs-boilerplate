import { UsersService } from '../users/users.service';
import { User } from '../users/domain/user';

import {
  // common
  Injectable,
  HttpStatus,
  UnprocessableEntityException,
} from '@nestjs/common';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { UpdateInvoiceDto } from './dto/update-invoice.dto';
import { InvoiceRepository } from './infrastructure/persistence/invoice.repository';
import { IPaginationOptions } from '../utils/types/pagination-options';
import { Invoice } from './domain/invoice';

@Injectable()
export class InvoicesService {
  constructor(
    private readonly userService: UsersService,

    // Dependencies here
    private readonly invoiceRepository: InvoiceRepository,
  ) {}

  async create(createInvoiceDto: CreateInvoiceDto) {
    // Do not remove comment below.
    // <creating-property />

    let customer: User | null | undefined = undefined;

    if (createInvoiceDto.customer) {
      const customerObject = await this.userService.findById(
        createInvoiceDto.customer.id,
      );
      if (!customerObject) {
        throw new UnprocessableEntityException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            customer: 'notExists',
          },
        });
      }
      customer = customerObject;
    } else if (createInvoiceDto.customer === null) {
      customer = null;
    }

    return this.invoiceRepository.create({
      // Do not remove comment below.
      // <creating-property-payload />
      breakdown: createInvoiceDto.breakdown,

      status: createInvoiceDto.status,

      dueDate: createInvoiceDto.dueDate,

      amount: createInvoiceDto.amount,

      customer,
    });
  }

  findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }) {
    return this.invoiceRepository.findAllWithPagination({
      paginationOptions: {
        page: paginationOptions.page,
        limit: paginationOptions.limit,
      },
    });
  }

  findById(id: Invoice['id']) {
    return this.invoiceRepository.findById(id);
  }

  findByIds(ids: Invoice['id'][]) {
    return this.invoiceRepository.findByIds(ids);
  }

  async update(
    id: Invoice['id'],

    updateInvoiceDto: UpdateInvoiceDto,
  ) {
    // Do not remove comment below.
    // <updating-property />

    let customer: User | null | undefined = undefined;

    if (updateInvoiceDto.customer) {
      const customerObject = await this.userService.findById(
        updateInvoiceDto.customer.id,
      );
      if (!customerObject) {
        throw new UnprocessableEntityException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            customer: 'notExists',
          },
        });
      }
      customer = customerObject;
    } else if (updateInvoiceDto.customer === null) {
      customer = null;
    }

    return this.invoiceRepository.update(id, {
      // Do not remove comment below.
      // <updating-property-payload />
      breakdown: updateInvoiceDto.breakdown,

      status: updateInvoiceDto.status,

      dueDate: updateInvoiceDto.dueDate,

      amount: updateInvoiceDto.amount,

      customer,
    });
  }

  remove(id: Invoice['id']) {
    return this.invoiceRepository.remove(id);
  }
}
