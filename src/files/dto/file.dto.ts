import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
//import { TenantEntity } from '../../tenants/infrastructure/persistence/relational/entities/tenant.entity';

export class FileDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  id: string;

  path: string;
  // tenant?: TenantEntity | null;
}
