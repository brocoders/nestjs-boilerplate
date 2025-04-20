import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  KycDetailsSchema,
  KycDetailsSchemaClass,
} from './entities/kyc-details.schema';
import { KycDetailsRepository } from '../kyc-details.repository';
import { KycDetailsDocumentRepository } from './repositories/kyc-details.repository';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: KycDetailsSchemaClass.name, schema: KycDetailsSchema },
    ]),
  ],
  providers: [
    {
      provide: KycDetailsRepository,
      useClass: KycDetailsDocumentRepository,
    },
  ],
  exports: [KycDetailsRepository],
})
export class DocumentKycDetailsPersistenceModule {}
