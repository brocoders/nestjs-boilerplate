import { Tenant } from '../../tenants/domain/tenant';
import { User } from '../../users/domain/user';
import { ApiProperty } from '@nestjs/swagger';
import {
  KycStatus,
  KycSubjectType,
} from '../infrastructure/persistence/relational/entities/kyc-details.entity';

export class KycDetails {
  @ApiProperty({
    type: () => Number,
    nullable: true,
  })
  verifiedBy?: number | null;

  @ApiProperty({
    type: () => Date,
    nullable: true,
  })
  verifiedAt?: Date | null;

  @ApiProperty({
    type: () => Date,
    nullable: true,
  })
  submittedAt?: Date | null;

  @ApiProperty({
    enum: KycStatus,
    default: KycStatus.PENDING,
  })
  status: KycStatus;

  @ApiProperty({
    type: () => Object,
    nullable: true,
    example: {
      frontUrl: 'https://example.com/front.jpg',
      backUrl: 'https://example.com/back.jpg',
      expiryDate: '2023-12-31',
    },
  })
  documentData?: {
    frontUrl?: string;
    backUrl?: string;
    expiryDate?: Date;
  };

  @ApiProperty({
    type: () => String,
    nullable: true,
  })
  documentNumber?: string | null;

  @ApiProperty({
    type: () => String,
    nullable: true,
  })
  documentType?: string | null;

  @ApiProperty({
    enum: KycSubjectType,
  })
  subjectType: KycSubjectType;

  @ApiProperty({
    type: () => Tenant,
    nullable: false,
  })
  tenant: Tenant;

  @ApiProperty({
    type: () => User,
    nullable: false,
  })
  user: User;

  @ApiProperty({
    type: String,
  })
  id: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
