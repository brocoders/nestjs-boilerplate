import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ExemptionEntity } from '../../../../exemptions/infrastructure/persistence/relational/entities/exemption.entity';
import { InvoiceEntity } from '../../../../invoices/infrastructure/persistence/relational/entities/invoice.entity';
import { RegionEntity } from '../../../../regions/infrastructure/persistence/relational/entities/region.entity';
import { ResidenceEntity } from '../../../../residences/infrastructure/persistence/relational/entities/residence.entity';
import { RoleEntity } from '../../../../roles/infrastructure/persistence/relational/entities/role.entity';
import { TenantEntity } from '../../../../tenants/infrastructure/persistence/relational/entities/tenant.entity';
import { UserEntity } from '../../../../users/infrastructure/persistence/relational/entities/user.entity';

@Injectable()
export class ExemptionSeedService {
  private readonly logger = new Logger(ExemptionSeedService.name);

  constructor(
    @InjectRepository(ExemptionEntity)
    private readonly repository: Repository<ExemptionEntity>,
    @InjectRepository(TenantEntity)
    private readonly tenantRepository: Repository<TenantEntity>,
    @InjectRepository(RegionEntity)
    private readonly regionRepository: Repository<RegionEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(ResidenceEntity)
    private readonly residenceRepository: Repository<ResidenceEntity>,
    @InjectRepository(InvoiceEntity)
    private readonly invoiceRepository: Repository<InvoiceEntity>,
    @InjectRepository(RoleEntity)
    private readonly roleRepository: Repository<RoleEntity>,
  ) {}

  async run() {
    const tenants = await this.tenantRepository.find();

    if (!tenants.length) {
      this.logger.warn('No tenants found. Skipping exemption seeding.');
      return;
    }

    for (const tenant of tenants) {
      await this.seedExemptionsForTenant(tenant);
    }
  }

  private async seedExemptionsForTenant(tenant: TenantEntity) {
    const existingExemptionCount = await this.repository.count({
      where: { tenant: { id: tenant.id } },
    });

    if (existingExemptionCount > 0) {
      this.logger.log(`Exemptions already exist for tenant: ${tenant.name}`);
      return;
    }

    // Fetch related entities
    const regions = await this.regionRepository.find({
      where: { tenant: { id: tenant.id } },
      take: 1,
    });

    const customerRole = await this.roleRepository.findOne({
      where: { name: 'Customer', tenant: { id: tenant.id } },
    });

    const customers = customerRole
      ? await this.userRepository.find({
          where: { tenant: { id: tenant.id }, role: { id: customerRole.id } },
          take: 1,
        })
      : [];

    const residences = await this.residenceRepository.find({
      where: { tenant: { id: tenant.id } },
      relations: ['occupants'],
      take: 1,
    });

    const invoices = await this.invoiceRepository.find({
      where: { tenant: { id: tenant.id } },
      take: 1,
    });

    const exemptions = this.getExemptionConfigurations(
      tenant,
      regions,
      customers,
      residences,
      invoices,
    );

    for (const exemption of exemptions) {
      await this.repository.save(this.repository.create(exemption));
      this.logger.log(`Created exemption for tenant: ${tenant.name}`);
    }
  }

  private getExemptionConfigurations(
    tenant: TenantEntity,
    regions: RegionEntity[],
    customers: UserEntity[],
    residences: ResidenceEntity[],
    invoices: InvoiceEntity[],
  ): Partial<ExemptionEntity>[] {
    const today = new Date();
    const nextMonth = new Date();
    nextMonth.setMonth(today.getMonth() + 1);

    const sixMonthsLater = new Date();
    sixMonthsLater.setMonth(today.getMonth() + 6);

    const oneYearLater = new Date();
    oneYearLater.setFullYear(today.getFullYear() + 1);

    return [
      // Global exemption for all customers
      {
        tenant,
        startDate: today,
        endDate: oneYearLater,
        reason: 'Government subsidy program for waste management',
        description: 'National environmental initiative exemption',
      },

      // Region-specific exemption
      ...(regions.length > 0
        ? [
            {
              tenant,
              region: regions[0],
              startDate: today,
              endDate: sixMonthsLater,
              reason: 'Regional development initiative',
              description: `Exemption for ${regions[0].name} development zone`,
            },
          ]
        : []),

      // Customer-specific exemption (hardship case)
      ...(customers.length > 0
        ? [
            {
              tenant,
              customer: customers[0],
              startDate: today,
              endDate: nextMonth,
              reason: 'Temporary financial hardship',
              description: 'Temporary relief for customer in need',
            },
          ]
        : []),

      // Residence-specific exemption (charity organization)
      ...(residences.length > 0
        ? [
            {
              tenant,
              residence: residences[0],
              startDate: today,
              endDate: oneYearLater,
              reason: 'Non-profit organization exemption',
              description: 'Full exemption for registered charity',
            },
          ]
        : []),

      // Invoice-specific exemption (correction)
      ...(invoices.length > 0
        ? [
            {
              tenant,
              invoice: invoices[0],
              startDate: today,
              endDate: today,
              reason: 'Billing system error correction',
              description: 'Invoice adjustment exemption',
            },
          ]
        : []),

      // Short-term environmental program
      {
        tenant,
        startDate: today,
        endDate: nextMonth,
        reason: 'Plastic recycling incentive program',
        description: 'Exemption for plastic recycling participants',
      },

      // Long-term strategic partnership
      {
        tenant,
        startDate: today,
        endDate: oneYearLater,
        reason: 'Corporate sustainability partnership',
        description: 'Exemption for strategic corporate partners',
      },

      // Educational institution exemption
      {
        tenant,
        startDate: new Date(new Date().getFullYear(), 7, 1), // September 1st
        endDate: new Date(new Date().getFullYear(), 11, 31), // December 31st
        reason: 'Educational institution support program',
        description: 'School semester exemption',
      },
    ];
  }
}
