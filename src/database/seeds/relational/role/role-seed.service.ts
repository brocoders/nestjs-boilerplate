import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RoleEntity } from '../../../../roles/infrastructure/persistence/relational/entities/role.entity';
import { RoleEnum } from '../../../../roles/roles.enum';
import { TenantEntity } from 'src/tenants/infrastructure/persistence/relational/entities/tenant.entity';

@Injectable()
export class RoleSeedService {
  constructor(
    @InjectRepository(RoleEntity)
    private readonly roleRepository: Repository<RoleEntity>,
    @InjectRepository(TenantEntity)
    private readonly tenantRepository: Repository<TenantEntity>,
  ) {}

  async run() {
    const rolesToSeed = [
      { code: RoleEnum.platform_owner, name: 'Platform Owner' },
      { code: RoleEnum.admin, name: 'Admin' },
      { code: RoleEnum.agent, name: 'Agent' },
      { code: RoleEnum.customer, name: 'Customer' },
      { code: RoleEnum.manager, name: 'Manager' },
      { code: RoleEnum.finance, name: 'Finance' },
      { code: RoleEnum.guest, name: 'Guest' },
      { code: RoleEnum.user, name: 'User' },
    ];

    const tenants = await this.tenantRepository.find();

    for (const tenant of tenants) {
      for (const roleDef of rolesToSeed) {
        const existingRole = await this.roleRepository.findOne({
          where: {
            id: roleDef.code,
            tenant: { id: tenant.id },
          },
        });

        if (!existingRole) {
          await this.roleRepository.save(
            this.roleRepository.create({
              id: roleDef.code,
              name: roleDef.name,
              tenant,
            }),
          );
        }
      }
    }
  }
}
