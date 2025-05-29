import { TenantsService } from '../tenants/tenants.service';
import { Tenant } from '../tenants/domain/tenant';

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
import { CreateSettingsDto } from './dto/create-settings.dto';
import { UpdateSettingsDto } from './dto/update-settings.dto';
import { SettingsRepository } from './infrastructure/persistence/settings.repository';
import { IPaginationOptions } from '../utils/types/pagination-options';
import { Settings } from './domain/settings';
import {
  SettingsConfig,
  SettingsSubjectType,
  SettingsType,
} from './infrastructure/persistence/relational/entities/settings.entity';

@Injectable()
export class SettingsService {
  constructor(
    @Inject(forwardRef(() => TenantsService))
    private readonly tenantService: TenantsService,

    @Inject(forwardRef(() => UsersService))
    private readonly userService: UsersService,

    // Dependencies here
    private readonly settingsRepository: SettingsRepository,
  ) {}

  async create(createSettingsDto: CreateSettingsDto) {
    // Do not remove comment below.
    // <creating-property />
    const tenantObject = await this.tenantService.findById(
      createSettingsDto.tenant.id,
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

    const userObject = await this.userService.findById(
      createSettingsDto.user.id,
    );
    if (!userObject) {
      throw new UnprocessableEntityException({
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        errors: {
          user: 'notExists',
        },
      });
    }
    const user = userObject;

    return this.settingsRepository.create({
      // Do not remove comment below.
      // <creating-property-payload />
      config: createSettingsDto.config as SettingsConfig,

      settingsType: createSettingsDto.settingsType as SettingsType,

      subjectType: createSettingsDto.subjectType as SettingsSubjectType,

      tenant,

      user,
    });
  }

  findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }) {
    return this.settingsRepository.findAllWithPagination({
      paginationOptions: {
        page: paginationOptions.page,
        limit: paginationOptions.limit,
      },
    });
  }

  findById(id: Settings['id']) {
    return this.settingsRepository.findById(id);
  }

  findByIds(ids: Settings['id'][]) {
    return this.settingsRepository.findByIds(ids);
  }

  async update(
    id: Settings['id'],

    updateSettingsDto: UpdateSettingsDto,
  ) {
    // Do not remove comment below.
    // <updating-property />
    let tenant: Tenant | undefined = undefined;

    if (updateSettingsDto.tenant) {
      const tenantObject = await this.tenantService.findById(
        updateSettingsDto.tenant.id,
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

    let user: User | undefined = undefined;

    if (updateSettingsDto.user) {
      const userObject = await this.userService.findById(
        updateSettingsDto.user.id,
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
    }

    return this.settingsRepository.update(id, {
      // Do not remove comment below.
      // <updating-property-payload />
      config: updateSettingsDto.config as SettingsConfig,

      settingsType: updateSettingsDto.settingsType as SettingsType,

      subjectType: updateSettingsDto.subjectType as SettingsSubjectType,

      tenant,

      user,
    });
  }

  remove(id: Settings['id']) {
    return this.settingsRepository.remove(id);
  }
}
