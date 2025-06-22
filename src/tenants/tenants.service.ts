import * as crypto from 'crypto';
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
import { Onboarding } from '../onboardings/domain/onboarding';
import { ConfigService } from '@nestjs/config';
import { AllConfigType } from '../config/config.type';
import { AuditLogsService } from '../audit-logs/audit-logs.service';
import { OnboardingsService } from '../onboardings/onboardings.service';
import { AuditAction } from '../audit-logs/infrastructure/persistence/relational/entities/audit-log.entity';
// import { AuditLogsService } from '../audit-logs/audit-logs.service';
// import { AuditAction } from '../audit-logs/infrastructure/persistence/relational/entities/audit-log.entity';
// import { OnboardingsService } from '../onboardings/onboardings.service';

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

    private configService: ConfigService<AllConfigType>,

    @Inject(forwardRef(() => AuditLogsService))
    private readonly auditService: AuditLogsService,

    @Inject(forwardRef(() => OnboardingsService))
    private readonly onboardingService: OnboardingsService,

    // Dependencies here
    private readonly tenantRepository: TenantRepository,
  ) {}
  private generateDbConfig(schemaName: string) {
    const dbConfig = this.configService.get('database', { infer: true });
    return {
      host: dbConfig?.host || 'localhost',
      port: dbConfig?.port || 5432,
      type: dbConfig?.type || 'postgres',
      // username: dbConfig?.username || 'postgres',
      // password: dbConfig?.password || 'postgres',
      // database: dbConfig?.database || 'postgres',
      username: dbConfig?.username || `${schemaName}_user`,
      password: dbConfig?.password || crypto.randomBytes(12).toString('hex'),
      database: `${schemaName}_db`,
      schema: schemaName,
    };
  }
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
    let onboardingSteps: Onboarding[] | null | undefined = undefined;
    console.log('createTenantDto', createTenantDto);
    if (createTenantDto.onboardingSteps) {
      const onboardingStepsObjects = await this.onboardingService.findByIds(
        createTenantDto.onboardingSteps.map((entity) => entity.id),
      );
      if (
        onboardingStepsObjects.length !== createTenantDto.onboardingSteps.length
      ) {
        throw new UnprocessableEntityException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            onboardingSteps: 'notExists',
          },
        });
      }
      onboardingSteps = onboardingStepsObjects;
    } else if (createTenantDto.onboardingSteps === null) {
      onboardingSteps = null;
    }

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

    let schemaName = createTenantDto.schemaName;
    if (!schemaName) {
      const baseName = (createTenantDto.name ?? 'tenant')
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '_')
        .substring(0, 20);
      const uniqueSuffix = crypto.randomBytes(4).toString('hex');
      schemaName = `${baseName}_${uniqueSuffix}`;
    }

    const dbConfig = this.generateDbConfig(schemaName);

    // // Create database
    // await this.createDatabase(dbConfig);

    const newTenant = this.tenantRepository.create({
      // Do not remove comment below.
      // <creating-property-payload />
      onboardingSteps,
      fullyOnboarded: createTenantDto.fullyOnboarded,

      databaseConfig: dbConfig,

      domain: createTenantDto.domain,

      regions,

      settings,

      schemaName,

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

    //Initialize onboarding
    // await this.onboardingService.initializeTenantOnboarding(
    //   (await newTenant).id,
    // );
    // Initialize tenant database
    // await TenantDataSource.getTenantDataSource((await newTenant).id);
    //Audit log
    await this.auditService.logEvent(
      AuditAction.CREATE,
      'tenant',
      (await newTenant).id,
      { tenantId: (await newTenant).id },
      undefined,
      newTenant,
      'Tenant created',
    );
    // console.log('data', newTenant);
    return newTenant;
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
    let onboardingSteps: Onboarding[] | null | undefined = undefined;

    if (updateTenantDto.onboardingSteps) {
      const onboardingStepsObjects = await this.onboardingService.findByIds(
        updateTenantDto.onboardingSteps.map((entity) => entity.id),
      );
      if (
        onboardingStepsObjects.length !== updateTenantDto.onboardingSteps.length
      ) {
        throw new UnprocessableEntityException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            onboardingSteps: 'notExists',
          },
        });
      }
      onboardingSteps = onboardingStepsObjects;
    } else if (updateTenantDto.onboardingSteps === null) {
      onboardingSteps = null;
    }

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
      onboardingSteps,
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
