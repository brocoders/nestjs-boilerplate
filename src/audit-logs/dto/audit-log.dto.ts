import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class AuditLogDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  id: string;
}
