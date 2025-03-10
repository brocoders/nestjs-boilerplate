import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class NotificationDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  id: string;
}
