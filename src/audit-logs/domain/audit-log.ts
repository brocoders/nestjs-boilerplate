import { User } from '../../users/domain/user';
import { Tenant } from '../../tenants/domain/tenant';

import { ApiProperty } from '@nestjs/swagger';
import { AuditAction } from '../infrastructure/persistence/relational/entities/audit-log.entity';

export class AuditLog {
  @ApiProperty({
    type: () => User,
    nullable: true,
  })
  performedByUser?: User | null;

  @ApiProperty({
    type: () => Tenant,
    nullable: true,
  })
  performedByTenant?: Tenant | null;

  @ApiProperty({
    type: () => String,
    nullable: true,
  })
  status?: string | null;

  @ApiProperty({
    type: () => String,
    nullable: true,
  })
  description?: string | null;

  @ApiProperty({
    type: Object,
    nullable: true,
    description: 'State before the action',
    example: { email: 'old@example.com', status: 'pending' },
  })
  beforeState?: Record<string, any> | null;

  @ApiProperty({
    type: Object,
    nullable: true,
    description: 'State after the action',
    example: { email: 'new@example.com', status: 'active' },
  })
  afterState?: Record<string, any> | null;

  @ApiProperty({
    type: () => String,
    nullable: true,
  })
  entityId?: string | null;

  @ApiProperty({
    type: () => String,
    nullable: false,
  })
  entityType: string;

  @ApiProperty({
    enum: AuditAction,
    description: 'Action performed',
    example: AuditAction.CREATE,
  })
  action: AuditAction;

  @ApiProperty({
    type: String,
  })
  id: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
