import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsOptional,
  IsString,
  Length,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

const trim = ({ value }: { value: unknown }): unknown =>
  typeof value === 'string' ? value.trim() : value;

const upper = ({ value }: { value: unknown }): unknown =>
  typeof value === 'string' ? value.trim().toUpperCase() : value;

export class AddressDto {
  @ApiProperty({ example: 'Layla Al-Mansour' })
  @Transform(trim)
  @IsString()
  @MinLength(2)
  @MaxLength(120)
  fullName!: string;

  @ApiProperty({ example: '+966555012345' })
  @Transform(trim)
  @IsString()
  @MinLength(5)
  @MaxLength(32)
  phone!: string;

  @ApiProperty({
    example: 'SA',
    description: 'ISO 3166-1 alpha-2 uppercase country code',
  })
  @Transform(upper)
  @IsString()
  @Matches(/^[A-Z]{2}$/)
  country!: string;

  @ApiPropertyOptional({ example: 'Riyadh', nullable: true })
  @IsOptional()
  @Transform(trim)
  @IsString()
  @MaxLength(80)
  region?: string | null;

  @ApiProperty({ example: 'Riyadh' })
  @Transform(trim)
  @IsString()
  @MinLength(1)
  @MaxLength(80)
  city!: string;

  @ApiPropertyOptional({ example: '12343', nullable: true })
  @IsOptional()
  @Transform(trim)
  @IsString()
  @MaxLength(20)
  postalCode?: string | null;

  @ApiProperty({ example: 'King Fahd Rd, Bldg 14, Apt 3' })
  @Transform(trim)
  @IsString()
  @Length(2, 200)
  street!: string;

  @ApiPropertyOptional({ example: 'Ring the upstairs bell.', nullable: true })
  @IsOptional()
  @Transform(trim)
  @IsString()
  @MaxLength(500)
  notes?: string | null;
}
