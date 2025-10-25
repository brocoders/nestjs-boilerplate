// -----------------------------------------------------------------------------
// CMC — Fear & Greed Index DTOs
// Endpoints covered:
//   • GET /v3/fear-and-greed/latest
//   • GET /v3/fear-and-greed/historical
// -----------------------------------------------------------------------------

import { Exclude, Expose, Type } from 'class-transformer';
import {
  IsDateString,
  IsInt,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';
import { ApiExtraModels, ApiProperty } from '@nestjs/swagger';
import { CmcEnvelopeDto, CmcStatusDto } from './cmc-base.response.dto';

// -----------------------------------------------------------------------------
// Shared DTOs
// -----------------------------------------------------------------------------

@Exclude()
export class CmcFearAndGreedDataPointDto {
  @ApiProperty({
    description: 'Fear & Greed score (0 = extreme fear, 100 = extreme greed)',
    example: 34,
    minimum: 0,
    maximum: 100,
  })
  @IsInt()
  @Min(0)
  @Expose()
  score!: number;

  @ApiProperty({
    description:
      'Classification of sentiment (e.g., Extreme Fear, Fear, Neutral, Greed, Extreme Greed)',
    example: 'Fear',
  })
  @IsString()
  @Expose()
  classification!: string;

  @ApiProperty({
    description: 'Timestamp when the score was calculated',
    type: String,
    format: 'date-time',
    example: '2025-09-20T10:20:31.178Z',
  })
  @IsString()
  @IsDateString()
  @Expose()
  timestamp!: string;
}

// -----------------------------------------------------------------------------
// GET /v3/fear-and-greed/latest
// -----------------------------------------------------------------------------

@Exclude()
@ApiExtraModels(CmcFearAndGreedDataPointDto, CmcStatusDto)
export class CmcFearAndGreedLatestDto extends CmcEnvelopeDto<CmcFearAndGreedDataPointDto> {
  @ApiProperty({ type: () => CmcFearAndGreedDataPointDto })
  @ValidateNested()
  @Type(() => CmcFearAndGreedDataPointDto)
  @Expose()
  data!: CmcFearAndGreedDataPointDto;

  @ApiProperty({ type: () => CmcStatusDto })
  @ValidateNested()
  @Type(() => CmcStatusDto)
  @Expose()
  status!: CmcStatusDto;
}

// -----------------------------------------------------------------------------
// GET /v3/fear-and-greed/historical
// -----------------------------------------------------------------------------

@Exclude()
@ApiExtraModels(CmcFearAndGreedDataPointDto, CmcStatusDto)
export class CmcFearAndGreedHistoricalDto extends CmcEnvelopeDto<
  CmcFearAndGreedDataPointDto[]
> {
  @ApiProperty({ type: () => [CmcFearAndGreedDataPointDto] })
  @ValidateNested({ each: true })
  @Type(() => CmcFearAndGreedDataPointDto)
  @Expose()
  data!: CmcFearAndGreedDataPointDto[];

  @ApiProperty({ type: () => CmcStatusDto })
  @ValidateNested()
  @Type(() => CmcStatusDto)
  @Expose()
  status!: CmcStatusDto;
}
