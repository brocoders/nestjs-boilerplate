import { AccountsService } from '../accounts/accounts.service';
import { UsersService } from '../users/users.service';
import { User } from '../users/domain/user';

import {
  // common
  Injectable,
  HttpStatus,
  UnprocessableEntityException,
} from '@nestjs/common';
import { CreateAccountsPayableDto } from './dto/create-accounts-payable.dto';
import { UpdateAccountsPayableDto } from './dto/update-accounts-payable.dto';
import { AccountsPayableRepository } from './infrastructure/persistence/accounts-payable.repository';
import { IPaginationOptions } from '../utils/types/pagination-options';
import { AccountsPayable } from './domain/accounts-payable';
import { Account } from '../accounts/domain/account';

@Injectable()
export class AccountsPayablesService {
  constructor(
    private readonly accountService: AccountsService,

    private readonly userService: UsersService,

    // Dependencies here
    private readonly accountsPayableRepository: AccountsPayableRepository,
  ) {}

  async create(createAccountsPayableDto: CreateAccountsPayableDto) {
    // Do not remove comment below.
    // <creating-property />
    let account: Account[] | null | undefined = undefined;

    if (createAccountsPayableDto.account) {
      const accountObjects = await this.accountService.findByIds(
        createAccountsPayableDto.account.map((entity) => entity.id),
      );
      if (accountObjects.length !== createAccountsPayableDto.account.length) {
        throw new UnprocessableEntityException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            account: 'notExists',
          },
        });
      }
      account = accountObjects;
    } else if (createAccountsPayableDto.account === null) {
      account = null;
    }

    let owner: User[] | null | undefined = undefined;

    if (createAccountsPayableDto.owner) {
      const ownerObjects = await this.userService.findByIds(
        createAccountsPayableDto.owner.map((entity) => entity.id),
      );
      if (ownerObjects.length !== createAccountsPayableDto.owner.length) {
        throw new UnprocessableEntityException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            owner: 'notExists',
          },
        });
      }
      owner = ownerObjects;
    } else if (createAccountsPayableDto.owner === null) {
      owner = null;
    }

    return this.accountsPayableRepository.create({
      // Do not remove comment below.
      // <creating-property-payload />
      account,

      owner,

      accountType: createAccountsPayableDto.accountType,

      salePrice: createAccountsPayableDto.salePrice,

      purchasePrice: createAccountsPayableDto.purchasePrice,

      quantity: createAccountsPayableDto.quantity,

      itemDescription: createAccountsPayableDto.itemDescription,

      itemName: createAccountsPayableDto.itemName,

      amount: createAccountsPayableDto.amount,

      transactionType: createAccountsPayableDto.transactionType,
    });
  }

  findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }) {
    return this.accountsPayableRepository.findAllWithPagination({
      paginationOptions: {
        page: paginationOptions.page,
        limit: paginationOptions.limit,
      },
    });
  }

  findById(id: AccountsPayable['id']) {
    return this.accountsPayableRepository.findById(id);
  }

  findByIds(ids: AccountsPayable['id'][]) {
    return this.accountsPayableRepository.findByIds(ids);
  }

  async update(
    id: AccountsPayable['id'],

    updateAccountsPayableDto: UpdateAccountsPayableDto,
  ) {
    // Do not remove comment below.
    // <updating-property />
    let account: Account[] | null | undefined = undefined;

    if (updateAccountsPayableDto.account) {
      const accountObjects = await this.accountService.findByIds(
        updateAccountsPayableDto.account.map((entity) => entity.id),
      );
      if (accountObjects.length !== updateAccountsPayableDto.account.length) {
        throw new UnprocessableEntityException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            account: 'notExists',
          },
        });
      }
      account = accountObjects;
    } else if (updateAccountsPayableDto.account === null) {
      account = null;
    }

    let owner: User[] | null | undefined = undefined;

    if (updateAccountsPayableDto.owner) {
      const ownerObjects = await this.userService.findByIds(
        updateAccountsPayableDto.owner.map((entity) => entity.id),
      );
      if (ownerObjects.length !== updateAccountsPayableDto.owner.length) {
        throw new UnprocessableEntityException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            owner: 'notExists',
          },
        });
      }
      owner = ownerObjects;
    } else if (updateAccountsPayableDto.owner === null) {
      owner = null;
    }

    return this.accountsPayableRepository.update(id, {
      // Do not remove comment below.
      // <updating-property-payload />
      account,

      owner,

      accountType: updateAccountsPayableDto.accountType,

      salePrice: updateAccountsPayableDto.salePrice,

      purchasePrice: updateAccountsPayableDto.purchasePrice,

      quantity: updateAccountsPayableDto.quantity,

      itemDescription: updateAccountsPayableDto.itemDescription,

      itemName: updateAccountsPayableDto.itemName,

      amount: updateAccountsPayableDto.amount,

      transactionType: updateAccountsPayableDto.transactionType,
    });
  }

  remove(id: AccountsPayable['id']) {
    return this.accountsPayableRepository.remove(id);
  }
}
