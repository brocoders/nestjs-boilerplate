// src/modules/cmc/dto/exchange/cmc-exchange.dto.ts
// -----------------------------------------------------------------------------
// CMC — Exchange DTOs (styled to your standards)
// Endpoints covered:
//   • GET /v1/exchange/assets
//   • GET /v1/exchange/info
//   • GET /v1/exchange/map
//   • GET /v1/exchange/listings/latest
//   • GET /v1/exchange/market-pairs/latest
//   • GET /v1/exchange/quotes/historical
//   • GET /v1/exchange/quotes/latest
// -----------------------------------------------------------------------------

import { Exclude, Expose, Type } from 'class-transformer';
import {
  IsArray,
  IsDateString,
  IsInt,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';
import {
  ApiExtraModels,
  ApiProperty,
  ApiPropertyOptional,
  getSchemaPath,
} from '@nestjs/swagger';

import { CmcEnvelopeDto, CmcStatusDto } from './cmc-base.response.dto';
import { CmcKeyedMap } from '../utils/cmc-helper';

// -----------------------------------------------------------------------------
// /v1/exchange/assets
// -----------------------------------------------------------------------------

@Exclude()
export class CmcExchangeAssetPlatformDto {
  @ApiProperty({
    type: Number,
    example: 1027,
    description: 'Platform crypto id (e.g., Ethereum=1027)',
  })
  @IsInt()
  @Expose()
  crypto_id!: number;

  @ApiProperty({ type: String, example: 'ETH' })
  @IsString()
  @Expose()
  symbol!: string;
  @ApiProperty({ type: String, example: 'Ethereum' })
  @IsString()
  @Expose()
  name!: string;
}

@Exclude()
export class CmcExchangeAssetCurrencyDto {
  @ApiProperty({ type: Number, example: 5117 })
  @IsInt()
  @Expose()
  crypto_id!: number;

  @ApiProperty({ type: Number, example: 0.10241799413549 })
  @IsNumber()
  @Expose()
  price_usd!: number;

  @ApiProperty({ type: String, example: 'OGN' })
  @IsString()
  @Expose()
  symbol!: string;
  @ApiProperty({ type: String, example: 'Origin Protocol' })
  @IsString()
  @Expose()
  name!: string;
}

@Exclude()
export class CmcExchangeAssetItemDto {
  @ApiProperty({
    type: String,
    example: '0x5a52e96bacdabb82fd05763e25335261b270efcb',
  })
  @IsString()
  @Expose()
  wallet_address!: string;

  @ApiProperty({ type: Number, example: 45000000 })
  @IsNumber()
  @Expose()
  balance!: number;

  @ApiProperty({ type: () => CmcExchangeAssetPlatformDto })
  @ValidateNested()
  @Type(() => CmcExchangeAssetPlatformDto)
  @Expose()
  platform!: CmcExchangeAssetPlatformDto;

  @ApiProperty({ type: () => CmcExchangeAssetCurrencyDto })
  @ValidateNested()
  @Type(() => CmcExchangeAssetCurrencyDto)
  @Expose()
  currency!: CmcExchangeAssetCurrencyDto;
}

@Exclude()
@ApiExtraModels(CmcExchangeAssetItemDto, CmcStatusDto)
export class CmcExchangeAssetsDto extends CmcEnvelopeDto<
  CmcExchangeAssetItemDto[]
> {
  @ApiProperty({ type: () => [CmcExchangeAssetItemDto] })
  @ValidateNested({ each: true })
  @Type(() => CmcExchangeAssetItemDto)
  @Expose()
  data!: CmcExchangeAssetItemDto[];

  @ApiProperty({ type: () => CmcStatusDto })
  @ValidateNested()
  @Type(() => CmcStatusDto)
  @Expose()
  status!: CmcStatusDto;
}

// -----------------------------------------------------------------------------
// /v1/exchange/info  (data keyed by exchange id)
// -----------------------------------------------------------------------------

@Exclude()
export class CmcExchangeUrlsDto {
  @ApiProperty({ type: [String], example: ['https://www.binance.com/'] })
  @IsArray()
  @IsString({ each: true })
  @Expose()
  website!: string[];

  @ApiProperty({ type: [String], example: ['https://twitter.com/binance'] })
  @IsArray()
  @IsString({ each: true })
  @Expose()
  twitter!: string[];

  @ApiProperty({ type: [String], example: [] })
  @IsArray()
  @IsString({ each: true })
  @Expose()
  blog!: string[];

  @ApiProperty({ type: [String], example: ['https://t.me/binanceexchange'] })
  @IsArray()
  @IsString({ each: true })
  @Expose()
  chat!: string[];

  @ApiProperty({
    type: [String],
    example: ['https://www.binance.com/fees.html'],
  })
  @IsArray()
  @IsString({ each: true })
  @Expose()
  fee!: string[];
}

@Exclude()
export class CmcExchangeInfoItemDto {
  @ApiProperty({ type: Number, example: 270 })
  @IsInt()
  @Min(1)
  @Expose()
  id!: number;
  @ApiProperty({ type: String, example: 'Binance' })
  @IsString()
  @Expose()
  name!: string;
  @ApiProperty({ type: String, example: 'binance' })
  @IsString()
  @Expose()
  slug!: string;

  @ApiProperty({
    type: String,
    example: 'https://s2.coinmarketcap.com/static/img/exchanges/64x64/270.png',
  })
  @IsString()
  @Expose()
  logo!: string;

  @ApiPropertyOptional({
    type: String,
    example:
      'Launched in Jul-2017, Binance is a centralized exchange based in Malta.',
  })
  @IsOptional()
  @IsString()
  @Expose()
  description?: string | null;

  @ApiPropertyOptional({
    type: String,
    format: 'date-time',
    example: '2017-07-14T00:00:00.000Z',
  })
  @IsOptional()
  @IsString()
  @IsDateString()
  @Expose()
  date_launched?: string;

  @ApiPropertyOptional({ type: String, nullable: true, example: null })
  @IsOptional()
  @IsString()
  @Expose()
  notice?: string | null;

  @ApiProperty({ type: [String], example: [] })
  @IsArray()
  @IsString({ each: true })
  @Expose()
  countries!: string[];

  @ApiProperty({ type: [String], example: ['AED', 'USD'] })
  @IsArray()
  @IsString({ each: true })
  @Expose()
  fiats!: string[];

  @ApiPropertyOptional({ type: [String], example: null, nullable: true })
  @IsOptional()
  @IsArray()
  @Expose()
  tags?: string[] | null;

  @ApiPropertyOptional({ type: String, example: '' })
  @IsOptional()
  @IsString()
  @Expose()
  type?: string;

  @ApiPropertyOptional({ type: Number, example: 0.02 })
  @IsOptional()
  @IsNumber()
  @Expose()
  maker_fee?: number;

  @ApiPropertyOptional({ type: Number, example: 0.04 })
  @IsOptional()
  @IsNumber()
  @Expose()
  taker_fee?: number;

  @ApiPropertyOptional({ type: Number, example: 5123451 })
  @IsOptional()
  @IsNumber()
  @Expose()
  weekly_visits?: number;

  @ApiPropertyOptional({ type: Number, example: 66926283498.60113 })
  @IsOptional()
  @IsNumber()
  @Expose()
  spot_volume_usd?: number;

  @ApiPropertyOptional({
    type: String,
    format: 'date-time',
    example: '2021-05-06T01:20:15.451Z',
  })
  @IsOptional()
  @IsString()
  @IsDateString()
  @Expose()
  spot_volume_last_updated?: string;

  @ApiProperty({ type: () => CmcExchangeUrlsDto })
  @ValidateNested()
  @Type(() => CmcExchangeUrlsDto)
  @Expose()
  urls!: CmcExchangeUrlsDto;
}

@Exclude()
@ApiExtraModels(CmcExchangeInfoItemDto, CmcStatusDto)
export class CmcExchangeInfoDto extends CmcEnvelopeDto<
  CmcKeyedMap<CmcExchangeInfoItemDto>
> {
  @ApiProperty({
    description: 'Map of exchange id → info',
    type: 'object',
    additionalProperties: { $ref: getSchemaPath(CmcExchangeInfoItemDto) },
  })
  @Expose()
  data!: CmcKeyedMap<CmcExchangeInfoItemDto>;

  @ApiProperty({ type: () => CmcStatusDto })
  @ValidateNested()
  @Type(() => CmcStatusDto)
  @Expose()
  status!: CmcStatusDto;
}

// -----------------------------------------------------------------------------
// /v1/exchange/map  (array)
// -----------------------------------------------------------------------------

@Exclude()
export class CmcExchangeMapItemDto {
  @ApiProperty({ type: Number, example: 270 })
  @IsInt()
  @Min(1)
  @Expose()
  id!: number;
  @ApiProperty({ type: String, example: 'Binance' })
  @IsString()
  @Expose()
  name!: string;
  @ApiProperty({ type: String, example: 'binance' })
  @IsString()
  @Expose()
  slug!: string;

  @ApiProperty({
    type: Number,
    example: 1,
    description: '1=active; 0=inactive',
  })
  @IsInt()
  @Expose()
  is_active!: number;

  @ApiProperty({ type: String, example: 'active' })
  @IsString()
  @Expose()
  status!: string;

  @ApiProperty({
    type: String,
    format: 'date-time',
    example: '2018-04-26T00:45:00.000Z',
  })
  @IsString()
  @IsDateString()
  @Expose()
  first_historical_data!: string;

  @ApiProperty({
    type: String,
    format: 'date-time',
    example: '2019-06-02T21:25:00.000Z',
  })
  @IsString()
  @IsDateString()
  @Expose()
  last_historical_data!: string;
}

@Exclude()
@ApiExtraModels(CmcExchangeMapItemDto, CmcStatusDto)
export class CmcExchangeMapDto extends CmcEnvelopeDto<CmcExchangeMapItemDto[]> {
  @ApiProperty({ type: () => [CmcExchangeMapItemDto] })
  @ValidateNested({ each: true })
  @Type(() => CmcExchangeMapItemDto)
  @Expose()
  data!: CmcExchangeMapItemDto[];

  @ApiProperty({ type: () => CmcStatusDto })
  @ValidateNested()
  @Type(() => CmcStatusDto)
  @Expose()
  status!: CmcStatusDto;
}

// -----------------------------------------------------------------------------
// /v1/exchange/listings/latest  (array)
// -----------------------------------------------------------------------------

@Exclude()
export class CmcExchangeListingQuoteUsdDto {
  @ApiProperty({ type: Number, example: 769291636.239632 })
  @IsNumber()
  @Expose()
  volume_24h!: number;
  @ApiProperty({ type: Number, example: 769291636.239632 })
  @IsNumber()
  @Expose()
  volume_24h_adjusted!: number;
  @ApiProperty({ type: Number, example: 3666423776 })
  @IsNumber()
  @Expose()
  volume_7d!: number;
  @ApiProperty({ type: Number, example: 21338299776 })
  @IsNumber()
  @Expose()
  volume_30d!: number;
  @ApiProperty({ type: Number, example: -11.6153 })
  @IsNumber()
  @Expose()
  percent_change_volume_24h!: number;
  @ApiProperty({ type: Number, example: 67.2055 })
  @IsNumber()
  @Expose()
  percent_change_volume_7d!: number;
  @ApiProperty({ type: Number, example: 0.00169339 })
  @IsNumber()
  @Expose()
  percent_change_volume_30d!: number;
  @ApiProperty({ type: Number, example: 629.9774 })
  @IsNumber()
  @Expose()
  effective_liquidity_24h!: number;
  @ApiProperty({ type: Number, example: 62828618628.85901 })
  @IsNumber()
  @Expose()
  derivative_volume_usd!: number;
  @ApiProperty({ type: Number, example: 39682580614.8572 })
  @IsNumber()
  @Expose()
  spot_volume_usd!: number;
}

@Exclude()
export class CmcExchangeListingQuoteDto {
  @ApiProperty({ type: () => CmcExchangeListingQuoteUsdDto })
  @ValidateNested()
  @Type(() => CmcExchangeListingQuoteUsdDto)
  @Expose()
  USD!: CmcExchangeListingQuoteUsdDto;
}

@Exclude()
export class CmcExchangeListingItemDto {
  @ApiProperty({ type: Number, example: 270 })
  @IsInt()
  @Min(1)
  @Expose()
  id!: number;
  @ApiProperty({ type: String, example: 'Binance' })
  @IsString()
  @Expose()
  name!: string;
  @ApiProperty({ type: String, example: 'binance' })
  @IsString()
  @Expose()
  slug!: string;

  @ApiProperty({ type: Number, example: 1214 })
  @IsInt()
  @Min(0)
  @Expose()
  num_market_pairs!: number;

  @ApiProperty({ type: [String], example: ['AED', 'USD'] })
  @IsArray()
  @IsString({ each: true })
  @Expose()
  fiats!: string[];

  @ApiProperty({ type: Number, example: 1000 })
  @IsNumber()
  @Expose()
  traffic_score!: number;
  @ApiProperty({ type: Number, example: 1 }) @IsInt() @Expose() rank!: number;

  @ApiPropertyOptional({ type: Number, example: null, nullable: true })
  @IsOptional()
  @IsNumber()
  @Expose()
  exchange_score?: number | null;

  @ApiProperty({ type: Number, example: 9.8028 })
  @IsNumber()
  @Expose()
  liquidity_score!: number;

  @ApiProperty({
    type: String,
    format: 'date-time',
    example: '2018-11-08T22:18:00.000Z',
  })
  @IsString()
  @IsDateString()
  @Expose()
  last_updated!: string;

  @ApiProperty({ type: () => CmcExchangeListingQuoteDto })
  @ValidateNested()
  @Type(() => CmcExchangeListingQuoteDto)
  @Expose()
  quote!: CmcExchangeListingQuoteDto;
}

@Exclude()
@ApiExtraModels(CmcExchangeListingItemDto, CmcStatusDto)
export class CmcExchangeListingsLatestDto extends CmcEnvelopeDto<
  CmcExchangeListingItemDto[]
> {
  @ApiProperty({ type: () => [CmcExchangeListingItemDto] })
  @ValidateNested({ each: true })
  @Type(() => CmcExchangeListingItemDto)
  @Expose()
  data!: CmcExchangeListingItemDto[];

  @ApiProperty({ type: () => CmcStatusDto })
  @ValidateNested()
  @Type(() => CmcStatusDto)
  @Expose()
  status!: CmcStatusDto;
}

// -----------------------------------------------------------------------------
// /v1/exchange/market-pairs/latest  (single exchange object with pairs[])
// -----------------------------------------------------------------------------

@Exclude()
export class CmcExchangeMarketCurrencySideDto {
  @ApiProperty({ type: Number, example: 1 })
  @IsInt()
  @Expose()
  currency_id!: number;
  @ApiProperty({ type: String, example: 'BTC' })
  @IsString()
  @Expose()
  currency_symbol!: string;
  @ApiProperty({ type: String, example: 'BTC' })
  @IsString()
  @Expose()
  exchange_symbol!: string;
  @ApiProperty({ type: String, example: 'cryptocurrency' })
  @IsString()
  @Expose()
  currency_type!: string;
}

@Exclude()
export class CmcExchangeMarketPairQuoteExchangeReportedDto {
  @ApiProperty({ type: Number, example: 7901.83 })
  @IsNumber()
  @Expose()
  price!: number;
  @ApiProperty({ type: Number, example: 47251.3345550653 })
  @IsNumber()
  @Expose()
  volume_24h_base!: number;
  @ApiProperty({ type: Number, example: 373372012.927251 })
  @IsNumber()
  @Expose()
  volume_24h_quote!: number;
  @ApiPropertyOptional({ type: Number, example: 19.4346563602467 })
  @IsOptional()
  @IsNumber()
  @Expose()
  volume_percentage?: number;

  @ApiProperty({
    type: String,
    format: 'date-time',
    example: '2019-05-24T01:40:10.000Z',
  })
  @IsString()
  @IsDateString()
  @Expose()
  last_updated!: string;
}

@Exclude()
export class CmcExchangeMarketPairQuoteUsdDto {
  @ApiProperty({ type: Number, example: 7933.66233493434 })
  @IsNumber()
  @Expose()
  price!: number;
  @ApiProperty({ type: Number, example: 374876133.234903 })
  @IsNumber()
  @Expose()
  volume_24h!: number;

  @ApiPropertyOptional({ type: Number, example: 40654.68019906 })
  @IsOptional()
  @IsNumber()
  @Expose()
  depth_negative_two?: number;
  @ApiPropertyOptional({ type: Number, example: 17352.9964811 })
  @IsOptional()
  @IsNumber()
  @Expose()
  depth_positive_two?: number;

  @ApiProperty({
    type: String,
    format: 'date-time',
    example: '2019-05-24T01:40:10.000Z',
  })
  @IsString()
  @IsDateString()
  @Expose()
  last_updated!: string;
}

@Exclude()
export class CmcExchangeMarketPairQuoteDto {
  @ApiProperty({ type: () => CmcExchangeMarketPairQuoteExchangeReportedDto })
  @ValidateNested()
  @Type(() => CmcExchangeMarketPairQuoteExchangeReportedDto)
  @Expose()
  exchange_reported!: CmcExchangeMarketPairQuoteExchangeReportedDto;

  @ApiProperty({ type: () => CmcExchangeMarketPairQuoteUsdDto })
  @ValidateNested()
  @Type(() => CmcExchangeMarketPairQuoteUsdDto)
  @Expose()
  USD!: CmcExchangeMarketPairQuoteUsdDto;
}

@Exclude()
export class CmcExchangeMarketPairItemDto {
  @ApiProperty({ type: Number, example: 9933 })
  @IsInt()
  @Expose()
  market_id!: number;
  @ApiProperty({ type: String, example: 'BTC/USDT' })
  @IsString()
  @Expose()
  market_pair!: string;

  @ApiProperty({ type: String, example: 'spot' })
  @IsString()
  @Expose()
  category!: string;
  @ApiProperty({ type: String, example: 'percentage' })
  @IsString()
  @Expose()
  fee_type!: string;

  @ApiPropertyOptional({ type: Number, example: 0 })
  @IsOptional()
  @IsInt()
  @Expose()
  outlier_detected?: number;
  @ApiPropertyOptional({ type: Object, example: null, nullable: true })
  @IsOptional()
  @IsObject()
  @Expose()
  exclusions?: unknown;

  @ApiProperty({ type: () => CmcExchangeMarketCurrencySideDto })
  @ValidateNested()
  @Type(() => CmcExchangeMarketCurrencySideDto)
  @Expose()
  market_pair_base!: CmcExchangeMarketCurrencySideDto;

  @ApiProperty({ type: () => CmcExchangeMarketCurrencySideDto })
  @ValidateNested()
  @Type(() => CmcExchangeMarketCurrencySideDto)
  @Expose()
  market_pair_quote!: CmcExchangeMarketCurrencySideDto;

  @ApiProperty({ type: () => CmcExchangeMarketPairQuoteDto })
  @ValidateNested()
  @Type(() => CmcExchangeMarketPairQuoteDto)
  @Expose()
  quote!: CmcExchangeMarketPairQuoteDto;

  // Optional nested exchange info present in some records
  @ApiPropertyOptional({
    description: 'Exchange meta (when present)',
    type: Object,
    example: { id: 157, name: 'BitMEX', slug: 'bitmex' },
  })
  @IsOptional()
  @IsObject()
  @Expose()
  exchange?: { id: number; name: string; slug: string };
}

@Exclude()
export class CmcExchangeMarketPairsLatestDataDto {
  @ApiProperty({ type: Number, example: 270 }) @IsInt() @Expose() id!: number;
  @ApiProperty({ type: String, example: 'Binance' })
  @IsString()
  @Expose()
  name!: string;
  @ApiProperty({ type: String, example: 'binance' })
  @IsString()
  @Expose()
  slug!: string;

  @ApiProperty({ type: Number, example: 473 })
  @IsInt()
  @Expose()
  num_market_pairs!: number;

  @ApiProperty({ type: Number, example: 769291636.239632 })
  @IsNumber()
  @Expose()
  volume_24h!: number;

  @ApiProperty({ type: () => [CmcExchangeMarketPairItemDto] })
  @ValidateNested({ each: true })
  @Type(() => CmcExchangeMarketPairItemDto)
  @Expose()
  market_pairs!: CmcExchangeMarketPairItemDto[];
}

@Exclude()
@ApiExtraModels(CmcExchangeMarketPairsLatestDataDto, CmcStatusDto)
export class CmcExchangeMarketPairsLatestDto extends CmcEnvelopeDto<CmcExchangeMarketPairsLatestDataDto> {
  @ApiProperty({ type: () => CmcExchangeMarketPairsLatestDataDto })
  @ValidateNested()
  @Type(() => CmcExchangeMarketPairsLatestDataDto)
  @Expose()
  data!: CmcExchangeMarketPairsLatestDataDto;

  @ApiProperty({ type: () => CmcStatusDto })
  @ValidateNested()
  @Type(() => CmcStatusDto)
  @Expose()
  status!: CmcStatusDto;
}

// -----------------------------------------------------------------------------
// /v1/exchange/quotes/historical  (single exchange object with quotes[])
// -----------------------------------------------------------------------------

@Exclude()
export class CmcExchangeQuotesHistoricalQuoteUsdDto {
  @ApiProperty({ type: Number, example: 1632390000 })
  @IsNumber()
  @Expose()
  volume_24h!: number;

  @ApiProperty({
    type: String,
    format: 'date-time',
    example: '2018-06-03T00:00:00.000Z',
  })
  @IsString()
  @IsDateString()
  @Expose()
  timestamp!: string;
}

@Exclude()
export class CmcExchangeQuotesHistoricalQuoteDto {
  @ApiProperty({ type: () => CmcExchangeQuotesHistoricalQuoteUsdDto })
  @ValidateNested()
  @Type(() => CmcExchangeQuotesHistoricalQuoteUsdDto)
  @Expose()
  USD!: CmcExchangeQuotesHistoricalQuoteUsdDto;
}

@Exclude()
export class CmcExchangeQuotesHistoricalPointDto {
  @ApiProperty({
    type: String,
    format: 'date-time',
    example: '2018-06-03T00:00:00.000Z',
  })
  @IsString()
  @IsDateString()
  @Expose()
  timestamp!: string;

  @ApiProperty({ type: () => CmcExchangeQuotesHistoricalQuoteDto })
  @ValidateNested()
  @Type(() => CmcExchangeQuotesHistoricalQuoteDto)
  @Expose()
  quote!: CmcExchangeQuotesHistoricalQuoteDto;

  @ApiProperty({ type: Number, example: 338 })
  @IsInt()
  @Expose()
  num_market_pairs!: number;
}

@Exclude()
export class CmcExchangeQuotesHistoricalDataDto {
  @ApiProperty({ type: Number, example: 270 }) @IsInt() @Expose() id!: number;
  @ApiProperty({ type: String, example: 'Binance' })
  @IsString()
  @Expose()
  name!: string;
  @ApiProperty({ type: String, example: 'binance' })
  @IsString()
  @Expose()
  slug!: string;

  @ApiProperty({ type: () => [CmcExchangeQuotesHistoricalPointDto] })
  @ValidateNested({ each: true })
  @Type(() => CmcExchangeQuotesHistoricalPointDto)
  @Expose()
  quotes!: CmcExchangeQuotesHistoricalPointDto[];
}

@Exclude()
@ApiExtraModels(CmcExchangeQuotesHistoricalDataDto, CmcStatusDto)
export class CmcExchangeQuotesHistoricalDto extends CmcEnvelopeDto<CmcExchangeQuotesHistoricalDataDto> {
  @ApiProperty({ type: () => CmcExchangeQuotesHistoricalDataDto })
  @ValidateNested()
  @Type(() => CmcExchangeQuotesHistoricalDataDto)
  @Expose()
  data!: CmcExchangeQuotesHistoricalDataDto;

  @ApiProperty({ type: () => CmcStatusDto })
  @ValidateNested()
  @Type(() => CmcStatusDto)
  @Expose()
  status!: CmcStatusDto;
}

// -----------------------------------------------------------------------------
// /v1/exchange/quotes/latest  (map keyed by exchange id)
// -----------------------------------------------------------------------------

@Exclude()
export class CmcExchangeQuotesLatestQuoteUsdDto {
  @ApiProperty({ type: Number, example: 768478308.529847 })
  @IsNumber()
  @Expose()
  volume_24h!: number;
  @ApiProperty({ type: Number, example: 768478308.529847 })
  @IsNumber()
  @Expose()
  volume_24h_adjusted!: number;
  @ApiProperty({ type: Number, example: 3666423776 })
  @IsNumber()
  @Expose()
  volume_7d!: number;
  @ApiProperty({ type: Number, example: 21338299776 })
  @IsNumber()
  @Expose()
  volume_30d!: number;
  @ApiProperty({ type: Number, example: -11.8232 })
  @IsNumber()
  @Expose()
  percent_change_volume_24h!: number;
  @ApiProperty({ type: Number, example: 67.0306 })
  @IsNumber()
  @Expose()
  percent_change_volume_7d!: number;
  @ApiProperty({ type: Number, example: -0.0821558 })
  @IsNumber()
  @Expose()
  percent_change_volume_30d!: number;
  @ApiProperty({ type: Number, example: 629.9774 })
  @IsNumber()
  @Expose()
  effective_liquidity_24h!: number;
}

@Exclude()
export class CmcExchangeQuotesLatestQuoteDto {
  @ApiProperty({ type: () => CmcExchangeQuotesLatestQuoteUsdDto })
  @ValidateNested()
  @Type(() => CmcExchangeQuotesLatestQuoteUsdDto)
  @Expose()
  USD!: CmcExchangeQuotesLatestQuoteUsdDto;
}

@Exclude()
export class CmcExchangeQuotesLatestItemDto {
  @ApiProperty({ type: Number, example: 270 }) @IsInt() @Expose() id!: number;
  @ApiProperty({ type: String, example: 'Binance' })
  @IsString()
  @Expose()
  name!: string;
  @ApiProperty({ type: String, example: 'binance' })
  @IsString()
  @Expose()
  slug!: string;

  @ApiProperty({ type: Number, example: 132 })
  @IsInt()
  @Expose()
  num_coins!: number;
  @ApiProperty({ type: Number, example: 385 })
  @IsInt()
  @Expose()
  num_market_pairs!: number;

  @ApiProperty({
    type: String,
    format: 'date-time',
    example: '2018-11-08T22:11:00.000Z',
  })
  @IsString()
  @IsDateString()
  @Expose()
  last_updated!: string;

  @ApiProperty({ type: Number, example: 1000 })
  @IsNumber()
  @Expose()
  traffic_score!: number;
  @ApiProperty({ type: Number, example: 1 }) @IsInt() @Expose() rank!: number;

  @ApiPropertyOptional({ type: Number, example: null, nullable: true })
  @IsOptional()
  @IsNumber()
  @Expose()
  exchange_score?: number | null;

  @ApiProperty({ type: Number, example: 9.8028 })
  @IsNumber()
  @Expose()
  liquidity_score!: number;

  @ApiProperty({ type: () => CmcExchangeQuotesLatestQuoteDto })
  @ValidateNested()
  @Type(() => CmcExchangeQuotesLatestQuoteDto)
  @Expose()
  quote!: CmcExchangeQuotesLatestQuoteDto;
}

@Exclude()
@ApiExtraModels(CmcExchangeQuotesLatestItemDto, CmcStatusDto)
export class CmcExchangeQuotesLatestDto extends CmcEnvelopeDto<
  CmcKeyedMap<CmcExchangeQuotesLatestItemDto>
> {
  @ApiProperty({
    description: 'Map of exchange id → latest quote stats',
    type: 'object',
    additionalProperties: {
      $ref: getSchemaPath(CmcExchangeQuotesLatestItemDto),
    },
  })
  @Expose()
  data!: CmcKeyedMap<CmcExchangeQuotesLatestItemDto>;

  @ApiProperty({ type: () => CmcStatusDto })
  @ValidateNested()
  @Type(() => CmcStatusDto)
  @Expose()
  status!: CmcStatusDto;
}
