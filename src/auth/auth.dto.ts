import { ApiProperty } from '@nestjs/swagger';
import {
  Allow,
  IsEmail,
  IsNotEmpty,
  MinLength,
  Validate,
} from 'class-validator';
import { IsNotExist } from '../utils/is-not-exists.validator';
import { IsExist } from '../utils/is-exists.validator';
import { FileEntity } from '../files/file.entity';

export class AuthEmailLoginDto {
  @ApiProperty({ example: 'test1@example.com' })
  @Validate(IsExist, ['User'], {
    message: 'An account with this email not exists',
  })
  email: string;

  @Allow()
  @ApiProperty()
  password: string;
}

export class AuthRegisterLoginDto {
  @ApiProperty({ example: 'test1@example.com' })
  @Validate(IsNotExist, ['User'], {
    message: 'An account with this email already exists',
  })
  @IsEmail()
  email: string;

  @ApiProperty()
  @MinLength(6)
  password: string;

  @ApiProperty({ example: 'John' })
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({ example: 'Doe' })
  @IsNotEmpty()
  lastName: string;
}

export class AuthForgotPasswordDto {
  @ApiProperty()
  @IsEmail()
  email: string;
}

export class AuthConfirmEmailDto {
  @ApiProperty()
  @IsNotEmpty()
  hash: string;
}

export class AuthResetPasswordDto {
  @ApiProperty()
  @IsNotEmpty()
  password: string;

  @ApiProperty()
  @IsNotEmpty()
  hash: string;
}

export class AuthUpdateDto {
  @Validate(IsExist, ['FileEntity', 'id'], {
    message: 'Image not exists',
  })
  @ApiProperty({ type: () => FileEntity })
  photo?: FileEntity;

  @ApiProperty({ example: 'John' })
  @IsNotEmpty()
  firstName?: string;

  @ApiProperty({ example: 'Doe' })
  @IsNotEmpty()
  lastName?: string;

  @ApiProperty()
  @IsNotEmpty()
  @MinLength(6)
  password?: string;
}
