import { Tenant } from '../../tenants/domain/tenant';
import { Type } from 'class-transformer';
import { IsOptional, IsArray, ValidateNested } from 'class-validator';
import { AuditLogEntry } from '../dto/audit-log-entry.dto';
import { User } from '../../users/domain/user';
import { ApiProperty } from '@nestjs/swagger';

export class CreditBalance {
  @ApiProperty({
    type: () => Tenant,
    nullable: false,
  })
  tenant: Tenant;

  @ApiProperty({
    type: () => [AuditLogEntry],
    required: false,
    nullable: true,
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AuditLogEntry)
  auditLog?: AuditLogEntry[] | null;

  @ApiProperty({
    type: () => Number,
    nullable: false,
  })
  amount: number;

  @ApiProperty({
    type: () => User,
    nullable: false,
  })
  customer: User;

  @ApiProperty({
    type: String,
  })
  id: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
