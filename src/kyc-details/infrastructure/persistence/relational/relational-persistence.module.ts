import { Module } from '@nestjs/common';
import { KycDetailsRepository } from '../kyc-details.repository';
import { KycDetailsRelationalRepository } from './repositories/kyc-details.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { KycDetailsEntity } from './entities/kyc-details.entity';

@Module({
  imports: [TypeOrmModule.forFeature([KycDetailsEntity])],
  providers: [
    {
      provide: KycDetailsRepository,
      useClass: KycDetailsRelationalRepository,
    },
  ],
  exports: [KycDetailsRepository],
})
export class RelationalKycDetailsPersistenceModule {}
