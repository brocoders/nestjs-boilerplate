import { Exclude, Expose, Type } from 'class-transformer';
import {
  IsDateString,
  IsInt,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { CmcEnvelopeDto, CmcStatusDto } from './cmc-base.response.dto';

// -----------------------------------------------------------------------------
// Sub-objects
// -----------------------------------------------------------------------------

@Exclude()
export class CmcKeyPlanDto {
  @ApiProperty({
    description: 'Monthly credit limit for this API key',
    type: Number,
    example: 120000,
  })
  @IsInt()
  @Min(0)
  @Expose()
  credit_limit_monthly!: number;

  @ApiProperty({
    description: 'Human-readable string until next monthly reset',
    type: String,
    example: 'In 3 days, 19 hours, 56 minutes',
  })
  @IsString()
  @Expose()
  credit_limit_monthly_reset!: string;

  @ApiProperty({
    description: 'Timestamp of next monthly reset',
    type: String,
    format: 'date-time',
    example: '2019-09-01T00:00:00.000Z',
  })
  @IsDateString()
  @Expose()
  credit_limit_monthly_reset_timestamp!: string;

  @ApiProperty({
    description: 'Allowed requests per minute',
    type: Number,
    example: 60,
  })
  @IsInt()
  @Min(0)
  @Expose()
  rate_limit_minute!: number;
}

@Exclude()
export class CmcKeyUsageWindowDto {
  @ApiProperty({
    description: 'Requests made/credits used in this window',
    type: Number,
    example: 1,
  })
  @IsInt()
  @Min(0)
  @Expose()
  requests_made?: number;

  @ApiProperty({
    description: 'Requests left in this window',
    type: Number,
    example: 59,
  })
  @IsInt()
  @Min(0)
  @Expose()
  requests_left?: number;

  @ApiProperty({
    description: 'Credits used in this window',
    type: Number,
    example: 1,
  })
  @IsInt()
  @Min(0)
  @Expose()
  credits_used?: number;

  @ApiProperty({
    description: 'Credits left in this window',
    type: Number,
    example: 3999,
  })
  @IsInt()
  @Min(0)
  @Expose()
  credits_left?: number;
}

@Exclude()
export class CmcKeyUsageDto {
  @ApiProperty({
    description: 'Current minute usage window',
    type: () => CmcKeyUsageWindowDto,
  })
  @ValidateNested()
  @Type(() => CmcKeyUsageWindowDto)
  @Expose()
  current_minute!: CmcKeyUsageWindowDto;

  @ApiProperty({
    description: 'Current day usage window',
    type: () => CmcKeyUsageWindowDto,
  })
  @ValidateNested()
  @Type(() => CmcKeyUsageWindowDto)
  @Expose()
  current_day!: CmcKeyUsageWindowDto;

  @ApiProperty({
    description: 'Current month usage window',
    type: () => CmcKeyUsageWindowDto,
  })
  @ValidateNested()
  @Type(() => CmcKeyUsageWindowDto)
  @Expose()
  current_month!: CmcKeyUsageWindowDto;
}

// -----------------------------------------------------------------------------
// Envelope DTO
// -----------------------------------------------------------------------------

@Exclude()
export class CmcKeyInfoDataDto {
  @ApiProperty({
    description: 'API key plan details',
    type: () => CmcKeyPlanDto,
  })
  @ValidateNested()
  @Type(() => CmcKeyPlanDto)
  @Expose()
  plan!: CmcKeyPlanDto;

  @ApiProperty({
    description: 'API key usage details',
    type: () => CmcKeyUsageDto,
  })
  @ValidateNested()
  @Type(() => CmcKeyUsageDto)
  @Expose()
  usage!: CmcKeyUsageDto;
}

@Exclude()
export class CmcKeyInfoDto extends CmcEnvelopeDto<CmcKeyInfoDataDto> {
  @ApiProperty({
    description: 'CMC key info data',
    type: () => CmcKeyInfoDataDto,
  })
  @ValidateNested()
  @Type(() => CmcKeyInfoDataDto)
  @Expose()
  data!: CmcKeyInfoDataDto;

  @ApiProperty({
    description: 'CMC status metadata',
    type: () => CmcStatusDto,
  })
  @ValidateNested()
  @Type(() => CmcStatusDto)
  @Expose()
  status!: CmcStatusDto;
}
