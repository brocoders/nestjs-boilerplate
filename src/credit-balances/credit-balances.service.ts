import { TenantsService } from '../tenants/tenants.service';
import { Tenant } from '../tenants/domain/tenant';

import { UsersService } from '../users/users.service';
import { User } from '../users/domain/user';

import {
  // common
  Injectable,
  HttpStatus,
  UnprocessableEntityException,
} from '@nestjs/common';
import { CreateCreditBalanceDto } from './dto/create-credit-balance.dto';
import { UpdateCreditBalanceDto } from './dto/update-credit-balance.dto';
import { CreditBalanceRepository } from './infrastructure/persistence/credit-balance.repository';
import { IPaginationOptions } from '../utils/types/pagination-options';
import { CreditBalance } from './domain/credit-balance';

@Injectable()
export class CreditBalancesService {
  constructor(
    private readonly tenantService: TenantsService,

    private readonly userService: UsersService,

    // Dependencies here
    private readonly creditBalanceRepository: CreditBalanceRepository,
  ) {}

  async create(createCreditBalanceDto: CreateCreditBalanceDto) {
    // Do not remove comment below.
    // <creating-property />
    const tenantObject = await this.tenantService.findById(
      createCreditBalanceDto.tenant.id,
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

    const customerObject = await this.userService.findById(
      createCreditBalanceDto.customer.id,
    );
    if (!customerObject) {
      throw new UnprocessableEntityException({
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        errors: {
          customer: 'notExists',
        },
      });
    }
    const customer = customerObject;

    return this.creditBalanceRepository.create({
      // Do not remove comment below.
      // <creating-property-payload />
      tenant,

      auditLog: createCreditBalanceDto.auditLog,

      amount: createCreditBalanceDto.amount,

      customer,
    });
  }

  findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }) {
    return this.creditBalanceRepository.findAllWithPagination({
      paginationOptions: {
        page: paginationOptions.page,
        limit: paginationOptions.limit,
      },
    });
  }

  findById(id: CreditBalance['id']) {
    return this.creditBalanceRepository.findById(id);
  }

  findByIds(ids: CreditBalance['id'][]) {
    return this.creditBalanceRepository.findByIds(ids);
  }

  async update(
    id: CreditBalance['id'],

    updateCreditBalanceDto: UpdateCreditBalanceDto,
  ) {
    // Do not remove comment below.
    // <updating-property />
    let tenant: Tenant | undefined = undefined;

    if (updateCreditBalanceDto.tenant) {
      const tenantObject = await this.tenantService.findById(
        updateCreditBalanceDto.tenant.id,
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

    let customer: User | undefined = undefined;

    if (updateCreditBalanceDto.customer) {
      const customerObject = await this.userService.findById(
        updateCreditBalanceDto.customer.id,
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
    }

    return this.creditBalanceRepository.update(id, {
      // Do not remove comment below.
      // <updating-property-payload />
      tenant,
      auditLog: updateCreditBalanceDto.auditLog,

      amount: updateCreditBalanceDto.amount,

      customer,
    });
  }

  remove(id: CreditBalance['id']) {
    return this.creditBalanceRepository.remove(id);
  }
}
