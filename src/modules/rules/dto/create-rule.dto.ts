import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsNumber, Max, Min } from 'class-validator';

export class CreateRuleDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  pattern?: string;

  @ApiProperty({ required: false, type: Number })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  similarityThreshold?: number;

  @ApiProperty({ required: false, type: Number })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  deviationAllowedPct?: number;
}
