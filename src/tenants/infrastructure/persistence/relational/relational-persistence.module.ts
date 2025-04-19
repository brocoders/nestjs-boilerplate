import { Module } from '@nestjs/common';
import { TenantRepository } from '../tenant.repository';
import { TenantRelationalRepository } from './repositories/tenant.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TenantEntity } from './entities/tenant.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TenantEntity])],
  providers: [
    {
      provide: TenantRepository,
      useClass: TenantRelationalRepository,
    },
  ],
  exports: [TenantRepository],
})
export class RelationalTenantPersistenceModule {}
