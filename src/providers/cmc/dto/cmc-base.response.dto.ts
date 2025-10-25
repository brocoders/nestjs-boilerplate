// -----------------------------------------------------------------------------
// Shared response DTO fragments for CoinMarketCap provider
// - Mirrors your DTO style: @Exclude/@Expose, class-validator, @Type/Transform
// - Explicit Swagger types on every property
// -----------------------------------------------------------------------------

import { Expose, Exclude, Type } from 'class-transformer';
import {
  IsArray,
  IsDateString,
  IsNumber,
  IsOptional,
  IsString,
  IsObject,
  ValidateNested,
  IsInt,
  Min,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { CmcQuoteMap } from '../utils/cmc-helper';

// -----------------------------------------------------------------------------
// Status + Envelope
// -----------------------------------------------------------------------------

@Exclude()
export class CmcStatusDto {
  @ApiProperty({
    description: 'Response timestamp',
    type: String,
    example: '2025-09-20T10:20:31.178Z',
    format: 'date-time',
  })
  @IsString()
  @IsDateString()
  @Expose()
  timestamp!: string;

  @ApiProperty({
    description: 'CMC error code (0 if success)',
    type: Number,
    example: 0,
  })
  @IsNumber()
  @Expose()
  error_code!: number;

  @ApiPropertyOptional({
    description: 'Human-readable error message (null/empty if success)',
    type: String,
    nullable: true,
    example: '',
  })
  @IsOptional()
  @IsString()
  @Expose()
  error_message?: string | null;

  @ApiProperty({
    description: 'Server processing time (milliseconds)',
    type: Number,
    example: 10,
  })
  @IsNumber()
  @Expose()
  elapsed!: number;

  @ApiProperty({
    description: 'Credits used by this request',
    type: Number,
    example: 1,
  })
  @IsInt()
  @Min(0)
  @Expose()
  credit_count!: number;

  @ApiPropertyOptional({
    description: 'Additional notice from CMC',
    type: String,
    nullable: true,
    example: '',
  })
  @IsOptional()
  @IsString()
  @Expose()
  notice?: string | null;
}

/**
 * Generic envelope for CMC responses that return: { data: T, status: CmcStatusDto }.
 * NOTE: Swagger + generics: use a concrete subclass (or your swagger helpers) for docs.
 */
@Exclude()
export class CmcEnvelopeDto<T> {
  @ApiProperty({
    description: 'Data payload (shape differs by endpoint)',
    type: Object,
  })
  @Expose()
  // Validation: generic unknown, keep flexible (endpoint DTOs should be concrete)
  data!: T;

  @ApiProperty({ description: 'CMC status block', type: () => CmcStatusDto })
  @ValidateNested()
  @Type(() => CmcStatusDto)
  @Expose()
  status!: CmcStatusDto;
}

// -----------------------------------------------------------------------------
// Quotes (spot) – common superset across quote-like payloads
// -----------------------------------------------------------------------------

@Exclude()
export class CmcQuoteEntryDto {
  @ApiProperty({
    description: 'Last price in quoted currency',
    type: Number,
    example: 6602.60701122,
  })
  @IsNumber()
  @Expose()
  price!: number;

  @ApiPropertyOptional({
    description: '24h volume',
    type: Number,
    example: 4314444687.5194,
  })
  @IsOptional()
  @IsNumber()
  @Expose()
  volume_24h?: number;

  @ApiPropertyOptional({
    description: '24h volume change (%)',
    type: Number,
    example: -0.152774,
  })
  @IsOptional()
  @IsNumber()
  @Expose()
  volume_change_24h?: number;

  @ApiPropertyOptional({
    description: '1h % change',
    type: Number,
    example: 0.988615,
  })
  @IsOptional()
  @IsNumber()
  @Expose()
  percent_change_1h?: number;

  @ApiPropertyOptional({
    description: '24h % change',
    type: Number,
    example: 4.37185,
  })
  @IsOptional()
  @IsNumber()
  @Expose()
  percent_change_24h?: number;

  @ApiPropertyOptional({
    description: '7d % change',
    type: Number,
    example: -12.1352,
  })
  @IsOptional()
  @IsNumber()
  @Expose()
  percent_change_7d?: number;

  @ApiPropertyOptional({
    description: '30d % change',
    type: Number,
    example: -12.1352,
  })
  @IsOptional()
  @IsNumber()
  @Expose()
  percent_change_30d?: number;

  @ApiPropertyOptional({
    description: 'Market cap',
    type: Number,
    example: 852164659250.2758,
  })
  @IsOptional()
  @IsNumber()
  @Expose()
  market_cap?: number;

  @ApiPropertyOptional({
    description: 'Market cap dominance (%)',
    type: Number,
    example: 51,
  })
  @IsOptional()
  @IsNumber()
  @Expose()
  market_cap_dominance?: number;

  @ApiPropertyOptional({
    description: 'Fully diluted market cap',
    type: Number,
    example: 952835089431.14,
  })
  @IsOptional()
  @IsNumber()
  @Expose()
  fully_diluted_market_cap?: number;

  @ApiPropertyOptional({
    description: 'Quote last updated',
    type: String,
    example: '2018-08-09T21:56:28.000Z',
    format: 'date-time',
  })
  @IsOptional()
  @IsString()
  @IsDateString()
  @Expose()
  last_updated?: string;
}

// -----------------------------------------------------------------------------
// OHLCV
// -----------------------------------------------------------------------------

@Exclude()
export class CmcOhlcvQuoteDto {
  @ApiProperty({
    description: 'Open price',
    type: Number,
    example: 3849.21640853,
  })
  @IsNumber()
  @Expose()
  open!: number;

  @ApiProperty({
    description: 'High price',
    type: Number,
    example: 3947.9812729,
  })
  @IsNumber()
  @Expose()
  high!: number;

  @ApiProperty({
    description: 'Low price',
    type: Number,
    example: 3817.40949569,
  })
  @IsNumber()
  @Expose()
  low!: number;

  @ApiProperty({
    description: 'Close price',
    type: Number,
    example: 3943.40933686,
  })
  @IsNumber()
  @Expose()
  close!: number;

  @ApiPropertyOptional({
    description: 'Volume',
    type: Number,
    example: 5244856835.70851,
  })
  @IsOptional()
  @IsNumber()
  @Expose()
  volume?: number;

  @ApiPropertyOptional({
    description: 'Market cap',
    type: Number,
    example: 68849856731.6738,
  })
  @IsOptional()
  @IsNumber()
  @Expose()
  market_cap?: number;

  @ApiPropertyOptional({
    description: 'Quote last updated',
    type: String,
    example: '2019-01-02T23:59:59.999Z',
    format: 'date-time',
  })
  @IsOptional()
  @IsString()
  @IsDateString()
  @Expose()
  last_updated?: string;

  @ApiPropertyOptional({
    description: 'Quote timestamp',
    type: String,
    example: '2019-01-02T23:59:59.999Z',
    format: 'date-time',
  })
  @IsOptional()
  @IsString()
  @IsDateString()
  @Expose()
  timestamp?: string;
}

@Exclude()
export class CmcOhlcvCandleDto {
  @ApiProperty({
    description: 'Candle open time',
    type: String,
    example: '2019-01-02T00:00:00.000Z',
    format: 'date-time',
  })
  @IsString()
  @IsDateString()
  @Expose()
  time_open!: string;

  @ApiProperty({
    description: 'Candle close time (null for in-progress period)',
    type: String,
    example: '2019-01-02T23:59:59.999Z',
    format: 'date-time',
    nullable: true,
  })
  @IsString()
  @IsDateString()
  @Expose()
  time_close!: string | null;

  @ApiPropertyOptional({
    description: 'Time of session high',
    type: String,
    example: '2019-01-02T03:53:00.000Z',
    format: 'date-time',
  })
  @IsOptional()
  @IsString()
  @IsDateString()
  @Expose()
  time_high?: string;

  @ApiPropertyOptional({
    description: 'Time of session low',
    type: String,
    example: '2019-01-02T02:43:00.000Z',
    format: 'date-time',
  })
  @IsOptional()
  @IsString()
  @IsDateString()
  @Expose()
  time_low?: string;

  @ApiProperty({
    description: 'Currency → OHLCV map, e.g. { "USD": { open, high, ... } }',
    type: Object,
    example: {
      USD: {
        open: 3849.21640853,
        high: 3947.9812729,
        low: 3817.40949569,
        close: 3943.40933686,
        volume: 5244856835.70851,
        market_cap: 68849856731.6738,
        timestamp: '2019-01-02T23:59:59.999Z',
      },
    },
  })
  @IsObject()
  @Expose()
  quote!: CmcQuoteMap<CmcOhlcvQuoteDto>;
}

// -----------------------------------------------------------------------------
// Asset metadata (used by /info, /listings, /map rows)
// -----------------------------------------------------------------------------

@Exclude()
export class CmcInfoUrlsDto {
  @ApiProperty({ type: [String], example: ['https://bitcoin.org/'] })
  @IsArray()
  @IsString({ each: true })
  @Expose()
  website!: string[];

  @ApiProperty({ type: [String], example: ['https://bitcoin.org/bitcoin.pdf'] })
  @IsArray()
  @IsString({ each: true })
  @Expose()
  technical_doc!: string[];

  @ApiProperty({ type: [String], example: [] })
  @IsArray()
  @IsString({ each: true })
  @Expose()
  twitter!: string[];

  @ApiProperty({ type: [String], example: ['https://reddit.com/r/bitcoin'] })
  @IsArray()
  @IsString({ each: true })
  @Expose()
  reddit!: string[];

  @ApiProperty({ type: [String], example: ['https://bitcointalk.org'] })
  @IsArray()
  @IsString({ each: true })
  @Expose()
  message_board!: string[];

  @ApiProperty({ type: [String], example: [] })
  @IsArray()
  @IsString({ each: true })
  @Expose()
  announcement!: string[];

  @ApiProperty({ type: [String], example: [] })
  @IsArray()
  @IsString({ each: true })
  @Expose()
  chat!: string[];

  @ApiProperty({
    type: [String],
    example: [
      'https://blockchain.coinmarketcap.com/chain/bitcoin',
      'https://blockchain.info/',
    ],
  })
  @IsArray()
  @IsString({ each: true })
  @Expose()
  explorer!: string[];

  @ApiProperty({ type: [String], example: ['https://github.com/bitcoin/'] })
  @IsArray()
  @IsString({ each: true })
  @Expose()
  source_code!: string[];
}

/**
 * Minimal asset meta shared across /info, /listings, /map rows.
 * Extend this in endpoint-specific DTOs (add `quote`, supplies, ranks, etc.).
 */
@Exclude()
export class CmcAssetMetaBaseDto {
  @ApiProperty({
    description: 'CMC numeric asset ID',
    type: Number,
    example: 1,
  })
  @IsInt()
  @Expose()
  id!: number;

  @ApiProperty({
    description: 'Display name',
    type: String,
    example: 'Bitcoin',
  })
  @IsString()
  @Expose()
  name!: string;

  @ApiProperty({ description: 'Ticker symbol', type: String, example: 'BTC' })
  @IsString()
  @Expose()
  symbol!: string;

  @ApiProperty({ description: 'SEO slug', type: String, example: 'bitcoin' })
  @IsString()
  @Expose()
  slug!: string;

  @ApiPropertyOptional({
    description: 'Logo URL',
    type: String,
    example: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1.png',
  })
  @IsOptional()
  @IsString()
  @Expose()
  logo?: string;

  @ApiPropertyOptional({
    description: 'Long description (if /info)',
    type: String,
    example:
      'Bitcoin (BTC) is a consensus network that enables a new payment system...',
  })
  @IsOptional()
  @IsString()
  @Expose()
  description?: string;

  @ApiPropertyOptional({
    description: 'Date added to CMC',
    type: String,
    format: 'date-time',
    example: '2013-04-28T00:00:00.000Z',
  })
  @IsOptional()
  @IsString()
  @IsDateString()
  @Expose()
  date_added?: string;

  @ApiPropertyOptional({
    description: 'Network launch date',
    type: String,
    format: 'date-time',
    example: '2013-04-28T00:00:00.000Z',
  })
  @IsOptional()
  @IsString()
  @IsDateString()
  @Expose()
  date_launched?: string;

  @ApiProperty({
    description: 'Categorization tags',
    type: [String],
    example: ['mineable'],
  })
  @IsArray()
  @IsString({ each: true })
  @Expose()
  tags!: string[];

  @ApiPropertyOptional({
    description: 'Platform object for tokens (structure varies)',
    type: Object,
    example: {
      id: 1027,
      name: 'Ethereum',
      symbol: 'ETH',
      slug: 'ethereum',
      token_address: '0xdac17f958d2ee523a2206206994597c13d831ec7',
    },
    nullable: true,
  })
  @IsOptional()
  @IsObject()
  @Expose()
  platform?: any | null;

  @ApiPropertyOptional({
    description: 'Asset category (e.g., coin, token)',
    type: String,
    example: 'coin',
  })
  @IsOptional()
  @IsString()
  @Expose()
  category?: string;
}
