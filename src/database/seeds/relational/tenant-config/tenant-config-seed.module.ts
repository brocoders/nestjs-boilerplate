import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TenantConfigEntity } from '../../../../tenant-configs/infrastructure/persistence/relational/entities/tenant-config.entity';
import { TenantConfigSeedService } from './tenant-config-seed.service';

@Module({
  imports: [TypeOrmModule.forFeature([TenantConfigEntity])],
  providers: [TenantConfigSeedService],
  exports: [TenantConfigSeedService],
})
export class TenantConfigSeedModule {}
