import { ApiProperty } from '@nestjs/swagger';
import {
  Allow,
  IsEmail,
  IsNotEmpty,
  MinLength,
  Validate,
} from 'class-validator';
import { IsNotExist } from '../utils/validators/is-not-exists.validator';
import { IsExist } from '../utils/validators/is-exists.validator';
import { FileEntity } from '../files/file.entity';
import { Tokens } from 'src/social/tokens';
import { AuthProvidersEnum } from './auth-providers.enum';

export class AuthEmailLoginDto {
  @ApiProperty({ example: 'test1@example.com' })
  @Validate(IsExist, ['User'], {
    message: 'emailNotExists',
  })
  email: string;

  @Allow()
  @ApiProperty()
  password: string;
}

export class AuthRegisterLoginDto {
  @ApiProperty({ example: 'test1@example.com' })
  @Validate(IsNotExist, ['User'], {
    message: 'emailAlreadyExists',
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

export class AuthSocialLoginDto {
  @Allow()
  @ApiProperty({ type: () => Tokens })
  tokens: Tokens;

  @ApiProperty({ enum: AuthProvidersEnum })
  @IsNotEmpty()
  socialType: AuthProvidersEnum;

  @Allow()
  @ApiProperty({ required: false })
  firstName?: string;

  @Allow()
  @ApiProperty({ required: false })
  lastName?: string;
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
    message: 'imageNotExists',
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
