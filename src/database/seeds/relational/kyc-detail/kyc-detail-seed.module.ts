import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { KycDetailSeedService } from './kyc-detail-seed.service';
import { KycDetailsEntity } from 'src/kyc-details/infrastructure/persistence/relational/entities/kyc-details.entity';
import { UserEntity } from 'src/users/infrastructure/persistence/relational/entities/user.entity';
import { TenantEntity } from 'src/tenants/infrastructure/persistence/relational/entities/tenant.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([KycDetailsEntity, UserEntity, TenantEntity]),
  ],
  providers: [KycDetailSeedService],
  exports: [KycDetailSeedService],
})
export class KycDetailSeedModule {}
