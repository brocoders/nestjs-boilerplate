import { ApiPropertyOptional } from '@nestjs/swagger';
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

export class UpdateShippingZoneDto {
  @ApiPropertyOptional({ example: 'Saudi Arabia — main cities' })
  @IsOptional()
  @IsString()
  @Length(1, 64)
  name?: string;

  @ApiPropertyOptional({ type: [String], example: ['SA'] })
  @IsOptional()
  @IsArray()
  @ArrayMinSize(1)
  @ArrayUnique()
  @Matches(/^[A-Z]{2}$/, {
    each: true,
    message:
      'each countryCode must be 2 uppercase letters (ISO 3166-1 alpha-2)',
  })
  countryCodes?: string[];

  @ApiPropertyOptional({ type: [String], example: [] })
  @IsOptional()
  @IsArray()
  @ArrayUnique()
  @IsString({ each: true })
  @Length(1, 64, { each: true })
  regionCodes?: string[];

  @ApiPropertyOptional({ example: '2500' })
  @IsOptional()
  @IsString()
  @Matches(/^\d+$/, {
    message: 'costMinorUnits must be a non-negative integer (as a string)',
  })
  costMinorUnits?: string;

  @ApiPropertyOptional({ example: 'SAR' })
  @IsOptional()
  @IsString()
  @Length(3, 3)
  @Matches(/^[A-Z]{3}$/, {
    message: 'currencyCode must be 3 uppercase letters (ISO 4217)',
  })
  currencyCode?: string;

  @ApiPropertyOptional({ example: '20000', nullable: true })
  @IsOptional()
  @IsString()
  @Matches(/^\d+$/, {
    message: 'freeAboveMinorUnits must be a non-negative integer (as a string)',
  })
  freeAboveMinorUnits?: string | null;

  @ApiPropertyOptional({ example: 2 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  @Max(365)
  estDeliveryDaysMin?: number;

  @ApiPropertyOptional({ example: 5 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  @Max(365)
  estDeliveryDaysMax?: number;
}
