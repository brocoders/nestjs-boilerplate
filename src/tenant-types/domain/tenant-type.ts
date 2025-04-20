import { ApiProperty } from '@nestjs/swagger';
import { TenantTypeCode } from '../infrastructure/persistence/relational/entities/tenant-type.entity';

export class TenantType {
  @ApiProperty({
    type: () => String,
    nullable: true,
  })
  description?: string | null;

  @ApiProperty({
    enum: TenantTypeCode,
    enumName: 'TenantTypeCode',
  })
  code: TenantTypeCode;

  @ApiProperty({
    type: () => String,
    nullable: true,
  })
  name?: string | null;

  @ApiProperty({
    type: String,
  })
  id: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
