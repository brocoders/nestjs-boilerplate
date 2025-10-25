// -----------------------------------------------------------------------------
// CMC — Index DTOs (CMC20 / CMC100)
// Endpoints covered:
//   • GET /v3/index/cmc20-latest
//   • GET /v3/index/cmc20-historical
//   • GET /v3/index/cmc100-latest
//   • GET /v3/index/cmc100-historical
// -----------------------------------------------------------------------------

import { Exclude, Expose, Type } from 'class-transformer';
import {
  IsDateString,
  IsInt,
  IsNumber,
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
export class CmcIndexConstituentDto {
  @ApiProperty({ description: 'CMC asset id', type: Number, example: 1 })
  @IsInt()
  @Min(0)
  @Expose()
  id!: number;

  @ApiProperty({ description: 'Asset name', example: 'Bitcoin' })
  @IsString()
  @Expose()
  name!: string;

  @ApiProperty({ description: 'Asset ticker symbol', example: 'BTC' })
  @IsString()
  @Expose()
  symbol!: string;

  @ApiProperty({
    description: 'CMC profile URL (or info URL)',
    example: 'https://coinmarketcap.com/currencies/bitcoin/',
  })
  @IsString()
  @Expose()
  url!: string;

  @ApiProperty({
    description:
      'Constituent weight within the index (0..1 or percentage depending on CMC payload)',
    type: Number,
    example: 0.1543,
  })
  @IsNumber()
  @Expose()
  weight!: number;

  // Present in CMC20-latest sample
  @ApiPropertyOptional({
    description: 'Constituent price in USD (optional in some payloads)',
    type: Number,
    example: 63842.12,
  })
  @IsOptional()
  @IsNumber()
  @Expose()
  priceUsd?: number;

  // Present in CMC20-latest sample
  @ApiPropertyOptional({
    description: 'Units of the asset held/represented for index calculation',
    type: Number,
    example: 123.456789,
  })
  @IsOptional()
  @IsNumber()
  @Expose()
  units?: number;
}

// -----------------------------------------------------------------------------
// /v3/index/cmc20-historical & /v3/index/cmc100-historical
// -----------------------------------------------------------------------------

@Exclude()
export class CmcIndexHistoricalPointDto {
  @ApiProperty({
    description: 'Constituent breakdown at this snapshot',
    type: () => [CmcIndexConstituentDto],
  })
  @ValidateNested({ each: true })
  @Type(() => CmcIndexConstituentDto)
  @Expose()
  constituents!: CmcIndexConstituentDto[];

  @ApiProperty({
    description: 'Update date for this snapshot (UTC, date-only string)',
    type: String,
    example: '2025-09-26',
  })
  @IsString()
  @IsDateString()
  @Expose()
  update_time!: string;

  @ApiProperty({
    description: 'Index value at this snapshot',
    type: Number,
    example: 1234.5678,
  })
  @IsNumber()
  @Expose()
  value!: number;
}

@Exclude()
@ApiExtraModels(CmcIndexHistoricalPointDto, CmcStatusDto)
export class CmcIndexHistoricalDto extends CmcEnvelopeDto<
  CmcIndexHistoricalPointDto[]
> {
  @ApiProperty({
    description: 'Historical index data points (time series)',
    type: () => [CmcIndexHistoricalPointDto],
  })
  @ValidateNested({ each: true })
  @Type(() => CmcIndexHistoricalPointDto)
  @Expose()
  data!: CmcIndexHistoricalPointDto[];

  @ApiProperty({ type: () => CmcStatusDto })
  @ValidateNested()
  @Type(() => CmcStatusDto)
  @Expose()
  status!: CmcStatusDto;
}

// -----------------------------------------------------------------------------
// /v3/index/cmc20-latest & /v3/index/cmc100-latest
// -----------------------------------------------------------------------------

@Exclude()
export class CmcIndexLatestDataDto {
  @ApiProperty({
    description: 'Current constituent breakdown',
    type: () => [CmcIndexConstituentDto],
  })
  @ValidateNested({ each: true })
  @Type(() => CmcIndexConstituentDto)
  @Expose()
  constituents!: CmcIndexConstituentDto[];

  @ApiProperty({
    description: 'Last update date for the index (UTC, date-only string)',
    type: String,
    example: '2025-09-26',
  })
  @IsString()
  @IsDateString()
  @Expose()
  last_update!: string;

  @ApiProperty({
    description: 'Next scheduled update date (UTC, date-only string)',
    type: String,
    example: '2025-09-26',
  })
  @IsString()
  @IsDateString()
  @Expose()
  next_update!: string;

  @ApiProperty({
    description: 'Current index value',
    type: Number,
    example: 987.654,
  })
  @IsNumber()
  @Expose()
  value!: number;

  @ApiPropertyOptional({
    description: '24h percentage change of the index value',
    type: Number,
    example: -1.23,
  })
  @IsOptional()
  @IsNumber()
  @Expose()
  value_24h_percentage_change?: number;
}

@Exclude()
@ApiExtraModels(CmcIndexLatestDataDto, CmcStatusDto)
export class CmcIndexLatestDto extends CmcEnvelopeDto<CmcIndexLatestDataDto> {
  @ApiProperty({ type: () => CmcIndexLatestDataDto })
  @ValidateNested()
  @Type(() => CmcIndexLatestDataDto)
  @Expose()
  data!: CmcIndexLatestDataDto;

  @ApiProperty({ type: () => CmcStatusDto })
  @ValidateNested()
  @Type(() => CmcStatusDto)
  @Expose()
  status!: CmcStatusDto;
}
