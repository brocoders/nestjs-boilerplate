import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { KycDetailsEntity } from '../../../../kyc-details/infrastructure/persistence/relational/entities/kyc-details.entity';
import { KycDetailsSeedService } from './kyc-details-seed.service';

@Module({
  imports: [TypeOrmModule.forFeature([KycDetailsEntity])],
  providers: [KycDetailsSeedService],
  exports: [KycDetailsSeedService],
})
export class KycDetailsSeedModule {}
