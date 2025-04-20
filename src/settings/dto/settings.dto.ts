import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class SettingsDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  id: string;
}
