import { TenantsService } from '../tenants/tenants.service';
import { Tenant } from '../tenants/domain/tenant';

import {
  // common
  Injectable,
  HttpStatus,
  UnprocessableEntityException,
} from '@nestjs/common';
import { CreatePaymentMethodDto } from './dto/create-payment-method.dto';
import { UpdatePaymentMethodDto } from './dto/update-payment-method.dto';
import { PaymentMethodRepository } from './infrastructure/persistence/payment-method.repository';
import { IPaginationOptions } from '../utils/types/pagination-options';
import { PaymentMethod } from './domain/payment-method';

@Injectable()
export class PaymentMethodsService {
  constructor(
    private readonly tenantService: TenantsService,

    // Dependencies here
    private readonly paymentMethodRepository: PaymentMethodRepository,
  ) {}

  async create(createPaymentMethodDto: CreatePaymentMethodDto) {
    // Do not remove comment below.
    // <creating-property />
    const tenantObject = await this.tenantService.findById(
      createPaymentMethodDto.tenant.id,
    );
    if (!tenantObject) {
      throw new UnprocessableEntityException({
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        errors: {
          tenant: 'notExists',
        },
      });
    }
    const tenant = tenantObject;

    return this.paymentMethodRepository.create({
      // Do not remove comment below.
      // <creating-property-payload />
      tenant,

      config: createPaymentMethodDto.config,

      processorType: createPaymentMethodDto.processorType,

      name: createPaymentMethodDto.name,
    });
  }

  findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }) {
    return this.paymentMethodRepository.findAllWithPagination({
      paginationOptions: {
        page: paginationOptions.page,
        limit: paginationOptions.limit,
      },
    });
  }

  findById(id: PaymentMethod['id']) {
    return this.paymentMethodRepository.findById(id);
  }

  findByIds(ids: PaymentMethod['id'][]) {
    return this.paymentMethodRepository.findByIds(ids);
  }

  async update(
    id: PaymentMethod['id'],

    updatePaymentMethodDto: UpdatePaymentMethodDto,
  ) {
    // Do not remove comment below.
    // <updating-property />
    let tenant: Tenant | undefined = undefined;

    if (updatePaymentMethodDto.tenant) {
      const tenantObject = await this.tenantService.findById(
        updatePaymentMethodDto.tenant.id,
      );
      if (!tenantObject) {
        throw new UnprocessableEntityException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            tenant: 'notExists',
          },
        });
      }
      tenant = tenantObject;
    }

    return this.paymentMethodRepository.update(id, {
      // Do not remove comment below.
      // <updating-property-payload />
      tenant,

      config: updatePaymentMethodDto.config,

      processorType: updatePaymentMethodDto.processorType,

      name: updatePaymentMethodDto.name,
    });
  }

  remove(id: PaymentMethod['id']) {
    return this.paymentMethodRepository.remove(id);
  }
}
