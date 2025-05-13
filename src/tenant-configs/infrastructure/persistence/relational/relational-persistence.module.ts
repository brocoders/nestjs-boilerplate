import { Module } from '@nestjs/common';
import { TenantConfigRepository } from '../tenant-config.repository';
import { TenantConfigRelationalRepository } from './repositories/tenant-config.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TenantConfigEntity } from './entities/tenant-config.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TenantConfigEntity])],
  providers: [
    {
      provide: TenantConfigRepository,
      useClass: TenantConfigRelationalRepository,
    },
  ],
  exports: [TenantConfigRepository],
})
export class RelationalTenantConfigPersistenceModule {}
