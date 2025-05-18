import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsNumber,
  Max,
  Min,
} from 'class-validator';

export class CreateStandardClauseDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  type: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  contractType: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  text: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  jurisdiction?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  version?: string;

  @ApiProperty({ required: false, type: Number })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  allowedDeviations?: number;
}
