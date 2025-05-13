import { Tenant } from '../../tenants/domain/tenant';
import { ApiProperty } from '@nestjs/swagger';
import { Allow } from 'class-validator';
import databaseConfig from '../../database/config/database.config';
import { DatabaseConfig } from '../../database/config/database-config.type';

// <database-block>
const idType = (databaseConfig() as DatabaseConfig).isDocumentDatabase
  ? String
  : Number;
// </database-block>

export class Role {
  @ApiProperty({
    type: () => Tenant,
    nullable: true,
  })
  tenant?: Tenant;

  @Allow()
  @ApiProperty({
    type: idType,
  })
  id: number | string;

  @Allow()
  @ApiProperty({
    type: String,
    example: 'admin',
  })
  name?: string;
}
