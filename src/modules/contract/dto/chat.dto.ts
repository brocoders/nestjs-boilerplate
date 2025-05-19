import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class ChatDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  question: string;
}
