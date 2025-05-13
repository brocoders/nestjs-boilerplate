import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  TenantTypeCode,
  TenantTypeEntity,
} from 'src/tenant-types/infrastructure/persistence/relational/entities/tenant-type.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TenantTypesSeedService {
  constructor(
    @InjectRepository(TenantTypeEntity)
    private repository: Repository<TenantTypeEntity>,
  ) {}

  async run() {
    const tenantTypeDefinitions = [
      {
        code: TenantTypeCode.PLATFORM_OWNER,
        name: 'Platform Owner',
        description: 'Owner of the platfrorm',
      },
      {
        code: TenantTypeCode.COMMUNITY_GROUP,
        name: 'Community Group',
        description: 'Local community organizations managing waste collection',
      },
      {
        code: TenantTypeCode.RECYCLING_COMPANY,
        name: 'Recycling Company',
        description: 'Commercial recycling processing facilities',
      },
      {
        code: TenantTypeCode.COLLECTION_AGENCY,
        name: 'Collection Agency',
        description: 'Waste collection and transportation services',
      },
      {
        code: TenantTypeCode.MUNICIPALITY,
        name: 'Municipality',
        description: 'Local government waste management departments',
      },
    ];

    for (const typeDef of tenantTypeDefinitions) {
      const count = await this.repository.count({
        where: { code: typeDef.code },
      });

      if (!count) {
        await this.repository.save(
          this.repository.create({
            code: typeDef.code,
            name: typeDef.name,
            description: typeDef.description,
          }),
        );
      }
    }
  }
}
