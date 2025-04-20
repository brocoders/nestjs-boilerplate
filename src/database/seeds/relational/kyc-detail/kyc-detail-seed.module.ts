import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { KycDetailSeedService } from './kyc-detail-seed.service';
import { KycDetailsEntity } from 'src/kyc-details/infrastructure/persistence/relational/entities/kyc-details.entity';

@Module({
  imports: [TypeOrmModule.forFeature([KycDetailsEntity])],
  providers: [KycDetailSeedService],
  exports: [KycDetailSeedService],
})
export class KycDetailSeedModule {}
