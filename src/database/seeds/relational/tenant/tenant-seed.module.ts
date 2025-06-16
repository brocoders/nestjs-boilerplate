import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TenantEntity } from '../../../../tenants/infrastructure/persistence/relational/entities/tenant.entity';
import { TenantSeedService } from './tenant-seed.service';
import { TenantTypeEntity } from 'src/tenant-types/infrastructure/persistence/relational/entities/tenant-type.entity';
import { OnboardingsModule } from 'src/onboardings/onboardings.module'; // Add this import

@Module({
  imports: [
    TypeOrmModule.forFeature([TenantTypeEntity, TenantEntity]),
    forwardRef(() => OnboardingsModule),
  ],
  providers: [TenantSeedService],
  exports: [TenantSeedService],
})
export class TenantSeedModule {}
