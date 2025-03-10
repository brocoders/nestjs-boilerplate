import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class DeviceDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  id: string;
}
