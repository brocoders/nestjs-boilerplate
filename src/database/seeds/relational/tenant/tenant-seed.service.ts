import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TenantEntity } from '../../../../tenants/infrastructure/persistence/relational/entities/tenant.entity';
import { Repository } from 'typeorm';
import { TenantTypeEntity } from 'src/tenant-types/infrastructure/persistence/relational/entities/tenant-type.entity';

@Injectable()
export class TenantSeedService {
  constructor(
    @InjectRepository(TenantEntity)
    private readonly tenantRepository: Repository<TenantEntity>,
    @InjectRepository(TenantTypeEntity)
    private readonly tenantTypeRepository: Repository<TenantTypeEntity>,
  ) {}

  async run() {
    // Get all tenant types from database
    const tenantTypes = await this.tenantTypeRepository.find();

    for (const tenantType of tenantTypes) {
      // Check if tenant already exists for this type
      const existingTenant = await this.tenantRepository.findOne({
        where: { type: { id: tenantType.id } },
      });

      if (!existingTenant) {
        const tenantName = `${tenantType.name} Tenant`;

        await this.tenantRepository.save(
          this.tenantRepository.create({
            name: tenantName,
            type: tenantType,
            domain: tenantName.toLowerCase().replace(/\s+/g, '-'),
            address: `${tenantName} Address`,
            primaryEmail: `contact@${tenantName.toLowerCase().replace(/\s+/g, '-')}.com`,
            primaryPhone: '+1234567890',
            isActive: true,
            schemaName: `tenant_${tenantType.code.toLowerCase()}`,
          }),
        );
      }
    }
  }
}
