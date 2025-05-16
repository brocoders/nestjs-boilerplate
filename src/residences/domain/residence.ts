import { User } from '../../users/domain/user';
import { Region } from '../../regions/domain/region';
import { Tenant } from '../../tenants/domain/tenant';
import { ApiProperty } from '@nestjs/swagger';
import { ResidenceType } from '../../utils/enum/residence-type.enum';

export class Residence {
  @ApiProperty({
    enum: ResidenceType,
    enumName: 'ResidenceType',
    nullable: false,
  })
  type: ResidenceType;

  @ApiProperty({
    type: () => [User],
    nullable: true,
  })
  occupants?: User[] | null;

  @ApiProperty({
    type: () => Region,
    nullable: false,
  })
  region: Region;

  @ApiProperty({
    type: () => Tenant,
    nullable: false,
  })
  tenant: Tenant;

  @ApiProperty({
    type: () => Boolean,
    nullable: false,
  })
  isActive: boolean;

  @ApiProperty({
    type: () => Number,
    nullable: false,
  })
  charge: number;

  @ApiProperty({
    type: () => String,
    nullable: false,
  })
  name: string;

  @ApiProperty({
    type: String,
  })
  id: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
