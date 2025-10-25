// -----------------------------------------------------------------------------
// CMC — Tools DTOs
// Endpoints covered:
//   • GET /v1/tools/price-conversion
//   • GET /v2/tools/price-conversion
//   • GET /v1/tools/postman  (status-only/error payload)
// -----------------------------------------------------------------------------

import { Exclude, Expose, Type } from 'class-transformer';
import {
  IsNumber,
  IsString,
  IsDateString,
  ValidateNested,
  IsObject,
} from 'class-validator';
import { ApiExtraModels, ApiProperty, getSchemaPath } from '@nestjs/swagger';

import { CmcEnvelopeDto, CmcStatusDto } from './cmc-base.response.dto';
import { CmcKeyedMap } from '../utils/cmc-helper';

// -----------------------------------------------------------------------------
// Shared DTOs for price-conversion (v1 & v2 share the same shape in samples)
// -----------------------------------------------------------------------------

@Exclude()
export class CmcToolsPriceConversionQuoteItemDto {
  @ApiProperty({
    description: 'Converted price in the quoted currency',
    type: Number,
    example: 381442,
  })
  @IsNumber()
  @Expose()
  price!: number;

  @ApiProperty({
    description: 'Quote timestamp for this currency',
    type: String,
    format: 'date-time',
    example: '2018-06-06T08:06:51.968Z',
  })
  @IsString()
  @IsDateString()
  @Expose()
  last_updated!: string;
}

/**
 * Quote is a dynamic object keyed by target currency symbols (e.g., USD, GBP, LTC).
 * Example:
 *  {
 *    "USD": { price: 381442, last_updated: "..." },
 *    "GBP": { price: 284656.08, last_updated: "..." }
 *  }
 */
@Exclude()
export class CmcToolsPriceConversionQuoteDto {
  @ApiProperty({
    description: 'Map of quote currency → quote item',
    type: 'object',
    additionalProperties: {
      $ref: getSchemaPath(CmcToolsPriceConversionQuoteItemDto),
    },
    example: {
      USD: { price: 381442, last_updated: '2018-06-06T08:06:51.968Z' },
      GBP: {
        price: 284656.08465608465,
        last_updated: '2018-06-06T06:00:00.000Z',
      },
      LTC: {
        price: 3128.7279766396537,
        last_updated: '2018-06-06T08:04:02.000Z',
      },
    },
  })
  @IsObject()
  @Expose()
  quote!: CmcKeyedMap<CmcToolsPriceConversionQuoteItemDto>;
}

@Exclude()
export class CmcToolsPriceConversionDataDto {
  @ApiProperty({
    description: 'Base asset symbol used for conversion',
    example: 'BTC',
  })
  @IsString()
  @Expose()
  symbol!: string;

  @ApiProperty({
    description: 'CMC id of the base asset (string in sample payloads)',
    example: '1',
    type: String,
  })
  @IsString()
  @Expose()
  id!: string;

  @ApiProperty({
    description: 'Base asset name',
    example: 'Bitcoin',
  })
  @IsString()
  @Expose()
  name!: string;

  @ApiProperty({
    description: 'Amount of the base asset converted',
    type: Number,
    example: 50,
  })
  @IsNumber()
  @Expose()
  amount!: number;

  @ApiProperty({
    description: 'Base asset quote timestamp',
    type: String,
    format: 'date-time',
    example: '2018-06-06T08:04:36.000Z',
  })
  @IsString()
  @IsDateString()
  @Expose()
  last_updated!: string;

  @ApiProperty({
    description: 'Quoted prices keyed by target currency symbol',
    type: () => CmcToolsPriceConversionQuoteDto,
  })
  @ValidateNested()
  @Type(() => CmcToolsPriceConversionQuoteDto)
  @Expose()
  quote!: CmcToolsPriceConversionQuoteDto;
}

// -----------------------------------------------------------------------------
// GET /v1/tools/price-conversion
// -----------------------------------------------------------------------------

@Exclude()
@ApiExtraModels(
  CmcToolsPriceConversionDataDto,
  CmcToolsPriceConversionQuoteDto,
  CmcToolsPriceConversionQuoteItemDto,
  CmcStatusDto,
)
export class CmcToolsPriceConversionV1Dto extends CmcEnvelopeDto<CmcToolsPriceConversionDataDto> {
  @ApiProperty({ type: () => CmcToolsPriceConversionDataDto })
  @ValidateNested()
  @Type(() => CmcToolsPriceConversionDataDto)
  @Expose()
  data!: CmcToolsPriceConversionDataDto;

  @ApiProperty({ type: () => CmcStatusDto })
  @ValidateNested()
  @Type(() => CmcStatusDto)
  @Expose()
  status!: CmcStatusDto;
}

// -----------------------------------------------------------------------------
// GET /v2/tools/price-conversion  (same response shape as v1 sample)
// -----------------------------------------------------------------------------

@Exclude()
@ApiExtraModels(
  CmcToolsPriceConversionDataDto,
  CmcToolsPriceConversionQuoteDto,
  CmcToolsPriceConversionQuoteItemDto,
  CmcStatusDto,
)
export class CmcToolsPriceConversionV2Dto extends CmcEnvelopeDto<CmcToolsPriceConversionDataDto> {
  @ApiProperty({ type: () => CmcToolsPriceConversionDataDto })
  @ValidateNested()
  @Type(() => CmcToolsPriceConversionDataDto)
  @Expose()
  data!: CmcToolsPriceConversionDataDto;

  @ApiProperty({ type: () => CmcStatusDto })
  @ValidateNested()
  @Type(() => CmcStatusDto)
  @Expose()
  status!: CmcStatusDto;
}

// -----------------------------------------------------------------------------
// GET /v1/tools/postman (status-only error/info payload)
// Sample:
// { "status": { "timestamp": "...", "error_code": 400, "error_message": "Invalid value for \"id\"", ... } }
// -----------------------------------------------------------------------------

@Exclude()
@ApiExtraModels(CmcStatusDto)
export class CmcToolsPostmanDto {
  @ApiProperty({
    description: 'CMC status block (errors, rate limits, etc.)',
    type: () => CmcStatusDto,
  })
  @ValidateNested()
  @Type(() => CmcStatusDto)
  @Expose()
  status!: CmcStatusDto;
}
