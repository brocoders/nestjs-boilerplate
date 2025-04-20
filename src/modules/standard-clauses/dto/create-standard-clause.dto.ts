import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

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
  text: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  jurisdiction?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  version?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  allowedDeviations?: string;
} 