import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class RoleDto {
  @ApiProperty()
  @IsNumber()
  id: number | string;
}
