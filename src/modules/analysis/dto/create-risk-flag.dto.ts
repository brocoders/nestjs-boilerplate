import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEnum, IsOptional } from 'class-validator';
import { RiskType, RiskSeverity } from '../entities/risk-flag.entity';

export class CreateRiskFlagDto {
  @ApiProperty({ description: 'Type of risk', enum: RiskType })
  @IsEnum(RiskType)
  type: RiskType;

  @ApiProperty({ description: 'Severity level of the risk', enum: RiskSeverity })
  @IsEnum(RiskSeverity)
  severity: RiskSeverity;

  @ApiProperty({ description: 'Description of the risk' })
  @IsString()
  description: string;

  @ApiProperty({ description: 'Suggested resolution for the risk', required: false })
  @IsString()
  @IsOptional()
  suggestedResolution?: string;

  @ApiProperty({ description: 'Reviewer comments on the risk', required: false })
  @IsString()
  @IsOptional()
  reviewerComments?: string;
} 