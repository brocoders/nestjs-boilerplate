import { ApiProperty } from '@nestjs/swagger';

export class TenantConfig {
  @ApiProperty({
    type: () => String,
    nullable: false,
  })
  value: string;

  @ApiProperty({
    type: () => String,
    nullable: false,
  })
  key: string;

  @ApiProperty({
    type: () => String,
    nullable: false,
  })
  tenantId: string;

  @ApiProperty({
    type: String,
  })
  id: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
