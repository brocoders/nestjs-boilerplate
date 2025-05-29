import { Tenant } from '../../tenants/domain/tenant';
import { Invoice } from '../../invoices/domain/invoice';
import { Residence } from '../../residences/domain/residence';
import { Region } from '../../regions/domain/region';
import { User } from '../../users/domain/user';
import { ApiProperty } from '@nestjs/swagger';

export class Exemption {
  @ApiProperty({
    type: () => String,
    nullable: true,
  })
  description?: string | null;

  @ApiProperty({
    type: () => Tenant,
    nullable: false,
  })
  tenant: Tenant;

  @ApiProperty({
    type: () => Invoice,
    nullable: true,
  })
  invoice?: Invoice | null;

  @ApiProperty({
    type: () => Residence,
    nullable: true,
  })
  residence?: Residence | null;

  @ApiProperty({
    type: () => Region,
    nullable: true,
  })
  region?: Region | null;

  @ApiProperty({
    type: () => User,
    nullable: true,
  })
  customer?: User | null;

  @ApiProperty({
    type: () => Date,
    nullable: false,
  })
  endDate: Date;

  @ApiProperty({
    type: () => Date,
    nullable: false,
  })
  startDate: Date;

  @ApiProperty({
    type: () => String,
    nullable: true,
  })
  reason?: string | null;

  @ApiProperty({
    type: String,
  })
  id: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
