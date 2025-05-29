import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TenantEntity } from '../../../../tenants/infrastructure/persistence/relational/entities/tenant.entity';
import { VendorEntity } from '../../../../vendors/infrastructure/persistence/relational/entities/vendor.entity';

@Injectable()
export class VendorSeedService {
  private readonly logger = new Logger(VendorSeedService.name);

  constructor(
    @InjectRepository(VendorEntity)
    private readonly repository: Repository<VendorEntity>,
    @InjectRepository(TenantEntity)
    private readonly tenantRepository: Repository<TenantEntity>,
  ) {}

  async run() {
    const tenants = await this.tenantRepository.find();

    if (!tenants.length) {
      this.logger.warn('No tenants found. Skipping vendor seeding.');
      return;
    }

    for (const tenant of tenants) {
      await this.seedVendorsForTenant(tenant);
    }
  }

  private async seedVendorsForTenant(tenant: TenantEntity) {
    const existingVendorCount = await this.repository.count({
      where: { tenant: { id: tenant.id } },
    });

    if (existingVendorCount > 0) {
      this.logger.log(`Vendors already exist for tenant: ${tenant.name}`);
      return;
    }

    const vendors = this.getVendorConfigurations(tenant);

    for (const vendor of vendors) {
      const createdVendor = await this.repository.save(
        this.repository.create(vendor),
      );
      this.logger.log(
        `Created vendor '${createdVendor.name}' for tenant: ${tenant.name}`,
      );
    }
  }

  private getVendorConfigurations(
    tenant: TenantEntity,
  ): Partial<VendorEntity>[] {
    return [
      {
        tenant,
        name: 'Waste Management Inc.',
        contactEmail: 'billing@wastemgmt.com',
        paymentTerms: 'Net 30',
      },
      {
        tenant,
        name: 'Recycling Solutions LLC',
        contactEmail: 'accounts@recyclingsolutions.com',
        paymentTerms: 'Net 15',
      },
      {
        tenant,
        name: 'Green Disposal Services',
        contactEmail: 'payments@greendisposal.com',
        paymentTerms: 'Due on receipt',
      },
      {
        tenant,
        name: 'Eco Collection Partners',
        contactEmail: 'finance@ecocollection.com',
        paymentTerms: 'Net 45',
      },
      {
        tenant,
        name: 'Sustainable Waste Systems',
        contactEmail: 'ar@sustainablewaste.com',
        paymentTerms: 'Net 30',
      },
      {
        tenant,
        name: 'Hazardous Material Handlers',
        contactEmail: 'billing@hazmatpros.com',
        paymentTerms: '50% advance, 50% on completion',
      },
      {
        tenant,
        name: 'Organic Waste Recyclers',
        contactEmail: 'accounting@organics.com',
        paymentTerms: 'Net 30',
      },
      {
        tenant,
        name: 'Industrial Waste Solutions',
        contactEmail: 'invoices@industrialwaste.com',
        paymentTerms: 'Net 60',
      },
    ];
  }
}
