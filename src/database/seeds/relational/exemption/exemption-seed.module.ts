import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExemptionEntity } from '../../../../exemptions/infrastructure/persistence/relational/entities/exemption.entity';
import { TenantEntity } from '../../../../tenants/infrastructure/persistence/relational/entities/tenant.entity';
import { RegionEntity } from '../../../../regions/infrastructure/persistence/relational/entities/region.entity';
import { UserEntity } from '../../../../users/infrastructure/persistence/relational/entities/user.entity';
import { ResidenceEntity } from '../../../../residences/infrastructure/persistence/relational/entities/residence.entity';
import { InvoiceEntity } from '../../../../invoices/infrastructure/persistence/relational/entities/invoice.entity';
import { RoleEntity } from '../../../../roles/infrastructure/persistence/relational/entities/role.entity';
import { ExemptionSeedService } from './exemption-seed.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ExemptionEntity,
      TenantEntity,
      RegionEntity,
      UserEntity,
      ResidenceEntity,
      InvoiceEntity,
      RoleEntity,
    ]),
  ],
  providers: [ExemptionSeedService],
  exports: [ExemptionSeedService],
})
export class ExemptionSeedModule {}
