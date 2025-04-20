import { Module } from '@nestjs/common';
import { TenantTypeRepository } from '../tenant-type.repository';
import { TenantTypeRelationalRepository } from './repositories/tenant-type.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TenantTypeEntity } from './entities/tenant-type.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TenantTypeEntity])],
  providers: [
    {
      provide: TenantTypeRepository,
      useClass: TenantTypeRelationalRepository,
    },
  ],
  exports: [TenantTypeRepository],
})
export class RelationalTenantTypePersistenceModule {}
