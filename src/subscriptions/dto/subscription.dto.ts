import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class SubscriptionDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  id: string;
}
