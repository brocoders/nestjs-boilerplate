import { Tenant } from '../../tenants/domain/tenant';
import { ApiProperty } from '@nestjs/swagger';

export class Region {
  @ApiProperty({
    type: () => String,
    nullable: true,
  })
  zipCodes?: string | null;

  @ApiProperty({
    type: () => String,
    nullable: true,
  })
  operatingHours?: string | null;

  @ApiProperty({
    type: () => String,
    nullable: true,
  })
  serviceTypes?: string | null;

  @ApiProperty({
    type: () => Number,
    nullable: true,
  })
  centroidLon?: number | null;

  @ApiProperty({
    type: () => String,
    nullable: true,
  })
  centroidLat?: string | null;

  @ApiProperty({
    type: () => String,
    nullable: true,
  })
  boundary?: string | null;

  @ApiProperty({
    type: () => String,
    nullable: true,
  })
  name?: string | null;

  @ApiProperty({
    type: () => Tenant,
    nullable: false,
  })
  tenant: Tenant;

  @ApiProperty({
    type: String,
  })
  id: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
