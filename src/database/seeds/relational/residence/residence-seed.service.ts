import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ResidenceEntity } from '../../../../residences/infrastructure/persistence/relational/entities/residence.entity';
import { TenantEntity } from '../../../../tenants/infrastructure/persistence/relational/entities/tenant.entity';
import { RegionEntity } from '../../../../regions/infrastructure/persistence/relational/entities/region.entity';
import { UserEntity } from '../../../../users/infrastructure/persistence/relational/entities/user.entity';
import { RoleEntity } from '../../../../roles/infrastructure/persistence/relational/entities/role.entity';
import { ResidenceType } from '../../../../utils/enum/residence-type.enum';

@Injectable()
export class ResidenceSeedService {
  private readonly logger = new Logger(ResidenceSeedService.name);

  constructor(
    @InjectRepository(ResidenceEntity)
    private readonly residenceRepository: Repository<ResidenceEntity>,
    @InjectRepository(TenantEntity)
    private readonly tenantRepository: Repository<TenantEntity>,
    @InjectRepository(RegionEntity)
    private readonly regionRepository: Repository<RegionEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(RoleEntity)
    private readonly roleRepository: Repository<RoleEntity>,
  ) {}

  async run() {
    const tenants = await this.tenantRepository.find();
    if (!tenants.length) {
      this.logger.warn('No tenants found. Skipping residence seeding.');
      return;
    }

    for (const tenant of tenants) {
      const regions = await this.regionRepository.find({
        where: { tenant: { id: tenant.id } },
      });

      if (!regions.length) {
        this.logger.warn(`No regions found for tenant: ${tenant.name}`);
        continue;
      }

      const customerRole = await this.roleRepository.findOne({
        where: {
          name: 'Customer',
          tenant: { id: tenant.id },
        },
      });

      if (!customerRole) {
        this.logger.warn(`No 'Customer' role found for tenant: ${tenant.name}`);
        continue;
      }

      const customers = await this.userRepository.find({
        where: {
          tenant: { id: tenant.id },
          role: { id: customerRole.id },
        },
        relations: ['role'], // Required if lazy loading or role not eager
      });

      if (!customers.length) {
        this.logger.warn(`No customers found for tenant: ${tenant.name}`);
      }

      for (const region of regions) {
        const existingResidences = await this.residenceRepository.find({
          where: {
            tenant: { id: tenant.id },
            region: { id: region.id },
          },
        });

        if (existingResidences.length === 0) {
          const residence = this.residenceRepository.create({
            name: `${region.name} Main Residence`,
            type: ResidenceType.OTHER,
            charge: 1000,
            isActive: true,
            region,
            tenant,
            occupants: customers,
          });

          await this.residenceRepository.save(residence);
          this.logger.log(
            `Seeded residence '${residence.name}' for tenant '${tenant.name}' in region '${region.name}' with ${customers.length} occupants.`,
          );
        }
      }
    }
  }
}
