import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TenantTypesSeedService } from './tenant-types-seed.service';
import { TenantTypeEntity } from 'src/tenant-types/infrastructure/persistence/relational/entities/tenant-type.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TenantTypeEntity])],
  providers: [TenantTypesSeedService],
  exports: [TenantTypesSeedService],
})
export class TenantTypesSeedModule {}
