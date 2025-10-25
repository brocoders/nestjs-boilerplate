// -----------------------------------------------------------------------------
// CMC — Fiat DTOs
// Endpoints covered:
//   • GET /v1/fiat/map → list of supported fiat currencies
// -----------------------------------------------------------------------------

import { Exclude, Expose, Type } from 'class-transformer';
import {
  IsBoolean,
  IsDateString,
  IsInt,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';
import {
  ApiExtraModels,
  ApiProperty,
  ApiPropertyOptional,
} from '@nestjs/swagger';

import { CmcEnvelopeDto, CmcStatusDto } from './cmc-base.response.dto';

// -----------------------------------------------------------------------------
// Shared DTOs
// -----------------------------------------------------------------------------

@Exclude()
export class CmcFiatMapItemDto {
  @ApiProperty({
    description: 'Fiat currency ID in CMC system',
    type: Number,
    example: 2781,
  })
  @IsInt()
  @Min(1)
  @Expose()
  id!: number;

  @ApiProperty({
    description: 'Fiat currency name',
    type: String,
    example: 'United States Dollar',
  })
  @IsString()
  @Expose()
  name!: string;

  @ApiProperty({
    description: 'Fiat currency symbol',
    type: String,
    example: 'USD',
  })
  @IsString()
  @Expose()
  symbol!: string;

  @ApiPropertyOptional({
    description: 'Slug/SEO identifier for fiat currency',
    type: String,
    example: 'united-states-dollar',
  })
  @IsOptional()
  @IsString()
  @Expose()
  slug?: string;

  @ApiProperty({
    description: 'Sign for the fiat currency',
    type: String,
    example: '$',
  })
  @IsString()
  @Expose()
  sign!: string;

  @ApiProperty({
    description: 'Rank order of fiat currency in CMC listing',
    type: Number,
    example: 1,
  })
  @IsInt()
  @Min(1)
  @Expose()
  sort_order!: number;

  @ApiProperty({
    description: 'Whether this fiat is active in CMC system',
    type: Boolean,
    example: true,
  })
  @IsBoolean()
  @Expose()
  is_active!: boolean;

  @ApiProperty({
    description: 'Date when fiat was added to CMC',
    type: String,
    format: 'date-time',
    example: '2013-04-28T00:00:00.000Z',
  })
  @IsString()
  @IsDateString()
  @Expose()
  first_historical_data!: string;

  @ApiPropertyOptional({
    description: 'Date of last historical update',
    type: String,
    format: 'date-time',
    example: '2025-09-20T10:20:31.178Z',
  })
  @IsOptional()
  @IsString()
  @IsDateString()
  @Expose()
  last_historical_data?: string;
}

// -----------------------------------------------------------------------------
// GET /v1/fiat/map
// -----------------------------------------------------------------------------

@Exclude()
@ApiExtraModels(CmcFiatMapItemDto, CmcStatusDto)
export class CmcFiatMapDto extends CmcEnvelopeDto<CmcFiatMapItemDto[]> {
  @ApiProperty({
    type: () => [CmcFiatMapItemDto],
    description: 'Array of supported fiat currencies',
  })
  @ValidateNested({ each: true })
  @Type(() => CmcFiatMapItemDto)
  @Expose()
  data!: CmcFiatMapItemDto[];

  @ApiProperty({ type: () => CmcStatusDto })
  @ValidateNested()
  @Type(() => CmcStatusDto)
  @Expose()
  status!: CmcStatusDto;
}
