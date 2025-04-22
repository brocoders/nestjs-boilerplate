import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TenantEntity } from '../../../../tenants/infrastructure/persistence/relational/entities/tenant.entity';
import { TenantSeedService } from './tenant-seed.service';
import { TenantTypeEntity } from 'src/tenant-types/infrastructure/persistence/relational/entities/tenant-type.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TenantEntity, TenantTypeEntity])],
  providers: [TenantSeedService],
  exports: [TenantSeedService],
})
export class TenantSeedModule {}
