import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEnum, IsOptional, IsDate } from 'class-validator';
import { ReviewStatus } from '../entities/human-review.entity';

export class CreateHumanReviewDto {
  @ApiProperty({ description: 'Status of the review', enum: ReviewStatus })
  @IsEnum(ReviewStatus)
  status: ReviewStatus;

  @ApiProperty({ description: 'Reviewer comments', required: false })
  @IsString()
  @IsOptional()
  comments?: string;

  @ApiProperty({ description: 'Date when the review was started', required: false })
  @IsDate()
  @IsOptional()
  startDate?: Date;

  @ApiProperty({ description: 'Date when the review was completed', required: false })
  @IsDate()
  @IsOptional()
  completionDate?: Date;

  @ApiProperty({ description: 'ID of the user who performed the review', required: false })
  @IsString()
  @IsOptional()
  reviewerId?: string;
} 