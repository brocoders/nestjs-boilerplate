import { RegionsService } from '../regions/regions.service';
import { Region } from '../regions/domain/region';

import { SettingsService } from '../settings/settings.service';
import { Settings } from '../settings/domain/settings';

import { FilesService } from '../files/files.service';
import { FileType } from '../files/domain/file';

import { TenantTypesService } from '../tenant-types/tenant-types.service';
import { TenantType } from '../tenant-types/domain/tenant-type';

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
    @Inject(forwardRef(() => RegionsService))
    private readonly regionService: RegionsService,

    @Inject(forwardRef(() => SettingsService))
    private readonly settingsService: SettingsService,

    private readonly fileService: FilesService,

    private readonly tenantTypeService: TenantTypesService,

    @Inject(forwardRef(() => KycDetailsService))
    private readonly kycDetailsService: KycDetailsService,

    @Inject(forwardRef(() => UsersService))
    private readonly userService: UsersService,

    // Dependencies here
    private readonly tenantRepository: TenantRepository,
  ) {}
  //  private generateDbConfig(name: string): TenantConnectionConfig {
  //   const prefix = this.configService.get('database.tenantPrefix');
  //   return {
  //     id: uuidv4(),
  //     type: 'postgres',
  //     host: this.configService.get('database.tenantConfig.defaultHost'),
  //     port: this.configService.get('database.tenantConfig.defaultPort'),
  //     username: this.configService.get('database.tenantConfig.defaultUsername'),
  //     password: this.configService.get('database.tenantConfig.defaultPassword'),
  //     database: `${prefix}${name}`,
  //     schema: 'public'
  //   };
  // }

  // private async createDatabase(config: TenantConnectionConfig): Promise<void> {
  //     const adminDs = new DataSource({
  //       type: 'postgres',
  //       host: config.host,
  //       port: config.port,
  //       username: config.username,
  //       password: config.password
  //     });

  //     await adminDs.initialize();
  //     await adminDs.query(`CREATE DATABASE "${config.database}"`);
  //     await adminDs.destroy();
  //   }
  // }
  async create(createTenantDto: CreateTenantDto) {
    // Do not remove comment below.
    // <creating-property />

    let regions: Region[] | null | undefined = undefined;

    if (createTenantDto.regions) {
      const regionsObjects = await this.regionService.findByIds(
        createTenantDto.regions.map((entity) => entity.id),
      );
      if (regionsObjects.length !== createTenantDto.regions.length) {
        throw new UnprocessableEntityException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            regions: 'notExists',
          },
        });
      }
      regions = regionsObjects;
    } else if (createTenantDto.regions === null) {
      regions = null;
    }

    let settings: Settings[] | null | undefined = undefined;

    if (createTenantDto.settings) {
      const settingsObjects = await this.settingsService.findByIds(
        createTenantDto.settings.map((entity) => entity.id),
      );
      if (settingsObjects.length !== createTenantDto.settings.length) {
        throw new UnprocessableEntityException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            settings: 'notExists',
          },
        });
      }
      settings = settingsObjects;
    } else if (createTenantDto.settings === null) {
      settings = null;
    }

    let logo: FileType | null | undefined = undefined;

    if (createTenantDto.logo) {
      const logoObject = await this.fileService.findById(
        createTenantDto.logo.id,
      );
      if (!logoObject) {
        throw new UnprocessableEntityException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            logo: 'notExists',
          },
        });
      }
      logo = logoObject;
    } else if (createTenantDto.logo === null) {
      logo = null;
    }

    let type: TenantType | null | undefined = undefined;

    if (createTenantDto.type) {
      const typeObject = await this.tenantTypeService.findById(
        createTenantDto.type.id,
      );
      if (!typeObject) {
        throw new UnprocessableEntityException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            type: 'notExists',
          },
        });
      }
      type = typeObject;
    } else if (createTenantDto.type === null) {
      type = null;
    }

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

    // const dbConfig = this.generateDbConfig(name);

    // // Create database
    // await this.createDatabase(dbConfig);

    return this.tenantRepository.create({
      // Do not remove comment below.
      // <creating-property-payload />
      fullyOnboarded: createTenantDto.fullyOnboarded,

      databaseConfig: createTenantDto.databaseConfig,
      // databaseConfig: dbConfig,

      domain: createTenantDto.domain,

      regions,

      settings,

      schemaName: createTenantDto.schemaName,

      logo,

      address: createTenantDto.address,

      primaryPhone: createTenantDto.primaryPhone,

      primaryEmail: createTenantDto.primaryEmail,

      name: createTenantDto.name,

      type,

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

    let regions: Region[] | null | undefined = undefined;

    if (updateTenantDto.regions) {
      const regionsObjects = await this.regionService.findByIds(
        updateTenantDto.regions.map((entity) => entity.id),
      );
      if (regionsObjects.length !== updateTenantDto.regions.length) {
        throw new UnprocessableEntityException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            regions: 'notExists',
          },
        });
      }
      regions = regionsObjects;
    } else if (updateTenantDto.regions === null) {
      regions = null;
    }

    let settings: Settings[] | null | undefined = undefined;

    if (updateTenantDto.settings) {
      const settingsObjects = await this.settingsService.findByIds(
        updateTenantDto.settings.map((entity) => entity.id),
      );
      if (settingsObjects.length !== updateTenantDto.settings.length) {
        throw new UnprocessableEntityException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            settings: 'notExists',
          },
        });
      }
      settings = settingsObjects;
    } else if (updateTenantDto.settings === null) {
      settings = null;
    }

    let logo: FileType | null | undefined = undefined;

    if (updateTenantDto.logo) {
      const logoObject = await this.fileService.findById(
        updateTenantDto.logo.id,
      );
      if (!logoObject) {
        throw new UnprocessableEntityException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            logo: 'notExists',
          },
        });
      }
      logo = logoObject;
    } else if (updateTenantDto.logo === null) {
      logo = null;
    }

    let type: TenantType | null | undefined = undefined;

    if (updateTenantDto.type) {
      const typeObject = await this.tenantTypeService.findById(
        updateTenantDto.type.id,
      );
      if (!typeObject) {
        throw new UnprocessableEntityException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            type: 'notExists',
          },
        });
      }
      type = typeObject;
    } else if (updateTenantDto.type === null) {
      type = null;
    }

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
      fullyOnboarded: updateTenantDto.fullyOnboarded,

      databaseConfig: updateTenantDto.databaseConfig,

      domain: updateTenantDto.domain,

      regions,

      settings,

      schemaName: updateTenantDto.schemaName,

      logo,

      address: updateTenantDto.address,

      primaryPhone: updateTenantDto.primaryPhone,

      primaryEmail: updateTenantDto.primaryEmail,

      name: updateTenantDto.name,

      type,

      kycSubmissions,

      users,

      isActive: updateTenantDto.isActive,
    });
  }

  remove(id: Tenant['id']) {
    return this.tenantRepository.remove(id);
  }
}
