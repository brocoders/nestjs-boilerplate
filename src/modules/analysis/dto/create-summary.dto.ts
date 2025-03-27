import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEnum, IsOptional } from 'class-validator';
import { SummaryType } from '../entities/summary.entity';

export class CreateSummaryDto {
  @ApiProperty({ description: 'Type of summary', enum: SummaryType })
  @IsEnum(SummaryType)
  type: SummaryType;

  @ApiProperty({ description: 'Summary text content' })
  @IsString()
  text: string;

  @ApiProperty({ description: 'Reviewer comments on the summary', required: false })
  @IsString()
  @IsOptional()
  reviewerComments?: string;
} 