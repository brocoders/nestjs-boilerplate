import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';
import { Transform } from 'class-transformer';

export class AuthForgotPasswordDto {
  @ApiProperty()
  @Transform((value: string) => value.toLowerCase())
  @IsEmail()
  email: string;
}
