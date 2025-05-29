import {
  // decorators here

  IsString,
  IsOptional,
  IsEnum,
} from 'class-validator';

import {
  // decorators here
  ApiProperty,
} from '@nestjs/swagger';

import { AuditAction } from '../infrastructure/persistence/relational/entities/audit-log.entity';

export class CreateAuditLogDto {
  @ApiProperty({
    required: false,
    type: String,
    description: 'ID of user who performed the action',
    example: 'a1b2c3d4-e5f6-7890-g1h2-i3j4k5l6m7n8',
  })
  @IsOptional()
  @IsString()
  performedByUserId?: string | null;

  @ApiProperty({
    required: false,
    type: String,
    description: 'ID of tenant who performed the action',
    example: 't1e2n3a4n5t6-7890-id',
  })
  @IsOptional()
  @IsString()
  performedByTenantId?: string | null;

  @ApiProperty({
    required: false,
    type: () => String,
  })
  @IsOptional()
  @IsString()
  status?: string | null;

  @ApiProperty({
    required: false,
    type: () => String,
  })
  @IsOptional()
  @IsString()
  description?: string | null;

  @ApiProperty({
    required: false,
    type: Object,
    description: 'State before the action',
    example: { email: 'old@example.com' },
  })
  @IsOptional()
  beforeState?: Record<string, any> | null;

  @ApiProperty({
    required: false,
    type: Object,
    description: 'State after the action',
    example: { email: 'new@example.com' },
  })
  @IsOptional()
  afterState?: Record<string, any> | null;

  @ApiProperty({
    required: false,
    type: () => String,
  })
  @IsOptional()
  @IsString()
  entityId?: string | null;

  @ApiProperty({
    required: true,
    type: () => String,
  })
  @IsString()
  entityType: string;

  @ApiProperty({
    required: true,
    enum: AuditAction,
    description: 'Action performed',
    example: AuditAction.UPDATE,
  })
  @IsEnum(AuditAction)
  action: AuditAction;

  // Don't forget to use the class-validator decorators in the DTO properties.
}
