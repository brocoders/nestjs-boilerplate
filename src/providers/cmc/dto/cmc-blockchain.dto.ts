// -----------------------------------------------------------------------------
// CMC — Blockchain DTOs (styled to your standards)
// Endpoint: GET /v1/blockchain/statistics/latest
// -----------------------------------------------------------------------------

import { Exclude, Expose, Type } from 'class-transformer';
import {
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  IsDateString,
  Min,
  ValidateNested,
  IsObject,
} from 'class-validator';
import {
  ApiExtraModels,
  ApiProperty,
  ApiPropertyOptional,
  getSchemaPath,
} from '@nestjs/swagger';

import { CmcEnvelopeDto, CmcStatusDto } from './cmc-base.response.dto';
import { CmcKeyedMap } from '../utils/cmc-helper';

@Exclude()
export class CmcBlockchainStatisticsItemDto {
  @ApiProperty({
    description: 'CMC numeric chain ID',
    type: Number,
    example: 1,
  })
  @IsInt()
  @Min(1)
  @Expose()
  id!: number;

  @ApiProperty({
    description: 'SEO slug of the chain',
    type: String,
    example: 'bitcoin',
  })
  @IsString()
  @Expose()
  slug!: string;

  @ApiProperty({
    description: 'Ticker symbol for the chain asset',
    type: String,
    example: 'BTC',
  })
  @IsString()
  @Expose()
  symbol!: string;

  @ApiProperty({
    description:
      'Static block reward at the current era/epoch (units depend on chain)',
    type: Number,
    example: 12.5,
  })
  @IsNumber()
  @Expose()
  block_reward_static!: number;

  @ApiProperty({
    description: 'Consensus mechanism / algorithm',
    type: String,
    example: 'proof-of-work',
  })
  @IsString()
  @Expose()
  consensus_mechanism!: string;

  @ApiProperty({
    description:
      'Difficulty (string to preserve very large integer precision as provided by CMC)',
    type: String,
    example: '11890594958796',
  })
  @IsString()
  @Expose()
  difficulty!: string;

  @ApiProperty({
    description:
      'Hashrate over last 24h (string to preserve very large integer precision)',
    type: String,
    example: '85116194130018810000',
  })
  @IsString()
  @Expose()
  hashrate_24h!: string;

  @ApiProperty({
    description: 'Pending transactions in mempool (approximate)',
    type: Number,
    example: 1177,
  })
  @IsInt()
  @Min(0)
  @Expose()
  pending_transactions!: number;

  @ApiProperty({
    description:
      'Reward reduction/halving rate (percentage or textual format from CMC)',
    type: String,
    example: '50%',
  })
  @IsString()
  @Expose()
  reduction_rate!: string;

  @ApiProperty({
    description: 'Total number of blocks produced',
    type: Number,
    example: 595165,
  })
  @IsInt()
  @Min(0)
  @Expose()
  total_blocks!: number;

  @ApiProperty({
    description:
      'Total number of transactions on-chain (string to preserve precision)',
    type: String,
    example: '455738994',
  })
  @IsString()
  @Expose()
  total_transactions!: string;

  @ApiProperty({
    description: 'Average transactions per second over a 24h window',
    type: Number,
    example: 3.808090277777778,
  })
  @IsNumber()
  @Expose()
  tps_24h!: number;

  @ApiProperty({
    description: 'Timestamp of the first block on the chain',
    type: String,
    format: 'date-time',
    example: '2009-01-09T02:54:25.000Z',
  })
  @IsString()
  @IsDateString()
  @Expose()
  first_block_timestamp!: string;

  @ApiPropertyOptional({
    description:
      'Additional chain-specific metrics returned by CMC (kept flexible)',
    type: Object,
  })
  @IsOptional()
  @IsObject()
  @Expose()
  extra?: Record<string, any>;
}

/**
 * Envelope for: /v1/blockchain/statistics/latest
 * Shape:
 * {
 *   data: { [symbol: string]: CmcBlockchainStatisticsItemDto },
 *   status: CmcStatusDto
 * }
 */
@Exclude()
@ApiExtraModels(CmcBlockchainStatisticsItemDto, CmcStatusDto)
export class CmcBlockchainStatisticsLatestDto extends CmcEnvelopeDto<
  CmcKeyedMap<CmcBlockchainStatisticsItemDto>
> {
  @ApiProperty({
    description: 'Map of blockchain symbol → statistics',
    type: 'object',
    additionalProperties: {
      $ref: getSchemaPath(CmcBlockchainStatisticsItemDto),
    },
  })
  @Expose()
  data!: CmcKeyedMap<CmcBlockchainStatisticsItemDto>;

  @ApiProperty({
    description: 'CMC status block',
    type: () => CmcStatusDto,
  })
  @ValidateNested()
  @Type(() => CmcStatusDto)
  @Expose()
  status!: CmcStatusDto;
}
