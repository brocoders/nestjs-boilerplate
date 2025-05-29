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
import { CreateOnboardingDto } from './dto/create-onboarding.dto';
import { UpdateOnboardingDto } from './dto/update-onboarding.dto';
import { OnboardingRepository } from './infrastructure/persistence/onboarding.repository';
import { IPaginationOptions } from '../utils/types/pagination-options';
import { Onboarding } from './domain/onboarding';

@Injectable()
export class OnboardingsService {
  constructor(
    private readonly tenantService: TenantsService,

    private readonly userService: UsersService,

    // Dependencies here
    private readonly onboardingRepository: OnboardingRepository,
  ) {}

  async create(createOnboardingDto: CreateOnboardingDto) {
    // Do not remove comment below.
    // <creating-property />

    let tenant: Tenant | null | undefined = undefined;

    if (createOnboardingDto.tenant) {
      const tenantObject = await this.tenantService.findById(
        createOnboardingDto.tenant.id,
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
    } else if (createOnboardingDto.tenant === null) {
      tenant = null;
    }

    let user: User | null | undefined = undefined;

    if (createOnboardingDto.user) {
      const userObject = await this.userService.findById(
        createOnboardingDto.user.id,
      );
      if (!userObject) {
        throw new UnprocessableEntityException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            user: 'notExists',
          },
        });
      }
      user = userObject;
    } else if (createOnboardingDto.user === null) {
      user = null;
    }

    return this.onboardingRepository.create({
      // Do not remove comment below.
      // <creating-property-payload />
      completedAt: createOnboardingDto.completedAt,

      metadata: createOnboardingDto.metadata,

      isSkippable: createOnboardingDto.isSkippable,

      isRequired: createOnboardingDto.isRequired,

      order: createOnboardingDto.order,

      status: createOnboardingDto.status,

      description: createOnboardingDto.description,

      name: createOnboardingDto.name,

      stepKey: createOnboardingDto.stepKey,

      entityType: createOnboardingDto.entityType,

      tenant,

      user,
    });
  }

  findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }) {
    return this.onboardingRepository.findAllWithPagination({
      paginationOptions: {
        page: paginationOptions.page,
        limit: paginationOptions.limit,
      },
    });
  }

  findById(id: Onboarding['id']) {
    return this.onboardingRepository.findById(id);
  }

  findByIds(ids: Onboarding['id'][]) {
    return this.onboardingRepository.findByIds(ids);
  }

  async update(
    id: Onboarding['id'],

    updateOnboardingDto: UpdateOnboardingDto,
  ) {
    // Do not remove comment below.
    // <updating-property />

    let tenant: Tenant | null | undefined = undefined;

    if (updateOnboardingDto.tenant) {
      const tenantObject = await this.tenantService.findById(
        updateOnboardingDto.tenant.id,
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
    } else if (updateOnboardingDto.tenant === null) {
      tenant = null;
    }

    let user: User | null | undefined = undefined;

    if (updateOnboardingDto.user) {
      const userObject = await this.userService.findById(
        updateOnboardingDto.user.id,
      );
      if (!userObject) {
        throw new UnprocessableEntityException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            user: 'notExists',
          },
        });
      }
      user = userObject;
    } else if (updateOnboardingDto.user === null) {
      user = null;
    }

    return this.onboardingRepository.update(id, {
      // Do not remove comment below.
      // <updating-property-payload />
      completedAt: updateOnboardingDto.completedAt,

      metadata: updateOnboardingDto.metadata,

      isSkippable: updateOnboardingDto.isSkippable,

      isRequired: updateOnboardingDto.isRequired,

      order: updateOnboardingDto.order,

      status: updateOnboardingDto.status,

      description: updateOnboardingDto.description,

      name: updateOnboardingDto.name,

      stepKey: updateOnboardingDto.stepKey,

      entityType: updateOnboardingDto.entityType,

      tenant,

      user,
    });
  }

  remove(id: Onboarding['id']) {
    return this.onboardingRepository.remove(id);
  }
}
