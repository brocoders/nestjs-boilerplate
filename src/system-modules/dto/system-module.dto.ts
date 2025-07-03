import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class SystemModuleDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  id: string;
}
