import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RegionEntity } from '../../../../regions/infrastructure/persistence/relational/entities/region.entity';
import { TenantEntity } from '../../../../tenants/infrastructure/persistence/relational/entities/tenant.entity';

@Injectable()
export class RegionSeedService {
  private readonly logger = new Logger(RegionSeedService.name);

  constructor(
    @InjectRepository(RegionEntity)
    private readonly regionRepository: Repository<RegionEntity>,
    @InjectRepository(TenantEntity)
    private readonly tenantRepository: Repository<TenantEntity>,
  ) {}

  async run() {
    const tenants = await this.tenantRepository.find();

    if (tenants.length === 0) {
      this.logger.warn('No tenants found - skipping region seeding');
      return;
    }
    const regionsToCreate = tenants.map((tenant) =>
      this.createRegionForTenant(tenant),
    );

    try {
      await this.regionRepository.save(regionsToCreate);
      this.logger.log(
        `Successfully seeded regions for ${tenants.length} tenants`,
      );
    } catch (error) {
      this.logger.error('Failed to seed regions:', error.message);
    }
  }

  private createRegionForTenant(tenant: TenantEntity): RegionEntity {
    return this.regionRepository.create({
      name: `${tenant.name} Region`,
      boundary: {
        type: 'Polygon',
        coordinates: [
          [
            [36.8219, -1.2921],
            [36.895, -1.2921],
            [36.895, -1.2335],
            [36.8219, -1.2335],
            [36.8219, -1.2921],
          ],
        ],
      },
      centroidLat: -1.2628,
      centroidLon: 36.8584,
      serviceTypes: ['residential', 'commercial'],
      operatingHours: {
        days: ['mon-fri'],
        startTime: '08:00',
        endTime: '17:00',
      },
      zipCodes: ['00100', '00101'],
      tenant: tenant,
    });
  }
}
