import { Tenant } from '../../tenants/domain/tenant';
import { User } from '../../users/domain/user';
import { ApiProperty } from '@nestjs/swagger';

export class KycDetails {
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
