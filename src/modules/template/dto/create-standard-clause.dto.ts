import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsArray,
  ValidateNested,
  IsEnum,
} from 'class-validator';
import { Type } from 'class-transformer';

export enum SeverityLevel {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
}

export class AllowedDeviationDto {
  @ApiProperty({ description: 'Type of deviation' })
  @IsString()
  type: string;

  @ApiProperty({ description: 'Description of the deviation' })
  @IsString()
  description: string;

  @ApiProperty({
    description: 'Severity level of the deviation',
    enum: SeverityLevel,
  })
  @IsEnum(SeverityLevel)
  severity: SeverityLevel;
}

export class CreateStandardClauseDto {
  @ApiProperty({ description: 'Name of the standard clause' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'Type of the standard clause' })
  @IsString()
  type: string;

  @ApiProperty({ description: 'Text content of the standard clause' })
  @IsString()
  text: string;

  @ApiProperty({ description: 'Jurisdiction this clause applies to' })
  @IsString()
  jurisdiction: string;

  @ApiProperty({
    description: 'Description of the standard clause',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: 'Allowed deviations from the standard clause',
    required: false,
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AllowedDeviationDto)
  @IsOptional()
  allowedDeviations?: AllowedDeviationDto[];
}
