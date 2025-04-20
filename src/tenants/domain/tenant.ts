import { Region } from '../../regions/domain/region';
import { Settings } from '../../settings/domain/settings';
import { FileType } from '../../files/domain/file';
import { TenantType } from '../../tenant-types/domain/tenant-type';
import { KycDetails } from '../../kyc-details/domain/kyc-details';
import { User } from '../../users/domain/user';
import { ApiProperty } from '@nestjs/swagger';

export class Tenant {
  @ApiProperty({
    type: () => [Region],
    nullable: true,
  })
  regions?: Region[] | null;

  @ApiProperty({
    type: () => [Settings],
    nullable: true,
  })
  settings?: Settings[] | null;

  @ApiProperty({
    type: () => String,
    nullable: true,
  })
  schemaName?: string | null;

  @ApiProperty({
    type: () => FileType,
    nullable: true,
  })
  logo?: FileType | null;

  @ApiProperty({
    type: () => String,
    nullable: true,
  })
  address?: string | null;

  @ApiProperty({
    type: () => String,
    nullable: true,
  })
  primaryPhone?: string | null;

  @ApiProperty({
    type: () => String,
    nullable: true,
  })
  primaryEmail?: string | null;

  @ApiProperty({
    type: () => String,
    nullable: true,
  })
  name?: string | null;

  @ApiProperty({
    type: () => TenantType,
    nullable: true,
  })
  type?: TenantType | null;

  @ApiProperty({
    type: () => [KycDetails],
    nullable: true,
  })
  kycSubmissions?: KycDetails[] | null;

  @ApiProperty({
    type: () => [User],
    nullable: true,
  })
  users?: User[] | null;

  @ApiProperty({
    type: () => Boolean,
    nullable: false,
  })
  isActive?: boolean;

  @ApiProperty({
    type: String,
  })
  id: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
