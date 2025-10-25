// -----------------------------------------------------------------------------
// CMC — Global Metrics DTOs (styled to your standards)
// Endpoints covered:
//   • GET /v1/global-metrics/quotes/latest
//   • GET /v1/global-metrics/quotes/historical
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
// GET /v1/global-metrics/quotes/latest
// -----------------------------------------------------------------------------

@Exclude()
export class CmcGlobalMetricsUsdQuoteLatestDto {
  @ApiProperty({
    description: 'Total crypto market capitalization in USD',
    type: Number,
    example: 2374432083905.6846,
  })
  @IsNumber()
  @Expose()
  total_market_cap!: number;

  @ApiProperty({
    description: 'Total 24h trading volume in USD (adjusted)',
    type: Number,
    example: 262906061281.24,
  })
  @IsNumber()
  @Expose()
  total_volume_24h!: number;

  @ApiProperty({
    description: 'Total 24h trading volume in USD (reported)',
    type: Number,
    example: 262906061281.24,
  })
  @IsNumber()
  @Expose()
  total_volume_24h_reported!: number;

  @ApiProperty({
    description: 'Altcoin market capitalization in USD (ex-BTC)',
    type: Number,
    example: 1305883846812.9905,
  })
  @IsNumber()
  @Expose()
  altcoin_market_cap!: number;

  @ApiProperty({
    description: 'Altcoin 24h trading volume in USD (adjusted)',
    type: Number,
    example: 195175095816.0813,
  })
  @IsNumber()
  @Expose()
  altcoin_volume_24h!: number;

  @ApiProperty({
    description: 'Altcoin 24h trading volume in USD (reported)',
    type: Number,
    example: 195175095816.0813,
  })
  @IsNumber()
  @Expose()
  altcoin_volume_24h_reported!: number;

  @ApiPropertyOptional({
    description: 'DeFi market cap in USD',
    type: Number,
    example: 131290122769.1664,
  })
  @IsOptional()
  @IsNumber()
  @Expose()
  defi_market_cap?: number;

  @ApiPropertyOptional({
    description: 'DeFi 24h trading volume in USD',
    type: Number,
    example: 20443320643.718483,
  })
  @IsOptional()
  @IsNumber()
  @Expose()
  defi_volume_24h?: number;

  @ApiPropertyOptional({
    description: 'DeFi 24h percentage change',
    type: Number,
    example: -17.648761478379,
  })
  @IsOptional()
  @IsNumber()
  @Expose()
  defi_24h_percentage_change?: number;

  @ApiPropertyOptional({
    description: 'Stablecoin market cap in USD',
    type: Number,
    example: 95606043432.70901,
  })
  @IsOptional()
  @IsNumber()
  @Expose()
  stablecoin_market_cap?: number;

  @ApiPropertyOptional({
    description: 'Stablecoin 24h trading volume in USD',
    type: Number,
    example: 209258420492.51562,
  })
  @IsOptional()
  @IsNumber()
  @Expose()
  stablecoin_volume_24h?: number;

  @ApiPropertyOptional({
    description: 'Stablecoin 24h percentage change',
    type: Number,
    example: 2.518312658305,
  })
  @IsOptional()
  @IsNumber()
  @Expose()
  stablecoin_24h_percentage_change?: number;

  @ApiPropertyOptional({
    description: 'Derivatives 24h trading volume in USD',
    type: Number,
    example: 282420341063.98895,
  })
  @IsOptional()
  @IsNumber()
  @Expose()
  derivatives_volume_24h?: number;

  @ApiPropertyOptional({
    description: 'Derivatives 24h trading volume (reported) in USD',
    type: Number,
    example: 282420341063.98895,
  })
  @IsOptional()
  @IsNumber()
  @Expose()
  derivatives_volume_24h_reported?: number;

  @ApiPropertyOptional({
    description: 'Derivatives 24h percentage change',
    type: Number,
    example: -13.893947771549,
  })
  @IsOptional()
  @IsNumber()
  @Expose()
  derivatives_24h_percentage_change?: number;

  @ApiPropertyOptional({
    description: 'Last updated time for the quote',
    type: String,
    format: 'date-time',
    example: '2021-05-06T01:45:17.999Z',
  })
  @IsOptional()
  @IsString()
  @IsDateString()
  @Expose()
  last_updated?: string;

  @ApiPropertyOptional({
    description: 'Yesterday’s total market cap in USD',
    type: Number,
    example: 2255175879567.3643,
  })
  @IsOptional()
  @IsNumber()
  @Expose()
  total_market_cap_yesterday?: number;

  @ApiPropertyOptional({
    description: 'Yesterday’s total volume 24h in USD',
    type: Number,
    example: 254911841723.5,
  })
  @IsOptional()
  @IsNumber()
  @Expose()
  total_volume_24h_yesterday?: number;

  @ApiPropertyOptional({
    description: 'Change vs yesterday for market cap (%)',
    type: Number,
    example: 5.288111025788297,
  })
  @IsOptional()
  @IsNumber()
  @Expose()
  total_market_cap_yesterday_percentage_change?: number;

  @ApiPropertyOptional({
    description: 'Change vs yesterday for volume 24h (%)',
    type: Number,
    example: 3.1360722607823135,
  })
  @IsOptional()
  @IsNumber()
  @Expose()
  total_volume_24h_yesterday_percentage_change?: number;
}

@Exclude()
export class CmcGlobalMetricsLatestDataDto {
  @ApiProperty({
    description: 'BTC market dominance (%)',
    type: Number,
    example: 45.002265776962,
  })
  @IsNumber()
  @Expose()
  btc_dominance!: number;

  @ApiProperty({
    description: 'ETH market dominance (%)',
    type: Number,
    example: 16.989007016505,
  })
  @IsNumber()
  @Expose()
  eth_dominance!: number;

  @ApiPropertyOptional({
    description: 'ETH dominance yesterday (%)',
    type: Number,
    example: 17.25405255,
  })
  @IsOptional()
  @IsNumber()
  @Expose()
  eth_dominance_yesterday?: number;

  @ApiPropertyOptional({
    description: 'BTC dominance yesterday (%)',
    type: Number,
    example: 45.41455043,
  })
  @IsOptional()
  @IsNumber()
  @Expose()
  btc_dominance_yesterday?: number;

  @ApiPropertyOptional({
    description: 'ETH dominance 24h percentage change',
    type: Number,
    example: -0.265045533495,
  })
  @IsOptional()
  @IsNumber()
  @Expose()
  eth_dominance_24h_percentage_change?: number;

  @ApiPropertyOptional({
    description: 'BTC dominance 24h percentage change',
    type: Number,
    example: -0.412284653038,
  })
  @IsOptional()
  @IsNumber()
  @Expose()
  btc_dominance_24h_percentage_change?: number;

  @ApiProperty({
    description: 'Number of active cryptocurrencies',
    type: Number,
    example: 4986,
  })
  @IsInt()
  @Min(0)
  @Expose()
  active_cryptocurrencies!: number;

  @ApiProperty({
    description: 'Total cryptocurrencies tracked',
    type: Number,
    example: 9607,
  })
  @IsInt()
  @Min(0)
  @Expose()
  total_cryptocurrencies!: number;

  @ApiProperty({
    description: 'Number of active market pairs',
    type: Number,
    example: 39670,
  })
  @IsInt()
  @Min(0)
  @Expose()
  active_market_pairs!: number;

  @ApiProperty({
    description: 'Number of active exchanges',
    type: Number,
    example: 372,
  })
  @IsInt()
  @Min(0)
  @Expose()
  active_exchanges!: number;

  @ApiProperty({
    description: 'Total exchanges tracked',
    type: Number,
    example: 1347,
  })
  @IsInt()
  @Min(0)
  @Expose()
  total_exchanges!: number;

  // DeFi / Stablecoin / Derivatives also surfaced at the top level in sample
  @ApiPropertyOptional({
    description: 'DeFi 24h trading volume in USD',
    type: Number,
    example: 20443320643.718483,
  })
  @IsOptional()
  @IsNumber()
  @Expose()
  defi_volume_24h?: number;

  @ApiPropertyOptional({
    description: 'DeFi 24h trading volume (reported) in USD',
    type: Number,
    example: 20443320643.718483,
  })
  @IsOptional()
  @IsNumber()
  @Expose()
  defi_volume_24h_reported?: number;

  @ApiPropertyOptional({
    description: 'DeFi market cap in USD',
    type: Number,
    example: 131290122769.1664,
  })
  @IsOptional()
  @IsNumber()
  @Expose()
  defi_market_cap?: number;

  @ApiPropertyOptional({
    description: 'Stablecoin 24h trading volume in USD',
    type: Number,
    example: 209258420492.51562,
  })
  @IsOptional()
  @IsNumber()
  @Expose()
  stablecoin_volume_24h?: number;

  @ApiPropertyOptional({
    description: 'Stablecoin 24h trading volume (reported) in USD',
    type: Number,
    example: 209258420492.51562,
  })
  @IsOptional()
  @IsNumber()
  @Expose()
  stablecoin_volume_24h_reported?: number;

  @ApiPropertyOptional({
    description: 'Stablecoin market cap in USD',
    type: Number,
    example: 95606043432.70901,
  })
  @IsOptional()
  @IsNumber()
  @Expose()
  stablecoin_market_cap?: number;

  @ApiPropertyOptional({
    description: 'Stablecoin 24h percentage change',
    type: Number,
    example: 2.518312658305,
  })
  @IsOptional()
  @IsNumber()
  @Expose()
  stablecoin_24h_percentage_change?: number;

  @ApiPropertyOptional({
    description: 'Derivatives 24h trading volume in USD',
    type: Number,
    example: 282420341063.98895,
  })
  @IsOptional()
  @IsNumber()
  @Expose()
  derivatives_volume_24h?: number;

  @ApiPropertyOptional({
    description: 'Derivatives 24h trading volume (reported) in USD',
    type: Number,
    example: 282420341063.98895,
  })
  @IsOptional()
  @IsNumber()
  @Expose()
  derivatives_volume_24h_reported?: number;

  @ApiPropertyOptional({
    description: 'Derivatives 24h percentage change',
    type: Number,
    example: -13.893947771549,
  })
  @IsOptional()
  @IsNumber()
  @Expose()
  derivatives_24h_percentage_change?: number;

  @ApiProperty({
    description: 'Quote metrics grouped by fiat/crypto (USD shown here)',
    type: () => CmcGlobalMetricsUsdQuoteLatestDto,
  })
  @ValidateNested()
  @Type(() => CmcGlobalMetricsUsdQuoteLatestDto)
  @Expose()
  quote!: CmcGlobalMetricsUsdQuoteLatestDto;

  @ApiProperty({
    description: 'Last updated time for the global metrics block',
    type: String,
    format: 'date-time',
    example: '2021-05-06T01:45:17.999Z',
  })
  @IsString()
  @IsDateString()
  @Expose()
  last_updated!: string;
}

@Exclude()
@ApiExtraModels(
  CmcGlobalMetricsUsdQuoteLatestDto,
  CmcGlobalMetricsLatestDataDto,
  CmcStatusDto,
)
export class CmcGlobalMetricsQuotesLatestDto extends CmcEnvelopeDto<CmcGlobalMetricsLatestDataDto> {
  @ApiProperty({ type: () => CmcGlobalMetricsLatestDataDto })
  @ValidateNested()
  @Type(() => CmcGlobalMetricsLatestDataDto)
  @Expose()
  data!: CmcGlobalMetricsLatestDataDto;

  @ApiProperty({ type: () => CmcStatusDto })
  @ValidateNested()
  @Type(() => CmcStatusDto)
  @Expose()
  status!: CmcStatusDto;
}

// -----------------------------------------------------------------------------
// GET /v1/global-metrics/quotes/historical
// -----------------------------------------------------------------------------

@Exclude()
export class CmcGlobalMetricsUsdQuoteHistoricalDto {
  @ApiProperty({
    description: 'Total crypto market capitalization in USD',
    type: Number,
    example: 292863223827.394,
  })
  @IsNumber()
  @Expose()
  total_market_cap!: number;

  @ApiProperty({
    description: 'Total 24h trading volume in USD (adjusted)',
    type: Number,
    example: 17692152629.7864,
  })
  @IsNumber()
  @Expose()
  total_volume_24h!: number;

  @ApiProperty({
    description: 'Total 24h trading volume in USD (reported)',
    type: Number,
    example: 375179000000,
  })
  @IsNumber()
  @Expose()
  total_volume_24h_reported!: number;

  @ApiProperty({
    description: 'Altcoin market capitalization in USD (ex-BTC)',
    type: Number,
    example: 187589500000,
  })
  @IsNumber()
  @Expose()
  altcoin_market_cap!: number;

  @ApiProperty({
    description: 'Altcoin 24h trading volume in USD (adjusted)',
    type: Number,
    example: 375179000000,
  })
  @IsNumber()
  @Expose()
  altcoin_volume_24h!: number;

  @ApiProperty({
    description: 'Altcoin 24h trading volume in USD (reported)',
    type: Number,
    example: 375179000000,
  })
  @IsNumber()
  @Expose()
  altcoin_volume_24h_reported!: number;

  @ApiProperty({
    description: 'Quote timestamp',
    type: String,
    format: 'date-time',
    example: '2018-07-31T00:02:00.000Z',
  })
  @IsString()
  @IsDateString()
  @Expose()
  timestamp!: string;
}

@Exclude()
export class CmcGlobalMetricsHistoricalPointDto {
  @ApiProperty({
    description: 'Point-in-time for this aggregate',
    type: String,
    format: 'date-time',
    example: '2018-07-31T00:02:00.000Z',
  })
  @IsString()
  @IsDateString()
  @Expose()
  timestamp!: string;

  @ApiProperty({
    description: 'BTC market dominance (%) at this time',
    type: Number,
    example: 47.9949,
  })
  @IsNumber()
  @Expose()
  btc_dominance!: number;

  @ApiProperty({
    description: 'Active cryptocurrencies at this time',
    type: Number,
    example: 2500,
  })
  @IsInt()
  @Min(0)
  @Expose()
  active_cryptocurrencies!: number;

  @ApiProperty({
    description: 'Active exchanges at this time',
    type: Number,
    example: 600,
  })
  @IsInt()
  @Min(0)
  @Expose()
  active_exchanges!: number;

  @ApiProperty({
    description: 'Active market pairs at this time',
    type: Number,
    example: 1000,
  })
  @IsInt()
  @Min(0)
  @Expose()
  active_market_pairs!: number;

  @ApiProperty({
    description: 'Quote metrics (USD) for this timestamp',
    type: () => CmcGlobalMetricsUsdQuoteHistoricalDto,
  })
  @ValidateNested()
  @Type(() => CmcGlobalMetricsUsdQuoteHistoricalDto)
  @Expose()
  quote!: CmcGlobalMetricsUsdQuoteHistoricalDto;
}

@Exclude()
export class CmcGlobalMetricsQuotesHistoricalDataDto {
  @ApiProperty({
    description: 'Historical aggregate points',
    type: () => [CmcGlobalMetricsHistoricalPointDto],
  })
  @ValidateNested({ each: true })
  @Type(() => CmcGlobalMetricsHistoricalPointDto)
  @Expose()
  quotes!: CmcGlobalMetricsHistoricalPointDto[];
}

@Exclude()
@ApiExtraModels(
  CmcGlobalMetricsUsdQuoteHistoricalDto,
  CmcGlobalMetricsHistoricalPointDto,
  CmcGlobalMetricsQuotesHistoricalDataDto,
  CmcStatusDto,
)
export class CmcGlobalMetricsQuotesHistoricalDto extends CmcEnvelopeDto<CmcGlobalMetricsQuotesHistoricalDataDto> {
  @ApiProperty({ type: () => CmcGlobalMetricsQuotesHistoricalDataDto })
  @ValidateNested()
  @Type(() => CmcGlobalMetricsQuotesHistoricalDataDto)
  @Expose()
  data!: CmcGlobalMetricsQuotesHistoricalDataDto;

  @ApiProperty({ type: () => CmcStatusDto })
  @ValidateNested()
  @Type(() => CmcStatusDto)
  @Expose()
  status!: CmcStatusDto;
}
