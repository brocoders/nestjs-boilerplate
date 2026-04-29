import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  ArrayUnique,
  IsArray,
  IsInt,
  IsOptional,
  IsString,
  Length,
  Matches,
  Max,
  Min,
} from 'class-validator';

export class CreateShippingZoneDto {
  @ApiProperty({ example: 'Saudi Arabia — main cities' })
  @IsString()
  @Length(1, 64)
  name!: string;

  @ApiProperty({ type: [String], example: ['SA'] })
  @IsArray()
  @ArrayMinSize(1)
  @ArrayUnique()
  @Matches(/^[A-Z]{2}$/, {
    each: true,
    message:
      'each countryCode must be 2 uppercase letters (ISO 3166-1 alpha-2)',
  })
  countryCodes!: string[];

  @ApiPropertyOptional({ type: [String], example: [] })
  @IsOptional()
  @IsArray()
  @ArrayUnique()
  @IsString({ each: true })
  @Length(1, 64, { each: true })
  regionCodes?: string[];

  @ApiProperty({ example: '2500' })
  @IsString()
  @Matches(/^\d+$/, {
    message: 'costMinorUnits must be a non-negative integer (as a string)',
  })
  costMinorUnits!: string;

  @ApiProperty({ example: 'SAR' })
  @IsString()
  @Length(3, 3)
  @Matches(/^[A-Z]{3}$/, {
    message: 'currencyCode must be 3 uppercase letters (ISO 4217)',
  })
  currencyCode!: string;

  @ApiPropertyOptional({ example: '20000' })
  @IsOptional()
  @IsString()
  @Matches(/^\d+$/, {
    message: 'freeAboveMinorUnits must be a non-negative integer (as a string)',
  })
  freeAboveMinorUnits?: string;

  @ApiProperty({ example: 2 })
  @Type(() => Number)
  @IsInt()
  @Min(0)
  @Max(365)
  estDeliveryDaysMin!: number;

  @ApiProperty({ example: 5 })
  @Type(() => Number)
  @IsInt()
  @Min(0)
  @Max(365)
  estDeliveryDaysMax!: number;
}
