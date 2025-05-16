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
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import { AccountRepository } from './infrastructure/persistence/account.repository';
import { IPaginationOptions } from '../utils/types/pagination-options';
import { Account } from './domain/account';

@Injectable()
export class AccountsService {
  constructor(
    private readonly tenantService: TenantsService,

    private readonly userService: UsersService,

    // Dependencies here
    private readonly accountRepository: AccountRepository,
  ) {}

  async create(createAccountDto: CreateAccountDto) {
    // Do not remove comment below.
    // <creating-property />
    const tenantObject = await this.tenantService.findById(
      createAccountDto.tenant.id,
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

    let owner: User[] | null | undefined = undefined;

    if (createAccountDto.owner) {
      const ownerObjects = await this.userService.findByIds(
        createAccountDto.owner.map((entity) => entity.id),
      );
      if (ownerObjects.length !== createAccountDto.owner.length) {
        throw new UnprocessableEntityException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            owner: 'notExists',
          },
        });
      }
      owner = ownerObjects;
    } else if (createAccountDto.owner === null) {
      owner = null;
    }

    return this.accountRepository.create({
      // Do not remove comment below.
      // <creating-property-payload />
      tenant,

      owner,

      type: createAccountDto.type,

      active: createAccountDto.active,

      callbackUrl: createAccountDto.callbackUrl,

      notificationChannel: createAccountDto.notificationChannel,

      notificationType: createAccountDto.notificationType,

      receiveNotification: createAccountDto.receiveNotification,

      balance: createAccountDto.balance,

      number: createAccountDto.number,

      description: createAccountDto.description,

      name: createAccountDto.name,
    });
  }

  findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }) {
    return this.accountRepository.findAllWithPagination({
      paginationOptions: {
        page: paginationOptions.page,
        limit: paginationOptions.limit,
      },
    });
  }

  findById(id: Account['id']) {
    return this.accountRepository.findById(id);
  }

  findByIds(ids: Account['id'][]) {
    return this.accountRepository.findByIds(ids);
  }

  async update(
    id: Account['id'],

    updateAccountDto: UpdateAccountDto,
  ) {
    // Do not remove comment below.
    // <updating-property />
    let tenant: Tenant | undefined = undefined;

    if (updateAccountDto.tenant) {
      const tenantObject = await this.tenantService.findById(
        updateAccountDto.tenant.id,
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

    let owner: User[] | null | undefined = undefined;

    if (updateAccountDto.owner) {
      const ownerObjects = await this.userService.findByIds(
        updateAccountDto.owner.map((entity) => entity.id),
      );
      if (ownerObjects.length !== updateAccountDto.owner.length) {
        throw new UnprocessableEntityException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            owner: 'notExists',
          },
        });
      }
      owner = ownerObjects;
    } else if (updateAccountDto.owner === null) {
      owner = null;
    }

    return this.accountRepository.update(id, {
      // Do not remove comment below.
      // <updating-property-payload />
      tenant,

      owner,

      type: updateAccountDto.type,

      active: updateAccountDto.active,

      callbackUrl: updateAccountDto.callbackUrl,

      notificationChannel: updateAccountDto.notificationChannel,

      notificationType: updateAccountDto.notificationType,

      receiveNotification: updateAccountDto.receiveNotification,

      balance: updateAccountDto.balance,

      number: updateAccountDto.number,

      description: updateAccountDto.description,

      name: updateAccountDto.name,
    });
  }

  remove(id: Account['id']) {
    return this.accountRepository.remove(id);
  }
}
