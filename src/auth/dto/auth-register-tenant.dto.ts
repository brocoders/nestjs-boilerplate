import { Type } from 'class-transformer';
import {
  IsEmail,
  IsNotEmpty,
  IsNotEmptyObject,
  IsOptional,
  IsString,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { TenantTypeDto } from '../../tenant-types/dto/tenant-type.dto';
import { ApiProperty } from '@nestjs/swagger/dist/decorators';

export class AuthRegisterTenantDto {
  @ApiProperty({ example: 'John' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'test1@example.com', type: String })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: '0700000000' })
  @IsString()
  @IsOptional()
  @MinLength(9)
  phone?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => TenantTypeDto)
  @IsNotEmptyObject()
  type?: TenantTypeDto | null;

  @ApiProperty()
  @MinLength(6)
  password: string;
}
