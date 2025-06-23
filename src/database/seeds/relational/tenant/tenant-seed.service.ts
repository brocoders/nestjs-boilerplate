import { Injectable, Logger } from '@nestjs/common';
import { TenantEntity } from '../../../../tenants/infrastructure/persistence/relational/entities/tenant.entity';
import { Repository } from 'typeorm';
import { TenantTypeEntity } from 'src/tenant-types/infrastructure/persistence/relational/entities/tenant-type.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { ModuleRef } from '@nestjs/core';
import { OnboardingsService } from '../../../../onboardings/onboardings.service';

@Injectable()
export class TenantSeedService {
  private readonly logger = new Logger(TenantSeedService.name);
  private onboardingsService: OnboardingsService; // Remove from constructor

  constructor(
    @InjectRepository(TenantEntity)
    private readonly tenantRepository: Repository<TenantEntity>,
    @InjectRepository(TenantTypeEntity)
    private readonly tenantTypeRepository: Repository<TenantTypeEntity>,
    private readonly moduleRef: ModuleRef, // Inject ModuleRef instead
  ) {}

  async run() {
    // Get all tenant types from database
    const tenantTypes = await this.tenantTypeRepository.find();

    for (const tenantType of tenantTypes) {
      // Check if tenant already exists for this type
      const existingTenant = await this.tenantRepository.findOne({
        where: { type: { id: tenantType.id } },
      });

      let tenant: TenantEntity;

      if (!existingTenant) {
        const tenantName = `${tenantType.name} Tenant`;
        tenant = await this.tenantRepository.save(
          this.tenantRepository.create({
            name: tenantName,
            type: tenantType,
            domain: tenantName.toLowerCase().replace(/\s+/g, '-'),
            address: `${tenantName} Address`,
            primaryEmail: `contact@${tenantName.toLowerCase().replace(/\s+/g, '-')}.com`,
            primaryPhone: '+1234567890',
            isActive: true,
            fullyOnboarded: false,
            schemaName: `tenant_${tenantType.code.toLowerCase()}`,
            databaseConfig: {
              host: process.env.DATABASE_HOST || 'localhost',
              port: parseInt(process.env.DATABASE_PORT || '5432', 10),
              username: process.env.DATABASE_USERNAME || 'tenant_user',
              password: process.env.DATABASE_PASSWORD || 'secure_password',
              database:
                process.env.DATABASE_HOST ||
                `tenant_${tenantType.code.toLowerCase()}`, // use schema as db name
            },
          }),
        );

        this.logger.log(`Created tenant: ${tenantName}`);
      } else {
        tenant = existingTenant;
        this.logger.log(`Using existing tenant: ${tenant.name}`);
      }

      // Initialize tenant onboarding if not already done
      // await this.initializeTenantOnboarding(tenant);
    }
  }

  // private async initializeTenantOnboarding(tenant: TenantEntity) {
  //   try {
  //     if (!this.onboardingsService) {
  //       this.onboardingsService = await this.moduleRef.get(OnboardingsService);
  //     }
  //     // Check if onboarding already exists
  //     const onboardingStatus =
  //       await this.onboardingsService.getOnboardingStatus(
  //         OnboardingEntityType.TENANT,
  //         tenant.id,
  //       );

  //     if (onboardingStatus.steps.length === 0) {
  //       // await this.onboardingsService.initializeTenantOnboarding(tenant.id);
  //       this.logger.log(`Initialized onboarding for tenant: ${tenant.name}`);
  //     } else {
  //       this.logger.log(`Onboarding already exists for tenant: ${tenant.name}`);
  //     }
  //   } catch (error) {
  //     this.logger.error(
  //       `Failed to initialize onboarding for tenant ${tenant.name}: ${error.message}`,
  //     );
  //   }
  // }
}
