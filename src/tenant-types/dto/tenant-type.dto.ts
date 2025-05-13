import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class TenantTypeDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  id: string;
}
