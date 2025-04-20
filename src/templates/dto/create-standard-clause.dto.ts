import { IsString, IsOptional, IsObject, IsBoolean } from 'class-validator';

export class CreateStandardClauseDto {
  @IsString()
  name: string;

  @IsString()
  type: string;

  @IsString()
  content: string;

  @IsString()
  @IsOptional()
  jurisdiction?: string;

  @IsString()
  @IsOptional()
  version?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsObject()
  @IsOptional()
  metadata?: Record<string, any>;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
} 