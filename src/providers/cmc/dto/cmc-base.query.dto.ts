// src/providers/cmc/dto/cmc-query.dto.ts
// -----------------------------------------------------------------------------
// CoinMarketCap — Query DTOs (composed with inheritance for reuse)
// -----------------------------------------------------------------------------

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Exclude, Expose, Transform } from 'class-transformer';
import {
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
  Min,
} from 'class-validator';

// -----------------------------------------------------------------------------
// Shared fragments
// -----------------------------------------------------------------------------

@Exclude()
export class CmcPagingQueryDto {
  @ApiPropertyOptional({
    description: 'Pagination start (1-indexed)',
    example: 1,
    minimum: 1,
  })
  @Transform(({ value }) => (value !== undefined ? Number(value) : undefined))
  @IsOptional()
  @IsInt()
  @Min(1)
  @Expose()
  start?: number;

  @ApiPropertyOptional({
    description: 'Number of results to return',
    example: 100,
    minimum: 1,
  })
  @Transform(({ value }) => (value !== undefined ? Number(value) : undefined))
  @IsOptional()
  @IsInt()
  @Min(1)
  @Expose()
  limit?: number;
}

@Exclude()
export class CmcIdSymbolQueryDto {
  @ApiPropertyOptional({
    description: 'CSV of CMC IDs (e.g., 1,1027)',
    example: '1,1027',
  })
  @IsOptional()
  @IsString()
  @Expose()
  id?: string;

  @ApiPropertyOptional({
    description: 'CSV of symbols (e.g., BTC,ETH)',
    example: 'BTC,ETH',
  })
  @IsOptional()
  @IsString()
  @Expose()
  symbol?: string;

  @ApiPropertyOptional({
    description: 'CSV of slugs (e.g., bitcoin,ethereum)',
    example: 'bitcoin,ethereum',
  })
  @IsOptional()
  @IsString()
  @Expose()
  slug?: string;
}

@Exclude()
export class CmcConvertQueryDto {
  @ApiPropertyOptional({
    description: 'Convert to these symbols (CSV)',
    example: 'USD,EUR',
  })
  @Transform(
    ({ value }) => (value === undefined || value === null ? 'USD' : value),
    { toClassOnly: true },
  )
  @IsOptional()
  @IsString()
  @Expose()
  convert?: string;

  @ApiPropertyOptional({
    description: 'Convert to these IDs (CSV)',
    example: '2781',
  })
  @IsOptional()
  @IsString()
  @Expose()
  convert_id?: string;
}

@Exclude()
export class CmcTimeRangeQueryDto {
  @ApiPropertyOptional({
    description: 'Start time (ISO8601 or UNIX seconds)',
    example: '2019-01-01T00:00:00Z',
  })
  @IsOptional()
  @IsString()
  @Expose()
  time_start?: string;

  @ApiPropertyOptional({
    description: 'End time (ISO8601 or UNIX seconds)',
    example: '2019-02-01T00:00:00Z',
  })
  @IsOptional()
  @IsString()
  @Expose()
  time_end?: string;

  @ApiPropertyOptional({
    description: 'Interval (e.g., 1m,5m,15m,1h,4h,1d,1w)',
    example: '1d',
    pattern: '^\\d+[mhdw]$',
  })
  @IsOptional()
  @IsString()
  @Matches(/^\d+[mhdw]$/)
  @Expose()
  interval?: string;
}

@Exclude()
export class CmcCountQueryDto {
  @ApiPropertyOptional({
    description: 'Number of data points to return (when interval is used)',
    example: 100,
  })
  @Transform(({ value }) => (value !== undefined ? Number(value) : undefined))
  @IsOptional()
  @IsInt()
  @Min(1)
  @Expose()
  count?: number;
}

@Exclude()
export class CmcAuxQueryDto {
  @ApiPropertyOptional({
    description: 'CSV of optional fields to include',
    example: 'platform,notice,tags',
  })
  @IsOptional()
  @IsString()
  @Expose()
  aux?: string;
}

@Exclude()
export class CmcSortDirQueryDto {
  @ApiPropertyOptional({
    description: 'Sort direction',
    enum: ['asc', 'desc'],
    example: 'desc',
  })
  @IsOptional()
  @IsEnum(['asc', 'desc'])
  @Expose()
  sort_dir?: 'asc' | 'desc';
}

@Exclude()
export class CmcLimitOnlyQueryDto {
  @ApiPropertyOptional({
    description: 'Number of results to return',
    example: 10,
    minimum: 1,
  })
  @Transform(({ value }) => (value !== undefined ? Number(value) : undefined))
  @IsOptional()
  @IsInt()
  @Min(1)
  @Expose()
  limit?: number;
}

// Trending (used directly by controller already)
@Exclude()
export class CmcTrendingQueryDto {
  @ApiPropertyOptional({
    description: 'Offset for paginated results',
    example: 1,
    minimum: 1,
  })
  @Transform(({ value }) => (value !== undefined ? Number(value) : undefined))
  @IsOptional()
  @IsInt()
  @Min(1)
  @Expose()
  start?: number;

  @ApiPropertyOptional({
    description: 'Number of results to return',
    example: 10,
    minimum: 1,
  })
  @Transform(({ value }) => (value !== undefined ? Number(value) : undefined))
  @IsOptional()
  @IsInt()
  @Min(1)
  @Expose()
  limit?: number;

  @ApiPropertyOptional({
    description: 'Convert to this symbol(s)',
    example: 'USD',
  })
  @IsOptional()
  @IsString()
  @Expose()
  convert?: string;
}

// -----------------------------------------------------------------------------
// Global Metrics
// -----------------------------------------------------------------------------

@Exclude()
export class CmcGlobalMetricsQueryDto extends CmcConvertQueryDto {}

@Exclude()
export class CmcGlobalMetricsHistoricalQueryDto
  extends CmcConvertQueryDto
  implements Partial<CmcTimeRangeQueryDto>, Partial<CmcCountQueryDto>
{
  @ApiPropertyOptional({
    description: 'Start time (ISO/UNIX)',
    example: '2019-01-01T00:00:00Z',
  })
  @IsOptional()
  @IsString()
  @Expose()
  time_start?: string;

  @ApiPropertyOptional({
    description: 'End time (ISO/UNIX)',
    example: '2019-02-01T00:00:00Z',
  })
  @IsOptional()
  @IsString()
  @Expose()
  time_end?: string;

  @ApiPropertyOptional({ description: 'Interval (e.g., 1d,1w)', example: '1d' })
  @IsOptional()
  @IsString()
  @Matches(/^\d+[mhdw]$/)
  @Expose()
  interval?: string;

  @ApiPropertyOptional({ description: 'Number of points', example: 100 })
  @Transform(({ value }) => (value !== undefined ? Number(value) : undefined))
  @IsOptional()
  @IsInt()
  @Min(1)
  @Expose()
  count?: number;
}

// -----------------------------------------------------------------------------
// Tools — Price Conversion
// -----------------------------------------------------------------------------

@Exclude()
export class CmcPriceConversionBaseQueryDto extends CmcConvertQueryDto {
  @ApiProperty({ description: 'Amount to convert', example: 1.23 })
  @Transform(({ value }) => Number(value))
  @IsNumber()
  @Expose()
  amount!: number;

  @ApiPropertyOptional({ description: 'Source CMC ID(s) (CSV)', example: '1' })
  @IsOptional()
  @IsString()
  @Expose()
  id?: string;

  @ApiPropertyOptional({
    description: 'Source symbol(s) (CSV)',
    example: 'BTC',
  })
  @IsOptional()
  @IsString()
  @Expose()
  symbol?: string;
}

@Exclude()
export class CmcPriceConversionV1QueryDto extends CmcPriceConversionBaseQueryDto {}

@Exclude()
export class CmcPriceConversionV2QueryDto extends CmcPriceConversionBaseQueryDto {}

// -----------------------------------------------------------------------------
// Fiat
// -----------------------------------------------------------------------------

@Exclude()
export class CmcFiatMapQueryDto extends CmcPagingQueryDto {}

// -----------------------------------------------------------------------------
// Blockchain
// -----------------------------------------------------------------------------

@Exclude()
export class CmcBlockchainStatisticsLatestQueryDto extends CmcIdSymbolQueryDto {}

// -----------------------------------------------------------------------------
// Fear & Greed
// -----------------------------------------------------------------------------

@Exclude()
export class CmcFearAndGreedHistoricalQueryDto extends CmcLimitOnlyQueryDto {
  @ApiPropertyOptional({
    description: 'Start time (ISO or UNIX seconds)',
    example: '2023-01-01',
  })
  @IsOptional()
  @IsString()
  @Expose()
  time_start?: string;

  @ApiPropertyOptional({
    description: 'End time (ISO or UNIX seconds)',
    example: '2023-12-31',
  })
  @IsOptional()
  @IsString()
  @Expose()
  time_end?: string;
}

// -----------------------------------------------------------------------------
// Index (CMC20 / CMC100) — historical
// -----------------------------------------------------------------------------

@Exclude()
export class CmcIndexHistoricalQueryDto extends CmcLimitOnlyQueryDto {
  @ApiPropertyOptional({
    description: 'Start date (YYYY-MM-DD)',
    example: '2024-01-01',
  })
  @IsOptional()
  @IsString()
  @Expose()
  time_start?: string;

  @ApiPropertyOptional({
    description: 'End date (YYYY-MM-DD)',
    example: '2024-03-01',
  })
  @IsOptional()
  @IsString()
  @Expose()
  time_end?: string;
}

// -----------------------------------------------------------------------------
// Cryptocurrency (v1)
// -----------------------------------------------------------------------------

@Exclude()
export class CmcCryptoMapQueryDto
  extends CmcPagingQueryDto
  implements Partial<CmcAuxQueryDto>
{
  @ApiPropertyOptional({
    description: 'Listing status',
    enum: ['active', 'inactive', 'untracked', 'unverified'],
  })
  @IsOptional()
  @IsEnum(['active', 'inactive', 'untracked', 'unverified'])
  @Expose()
  listing_status?: 'active' | 'inactive' | 'untracked' | 'unverified';

  @ApiPropertyOptional({
    description: 'Sort by',
    enum: ['cmc_rank', 'id', 'market_cap', 'name', 'symbol'],
  })
  @IsOptional()
  @IsEnum(['cmc_rank', 'id', 'market_cap', 'name', 'symbol'])
  @Expose()
  sort?: 'cmc_rank' | 'id' | 'market_cap' | 'name' | 'symbol';

  @ApiPropertyOptional({
    description: 'Filter by symbols (CSV)',
    example: 'BTC,ETH',
  })
  @IsOptional()
  @IsString()
  @Expose()
  symbol?: string;

  @ApiPropertyOptional({
    description: 'Aux fields CSV',
    example: 'platform,notice',
  })
  @IsOptional()
  @IsString()
  @Expose()
  aux?: string;
}

@Exclude()
export class CmcCryptoInfoQueryDto extends CmcIdSymbolQueryDto {}

@Exclude()
export class CmcCryptoListingsLatestQueryDto
  extends CmcPagingQueryDto
  implements Partial<CmcConvertQueryDto>, Partial<CmcSortDirQueryDto>
{
  @ApiPropertyOptional({
    description: 'Convert to these symbols (CSV)',
    example: 'USD',
  })
  @IsOptional()
  @IsString()
  @Expose()
  convert?: string;

  @ApiPropertyOptional({
    description: 'Sort field',
    enum: [
      'market_cap',
      'name',
      'symbol',
      'price',
      'volume_24h',
      'percent_change_24h',
    ],
  })
  @IsOptional()
  @IsEnum([
    'market_cap',
    'name',
    'symbol',
    'price',
    'volume_24h',
    'percent_change_24h',
  ])
  @Expose()
  sort?:
    | 'market_cap'
    | 'name'
    | 'symbol'
    | 'price'
    | 'volume_24h'
    | 'percent_change_24h';

  @ApiPropertyOptional({
    description: 'Sort direction',
    enum: ['asc', 'desc'],
    example: 'desc',
  })
  @IsOptional()
  @IsEnum(['asc', 'desc'])
  @Expose()
  sort_dir?: 'asc' | 'desc';

  @ApiPropertyOptional({
    description: 'Type',
    enum: ['all', 'coins', 'tokens'],
    example: 'all',
  })
  @IsOptional()
  @IsEnum(['all', 'coins', 'tokens'])
  @Expose()
  cryptocurrency_type?: 'all' | 'coins' | 'tokens';
}

@Exclude()
export class CmcCryptoListingsHistoricalQueryDto
  extends CmcPagingQueryDto
  implements Partial<CmcConvertQueryDto>
{
  @ApiProperty({
    description: 'Snapshot date/time (ISO8601)',
    example: '2021-01-01T00:00:00Z',
  })
  @IsString()
  @Expose()
  date!: string;

  @ApiPropertyOptional({
    description: 'Convert to these symbols (CSV)',
    example: 'USD',
  })
  @IsOptional()
  @IsString()
  @Expose()
  convert?: string;
}

@Exclude()
export class CmcCryptoQuotesLatestV1QueryDto
  extends CmcIdSymbolQueryDto
  implements Partial<CmcConvertQueryDto>
{
  @ApiPropertyOptional({
    description: 'Convert to these symbols (CSV)',
    example: 'USD',
  })
  @IsOptional()
  @IsString()
  @Expose()
  convert?: string;
}

@Exclude()
export class CmcCryptoQuotesHistoricalV1QueryDto
  extends CmcIdSymbolQueryDto
  implements
    Partial<CmcConvertQueryDto>,
    Partial<CmcTimeRangeQueryDto>,
    Partial<CmcCountQueryDto>
{
  @ApiPropertyOptional({
    description: 'Convert to these symbols (CSV)',
    example: 'USD',
  })
  @IsOptional()
  @IsString()
  @Expose()
  convert?: string;

  @ApiPropertyOptional({
    description: 'Start time (ISO/UNIX)',
    example: '2020-01-01',
  })
  @IsOptional()
  @IsString()
  @Expose()
  time_start?: string;

  @ApiPropertyOptional({
    description: 'End time (ISO/UNIX)',
    example: '2020-06-01',
  })
  @IsOptional()
  @IsString()
  @Expose()
  time_end?: string;

  @ApiPropertyOptional({ description: 'Interval', example: '1d' })
  @IsOptional()
  @IsString()
  @Matches(/^\d+[mhdw]$/)
  @Expose()
  interval?: string;

  @ApiPropertyOptional({ description: 'Number of points', example: 100 })
  @Transform(({ value }) => (value !== undefined ? Number(value) : undefined))
  @IsOptional()
  @IsInt()
  @Min(1)
  @Expose()
  count?: number;
}

@Exclude()
export class CmcCryptoMarketPairsLatestV1QueryDto
  extends CmcPagingQueryDto
  implements Partial<CmcConvertQueryDto>
{
  @ApiPropertyOptional({
    description: 'Crypto ID(s) to fetch pairs for (CSV)',
    example: '1',
  })
  @IsOptional()
  @IsString()
  @Expose()
  id?: string;

  @ApiPropertyOptional({
    description: 'Convert to these symbols (CSV)',
    example: 'USD',
  })
  @IsOptional()
  @IsString()
  @Expose()
  convert?: string;
}

@Exclude()
export class CmcCryptoOhlcvLatestV1QueryDto
  extends CmcIdSymbolQueryDto
  implements Partial<CmcConvertQueryDto>
{
  @ApiPropertyOptional({
    description: 'Convert to these symbols (CSV)',
    example: 'USD',
  })
  @IsOptional()
  @IsString()
  @Expose()
  convert?: string;
}

@Exclude()
export class CmcCryptoOhlcvHistoricalV1QueryDto
  extends CmcIdSymbolQueryDto
  implements
    Partial<CmcConvertQueryDto>,
    Partial<CmcTimeRangeQueryDto>,
    Partial<CmcCountQueryDto>
{
  @ApiPropertyOptional({
    description: 'Convert to these symbols (CSV)',
    example: 'USD',
  })
  @IsOptional()
  @IsString()
  @Expose()
  convert?: string;

  @ApiPropertyOptional({ description: 'Start time', example: '2019-01-01' })
  @IsOptional()
  @IsString()
  @Expose()
  time_start?: string;

  @ApiPropertyOptional({ description: 'End time', example: '2019-02-01' })
  @IsOptional()
  @IsString()
  @Expose()
  time_end?: string;

  @ApiPropertyOptional({ description: 'Interval', example: '1d' })
  @IsOptional()
  @IsString()
  @Matches(/^\d+[mhdw]$/)
  @Expose()
  interval?: string;

  @ApiPropertyOptional({ description: 'Number of points', example: 90 })
  @Transform(({ value }) => (value !== undefined ? Number(value) : undefined))
  @IsOptional()
  @IsInt()
  @Min(1)
  @Expose()
  count?: number;
}

@Exclude()
export class CmcCryptoPpsLatestV1QueryDto
  extends CmcIdSymbolQueryDto
  implements Partial<CmcConvertQueryDto>
{
  @ApiPropertyOptional({
    description: 'Convert to these symbols (CSV)',
    example: 'USD',
  })
  @IsOptional()
  @IsString()
  @Expose()
  convert?: string;
}

@Exclude()
export class CmcCryptoCategoriesQueryDto extends CmcPagingQueryDto {}

@Exclude()
export class CmcCryptoCategoryQueryDto {
  @ApiPropertyOptional({ description: 'Category ID' })
  @IsOptional()
  @IsString()
  @Expose()
  id?: string;

  @ApiPropertyOptional({ description: 'Category slug' })
  @IsOptional()
  @IsString()
  @Expose()
  slug?: string;
}

@Exclude()
export class CmcCryptoAirdropsQueryDto extends CmcPagingQueryDto {}

@Exclude()
export class CmcCryptoAirdropQueryDto {
  @ApiPropertyOptional({ description: 'Airdrop ID' })
  @IsOptional()
  @IsString()
  @Expose()
  id?: string;

  @ApiPropertyOptional({ description: 'Airdrop slug' })
  @IsOptional()
  @IsString()
  @Expose()
  slug?: string;
}

// -----------------------------------------------------------------------------
// Cryptocurrency (v2/v3)
// -----------------------------------------------------------------------------

@Exclude()
export class CmcQuotesLatestQueryDto
  extends CmcIdSymbolQueryDto
  implements Partial<CmcConvertQueryDto>
{
  @ApiPropertyOptional({
    description: 'Convert to these symbols (CSV)',
    example: 'USD',
  })
  @IsOptional()
  @IsString()
  @Expose()
  convert?: string;
}

@Exclude()
export class CmcQuotesHistoricalV2QueryDto
  extends CmcIdSymbolQueryDto
  implements
    Partial<CmcConvertQueryDto>,
    Partial<CmcTimeRangeQueryDto>,
    Partial<CmcCountQueryDto>
{
  @ApiPropertyOptional({
    description: 'Convert to these symbols',
    example: 'USD',
  })
  @IsOptional()
  @IsString()
  @Expose()
  convert?: string;

  @ApiPropertyOptional({ description: 'Start time', example: '2020-01-01' })
  @IsOptional()
  @IsString()
  @Expose()
  time_start?: string;

  @ApiPropertyOptional({ description: 'End time', example: '2020-04-01' })
  @IsOptional()
  @IsString()
  @Expose()
  time_end?: string;

  @ApiPropertyOptional({ description: 'Interval', example: '1d' })
  @IsOptional()
  @IsString()
  @Matches(/^\d+[mhdw]$/)
  @Expose()
  interval?: string;

  @ApiPropertyOptional({ description: 'Number of points', example: 120 })
  @Transform(({ value }) => (value !== undefined ? Number(value) : undefined))
  @IsOptional()
  @IsInt()
  @Min(1)
  @Expose()
  count?: number;
}

@Exclude()
export class CmcQuotesHistoricalV3QueryDto extends CmcQuotesHistoricalV2QueryDto {}

@Exclude()
export class CmcOhlcvLatestV2QueryDto
  extends CmcIdSymbolQueryDto
  implements Partial<CmcConvertQueryDto>
{
  @ApiPropertyOptional({
    description: 'Convert to these symbols (CSV)',
    example: 'USD',
  })
  @IsOptional()
  @IsString()
  @Expose()
  convert?: string;
}

@Exclude()
export class CmcOhlcvHistoricalV2QueryDto
  extends CmcIdSymbolQueryDto
  implements
    Partial<CmcConvertQueryDto>,
    Partial<CmcTimeRangeQueryDto>,
    Partial<CmcCountQueryDto>
{
  @ApiPropertyOptional({
    description: 'Convert to these symbols (CSV)',
    example: 'USD',
  })
  @IsOptional()
  @IsString()
  @Expose()
  convert?: string;

  @ApiPropertyOptional({ description: 'Start time', example: '2020-01-01' })
  @IsOptional()
  @IsString()
  @Expose()
  time_start?: string;

  @ApiPropertyOptional({ description: 'End time', example: '2020-03-01' })
  @IsOptional()
  @IsString()
  @Expose()
  time_end?: string;

  @ApiPropertyOptional({ description: 'Interval', example: '1d' })
  @IsOptional()
  @IsString()
  @Matches(/^\d+[mhdw]$/)
  @Expose()
  interval?: string;

  @ApiPropertyOptional({ description: 'Number of points', example: 60 })
  @Transform(({ value }) => (value !== undefined ? Number(value) : undefined))
  @IsOptional()
  @IsInt()
  @Min(1)
  @Expose()
  count?: number;
}

@Exclude()
export class CmcMarketPairsLatestV2QueryDto
  extends CmcPagingQueryDto
  implements Partial<CmcConvertQueryDto>
{
  @ApiPropertyOptional({ description: 'Crypto ID(s) (CSV)', example: '1' })
  @IsOptional()
  @IsString()
  @Expose()
  id?: string;

  @ApiPropertyOptional({
    description: 'Convert to these symbols (CSV)',
    example: 'USD',
  })
  @IsOptional()
  @IsString()
  @Expose()
  convert?: string;
}

@Exclude()
export class CmcPpsLatestV2QueryDto
  extends CmcIdSymbolQueryDto
  implements Partial<CmcConvertQueryDto>
{
  @ApiPropertyOptional({
    description: 'Convert to these symbols (CSV)',
    example: 'USD',
  })
  @IsOptional()
  @IsString()
  @Expose()
  convert?: string;
}

// -----------------------------------------------------------------------------
// Exchange
// -----------------------------------------------------------------------------

@Exclude()
export class CmcExchangeMapQueryDto extends CmcPagingQueryDto {
  @ApiPropertyOptional({
    description: 'Listing status',
    enum: ['active', 'inactive', 'untracked'],
  })
  @IsOptional()
  @IsEnum(['active', 'inactive', 'untracked'])
  @Expose()
  listing_status?: 'active' | 'inactive' | 'untracked';

  @ApiPropertyOptional({
    description: 'Slugs CSV',
    example: 'binance,coinbase-exchange',
  })
  @IsOptional()
  @IsString()
  @Expose()
  slug?: string;

  @ApiPropertyOptional({
    description: 'Sort by',
    enum: ['id', 'name', 'cmc_rank'],
  })
  @IsOptional()
  @IsEnum(['id', 'name', 'cmc_rank'])
  @Expose()
  sort?: 'id' | 'name' | 'cmc_rank';
}

@Exclude()
export class CmcExchangeInfoQueryDto {
  @ApiPropertyOptional({ description: 'Exchange ID(s) CSV' })
  @IsOptional()
  @IsString()
  @Expose()
  id?: string;

  @ApiPropertyOptional({ description: 'Exchange slug(s) CSV' })
  @IsOptional()
  @IsString()
  @Expose()
  slug?: string;
}

@Exclude()
export class CmcExchangeListingsLatestQueryDto
  extends CmcPagingQueryDto
  implements Partial<CmcConvertQueryDto>, Partial<CmcSortDirQueryDto>
{
  @ApiPropertyOptional({
    description: 'Convert to symbols (CSV)',
    example: 'USD',
  })
  @IsOptional()
  @IsString()
  @Expose()
  convert?: string;

  @ApiPropertyOptional({
    description: 'Sort by',
    enum: ['volume_24h', 'name', 'cmc_rank', 'traffic_score'],
  })
  @IsOptional()
  @IsEnum(['volume_24h', 'name', 'cmc_rank', 'traffic_score'])
  @Expose()
  sort?: 'volume_24h' | 'name' | 'cmc_rank' | 'traffic_score';

  @ApiPropertyOptional({
    description: 'Sort direction',
    enum: ['asc', 'desc'],
    example: 'desc',
  })
  @IsOptional()
  @IsEnum(['asc', 'desc'])
  @Expose()
  sort_dir?: 'asc' | 'desc';
}

@Exclude()
export class CmcExchangeQuotesLatestQueryDto extends CmcConvertQueryDto {
  @ApiPropertyOptional({ description: 'Exchange IDs CSV' })
  @IsOptional()
  @IsString()
  @Expose()
  id?: string;

  @ApiPropertyOptional({ description: 'Exchange slugs CSV' })
  @IsOptional()
  @IsString()
  @Expose()
  slug?: string;
}

@Exclude()
export class CmcExchangeQuotesHistoricalQueryDto
  extends CmcConvertQueryDto
  implements Partial<CmcTimeRangeQueryDto>, Partial<CmcCountQueryDto>
{
  @ApiPropertyOptional({ description: 'Exchange ID (single)' })
  @IsOptional()
  @IsString()
  @Expose()
  id?: string;

  @ApiPropertyOptional({ description: 'Start time', example: '2020-01-01' })
  @IsOptional()
  @IsString()
  @Expose()
  time_start?: string;

  @ApiPropertyOptional({ description: 'End time', example: '2020-03-01' })
  @IsOptional()
  @IsString()
  @Expose()
  time_end?: string;

  @ApiPropertyOptional({ description: 'Interval', example: '1d' })
  @IsOptional()
  @IsString()
  @Matches(/^\d+[mhdw]$/)
  @Expose()
  interval?: string;

  @ApiPropertyOptional({ description: 'Number of points', example: 100 })
  @Transform(({ value }) => (value !== undefined ? Number(value) : undefined))
  @IsOptional()
  @IsInt()
  @Min(1)
  @Expose()
  count?: number;
}

@Exclude()
export class CmcExchangeMarketPairsLatestQueryDto
  extends CmcPagingQueryDto
  implements Partial<CmcConvertQueryDto>
{
  @ApiProperty({ description: 'Exchange ID (single)', example: '270' })
  @IsString()
  @Expose()
  id!: string;

  @ApiPropertyOptional({
    description: 'Convert to symbols (CSV)',
    example: 'USD',
  })
  @IsOptional()
  @IsString()
  @Expose()
  convert?: string;
}

@Exclude()
export class CmcExchangeAssetsQueryDto
  extends CmcPagingQueryDto
  implements Partial<CmcSortDirQueryDto>
{
  @ApiPropertyOptional({ description: 'Exchange ID' })
  @IsOptional()
  @IsString()
  @Expose()
  id?: string;

  @ApiPropertyOptional({ description: 'Exchange slug' })
  @IsOptional()
  @IsString()
  @Expose()
  slug?: string;

  @ApiPropertyOptional({ description: 'Wallet address' })
  @IsOptional()
  @IsString()
  @Expose()
  address?: string;

  @ApiPropertyOptional({
    description: 'Asset symbol (on-chain)',
    example: 'BTC',
  })
  @IsOptional()
  @IsString()
  @Expose()
  symbol?: string;

  @ApiPropertyOptional({
    description: 'Sort by',
    enum: ['balance', 'price_usd', 'symbol', 'name'],
  })
  @IsOptional()
  @IsEnum(['balance', 'price_usd', 'symbol', 'name'])
  @Expose()
  sort?: 'balance' | 'price_usd' | 'symbol' | 'name';

  @ApiPropertyOptional({
    description: 'Sort direction',
    enum: ['asc', 'desc'],
    example: 'desc',
  })
  @IsOptional()
  @IsEnum(['asc', 'desc'])
  @Expose()
  sort_dir?: 'asc' | 'desc';
}
