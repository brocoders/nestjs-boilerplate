import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import bcrypt from 'bcryptjs';
import { RoleEnum } from '../../../../roles/roles.enum';
import { StatusEnum } from '../../../../statuses/statuses.enum';
import { UserEntity } from '../../../../users/infrastructure/persistence/relational/entities/user.entity';
import { TenantEntity } from '../../../../tenants/infrastructure/persistence/relational/entities/tenant.entity';
import { RegionEntity } from '../../../../regions/infrastructure/persistence/relational/entities/region.entity';
import { RoleEntity } from '../../../../roles/infrastructure/persistence/relational/entities/role.entity';

@Injectable()
export class UserSeedService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(TenantEntity)
    private readonly tenantRepository: Repository<TenantEntity>,
    @InjectRepository(RegionEntity)
    private readonly regionRepository: Repository<RegionEntity>,
    @InjectRepository(RoleEntity)
    private readonly roleRepository: Repository<RoleEntity>,
  ) {}

  async run() {
    const tenants = await this.tenantRepository.find({
      relations: ['roles'],
    });

    for (const tenant of tenants) {
      const roles = await this.roleRepository.find({
        where: { tenant: { id: tenant.id } },
      });

      for (const role of roles) {
        await this.createUserForRole(tenant, role);
      }
    }
  }

  private async createUserForRole(tenant: TenantEntity, role: RoleEntity) {
    const existingUser = await this.userRepository.findOne({
      where: {
        tenant: { id: tenant.id },
        role: { id: role.id },
      },
    });

    if (!existingUser) {
      const salt = await bcrypt.genSalt();
      const password = await bcrypt.hash('secret', salt);
      const userData = this.buildUserData(tenant, role, password);

      if (role.id === RoleEnum.agent) {
        const regions = await this.regionRepository.find({
          where: { tenant: { id: tenant.id } },
          take: 2, // Assign first 2 regions
        });
        userData.regions = regions;
      }

      await this.userRepository.save(userData);
    }
  }

  private buildUserData(
    tenant: TenantEntity,
    role: RoleEntity,
    password: string,
  ): Partial<UserEntity> {
    const roleName = role.name || '';
    const baseUser = {
      firstName: roleName,
      lastName: 'User',
      email: `${roleName.toLowerCase()}.${(tenant?.name || '').toLowerCase().replace(/\s+/g, '')}@example.com`,
      password,
      tenant,
      role,
      status: { id: StatusEnum.active },
    };

    return this.userRepository.create(baseUser);
  }
}
