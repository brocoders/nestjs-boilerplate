import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsOptional,
  IsString,
  IsNumber,
  Min,
  IsObject,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

class BudgetRangeDto {
  @ApiPropertyOptional({ description: 'Minimum budget value' })
  @IsNumber()
  @Min(0)
  min: number;

  @ApiPropertyOptional({ description: 'Maximum budget value' })
  @IsNumber()
  @Min(0)
  max: number;
}

export class MapAreasFilterDto {
  @ApiPropertyOptional({ description: 'Filter by area name' })
  @IsOptional()
  @IsString()
  area?: string;

  @ApiPropertyOptional({ description: 'Filter by intervention type' })
  @IsOptional()
  @IsString()
  intervention?: string;

  @ApiPropertyOptional({ description: 'Filter by budget range' })
  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => BudgetRangeDto)
  budget?: BudgetRangeDto;

  @ApiPropertyOptional({ description: 'Filter by priority level' })
  @IsOptional()
  @IsString()
  priority?: string;

  @ApiPropertyOptional({ description: 'Filter by participation level' })
  @IsOptional()
  @IsString()
  participation?: string;
}
