import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsOptional,
  IsString,
  Length,
  MinLength,
} from 'class-validator';

export class VendorSignupDto {
  @ApiProperty({ example: 'shop@example.com' })
  @IsEmail()
  email!: string;

  @ApiProperty({ example: 'Pass1234!' })
  @IsString()
  @MinLength(8)
  password!: string;

  @ApiProperty({ example: 'Sara' })
  @IsString()
  @Length(1, 64)
  firstName!: string;

  @ApiProperty({ example: 'Al-Faisal' })
  @IsString()
  @Length(1, 64)
  lastName!: string;

  @ApiProperty({ example: 'Sample Shop' })
  @IsString()
  @Length(2, 128)
  name!: string;

  @ApiProperty({ example: 'Curated home goods.', required: false })
  @IsOptional()
  @IsString()
  @Length(0, 1024)
  description?: string;
}
