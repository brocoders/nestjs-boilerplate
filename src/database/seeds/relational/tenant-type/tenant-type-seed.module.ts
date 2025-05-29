import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TenantTypeEntity } from '../../../../tenant-types/infrastructure/persistence/relational/entities/tenant-type.entity';
import { TenantTypeSeedService } from './tenant-type-seed.service';

@Module({
  imports: [TypeOrmModule.forFeature([TenantTypeEntity])],
  providers: [TenantTypeSeedService],
  exports: [TenantTypeSeedService],
})
export class TenantTypeSeedModule {}
