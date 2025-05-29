import { TenantsService } from '../tenants/tenants.service';
import { Tenant } from '../tenants/domain/tenant';

import { AccountsService } from '../accounts/accounts.service';
import { UsersService } from '../users/users.service';
import { User } from '../users/domain/user';

import {
  // common
  Injectable,
  HttpStatus,
  UnprocessableEntityException,
} from '@nestjs/common';
import { CreateAccountsReceivableDto } from './dto/create-accounts-receivable.dto';
import { UpdateAccountsReceivableDto } from './dto/update-accounts-receivable.dto';
import { AccountsReceivableRepository } from './infrastructure/persistence/accounts-receivable.repository';
import { IPaginationOptions } from '../utils/types/pagination-options';
import { AccountsReceivable } from './domain/accounts-receivable';
import { Account } from '../accounts/domain/account';

@Injectable()
export class AccountsReceivablesService {
  constructor(
    private readonly tenantService: TenantsService,

    private readonly accountService: AccountsService,

    private readonly userService: UsersService,

    // Dependencies here
    private readonly accountsReceivableRepository: AccountsReceivableRepository,
  ) {}

  async create(createAccountsReceivableDto: CreateAccountsReceivableDto) {
    // Do not remove comment below.
    // <creating-property />
    const tenantObject = await this.tenantService.findById(
      createAccountsReceivableDto.tenant.id,
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

    let account: Account[] | null | undefined = undefined;

    if (createAccountsReceivableDto.account) {
      const accountObjects = await this.accountService.findByIds(
        createAccountsReceivableDto.account.map((entity) => entity.id),
      );
      if (
        accountObjects.length !== createAccountsReceivableDto.account.length
      ) {
        throw new UnprocessableEntityException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            account: 'notExists',
          },
        });
      }
      account = accountObjects;
    } else if (createAccountsReceivableDto.account === null) {
      account = null;
    }

    let owner: User[] | null | undefined = undefined;

    if (createAccountsReceivableDto.owner) {
      const ownerObjects = await this.userService.findByIds(
        createAccountsReceivableDto.owner.map((entity) => entity.id),
      );
      if (ownerObjects.length !== createAccountsReceivableDto.owner.length) {
        throw new UnprocessableEntityException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            owner: 'notExists',
          },
        });
      }
      owner = ownerObjects;
    } else if (createAccountsReceivableDto.owner === null) {
      owner = null;
    }

    return this.accountsReceivableRepository.create({
      // Do not remove comment below.
      // <creating-property-payload />
      tenant,

      account,

      owner,

      accountType: createAccountsReceivableDto.accountType,

      amount: createAccountsReceivableDto.amount,

      transactionType: createAccountsReceivableDto.transactionType,
    });
  }

  findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }) {
    return this.accountsReceivableRepository.findAllWithPagination({
      paginationOptions: {
        page: paginationOptions.page,
        limit: paginationOptions.limit,
      },
    });
  }

  findById(id: AccountsReceivable['id']) {
    return this.accountsReceivableRepository.findById(id);
  }

  findByIds(ids: AccountsReceivable['id'][]) {
    return this.accountsReceivableRepository.findByIds(ids);
  }

  async update(
    id: AccountsReceivable['id'],

    updateAccountsReceivableDto: UpdateAccountsReceivableDto,
  ) {
    // Do not remove comment below.
    // <updating-property />
    let tenant: Tenant | undefined = undefined;

    if (updateAccountsReceivableDto.tenant) {
      const tenantObject = await this.tenantService.findById(
        updateAccountsReceivableDto.tenant.id,
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

    let account: Account[] | null | undefined = undefined;

    if (updateAccountsReceivableDto.account) {
      const accountObjects = await this.accountService.findByIds(
        updateAccountsReceivableDto.account.map((entity) => entity.id),
      );
      if (
        accountObjects.length !== updateAccountsReceivableDto.account.length
      ) {
        throw new UnprocessableEntityException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            account: 'notExists',
          },
        });
      }
      account = accountObjects;
    } else if (updateAccountsReceivableDto.account === null) {
      account = null;
    }

    let owner: User[] | null | undefined = undefined;

    if (updateAccountsReceivableDto.owner) {
      const ownerObjects = await this.userService.findByIds(
        updateAccountsReceivableDto.owner.map((entity) => entity.id),
      );
      if (ownerObjects.length !== updateAccountsReceivableDto.owner.length) {
        throw new UnprocessableEntityException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            owner: 'notExists',
          },
        });
      }
      owner = ownerObjects;
    } else if (updateAccountsReceivableDto.owner === null) {
      owner = null;
    }

    return this.accountsReceivableRepository.update(id, {
      // Do not remove comment below.
      // <updating-property-payload />
      tenant,

      account,

      owner,

      accountType: updateAccountsReceivableDto.accountType,

      amount: updateAccountsReceivableDto.amount,

      transactionType: updateAccountsReceivableDto.transactionType,
    });
  }

  remove(id: AccountsReceivable['id']) {
    return this.accountsReceivableRepository.remove(id);
  }
}
