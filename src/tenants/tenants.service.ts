import { KycDetailsService } from '../kyc-details/kyc-details.service';
import { KycDetails } from '../kyc-details/domain/kyc-details';

import { UsersService } from '../users/users.service';
import { User } from '../users/domain/user';

import {
  // common
  Injectable,
  HttpStatus,
  UnprocessableEntityException,
  Inject,
  forwardRef,
} from '@nestjs/common';
import { CreateTenantDto } from './dto/create-tenant.dto';
import { UpdateTenantDto } from './dto/update-tenant.dto';
import { TenantRepository } from './infrastructure/persistence/tenant.repository';
import { IPaginationOptions } from '../utils/types/pagination-options';
import { Tenant } from './domain/tenant';

@Injectable()
export class TenantsService {
  constructor(
    @Inject(forwardRef(() => KycDetailsService))
    private readonly kycDetailsService: KycDetailsService,

    @Inject(forwardRef(() => UsersService))
    private readonly userService: UsersService,

    // Dependencies here
    private readonly tenantRepository: TenantRepository,
  ) {}

  async create(createTenantDto: CreateTenantDto) {
    // Do not remove comment below.
    // <creating-property />
    let kycSubmissions: KycDetails[] | null | undefined = undefined;

    if (createTenantDto.kycSubmissions) {
      const kycSubmissionsObjects = await this.kycDetailsService.findByIds(
        createTenantDto.kycSubmissions.map((entity) => entity.id),
      );
      if (
        kycSubmissionsObjects.length !== createTenantDto.kycSubmissions.length
      ) {
        throw new UnprocessableEntityException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            kycSubmissions: 'notExists',
          },
        });
      }
      kycSubmissions = kycSubmissionsObjects;
    } else if (createTenantDto.kycSubmissions === null) {
      kycSubmissions = null;
    }

    let users: User[] | null | undefined = undefined;

    if (createTenantDto.users) {
      const usersObjects = await this.userService.findByIds(
        createTenantDto.users.map((entity) => entity.id),
      );
      if (usersObjects.length !== createTenantDto.users.length) {
        throw new UnprocessableEntityException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            users: 'notExists',
          },
        });
      }
      users = usersObjects;
    } else if (createTenantDto.users === null) {
      users = null;
    }

    return this.tenantRepository.create({
      // Do not remove comment below.
      // <creating-property-payload />
      kycSubmissions,

      users,

      isActive: createTenantDto.isActive,
    });
  }

  findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }) {
    return this.tenantRepository.findAllWithPagination({
      paginationOptions: {
        page: paginationOptions.page,
        limit: paginationOptions.limit,
      },
    });
  }

  findById(id: Tenant['id']) {
    return this.tenantRepository.findById(id);
  }

  findByIds(ids: Tenant['id'][]) {
    return this.tenantRepository.findByIds(ids);
  }

  async update(
    id: Tenant['id'],

    updateTenantDto: UpdateTenantDto,
  ) {
    // Do not remove comment below.
    // <updating-property />
    let kycSubmissions: KycDetails[] | null | undefined = undefined;

    if (updateTenantDto.kycSubmissions) {
      const kycSubmissionsObjects = await this.kycDetailsService.findByIds(
        updateTenantDto.kycSubmissions.map((entity) => entity.id),
      );
      if (
        kycSubmissionsObjects.length !== updateTenantDto.kycSubmissions.length
      ) {
        throw new UnprocessableEntityException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            kycSubmissions: 'notExists',
          },
        });
      }
      kycSubmissions = kycSubmissionsObjects;
    } else if (updateTenantDto.kycSubmissions === null) {
      kycSubmissions = null;
    }

    let users: User[] | null | undefined = undefined;

    if (updateTenantDto.users) {
      const usersObjects = await this.userService.findByIds(
        updateTenantDto.users.map((entity) => entity.id),
      );
      if (usersObjects.length !== updateTenantDto.users.length) {
        throw new UnprocessableEntityException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            users: 'notExists',
          },
        });
      }
      users = usersObjects;
    } else if (updateTenantDto.users === null) {
      users = null;
    }

    return this.tenantRepository.update(id, {
      // Do not remove comment below.
      // <updating-property-payload />
      kycSubmissions,

      users,

      isActive: updateTenantDto.isActive,
    });
  }

  remove(id: Tenant['id']) {
    return this.tenantRepository.remove(id);
  }
}
