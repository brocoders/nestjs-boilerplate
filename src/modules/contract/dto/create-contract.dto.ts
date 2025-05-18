import { IsString, IsOptional, IsEnum } from 'class-validator';

export class CreateContractDto {
  @IsString()
  title: string;

  @IsString()
  filename: string;

  @IsString()
  contractType: string;

  @IsString()
  @IsOptional()
  fullText?: string;

  @IsString()
  @IsOptional()
  governingLaw?: string;

  @IsString()
  @IsOptional()
  parties?: string;

  @IsEnum(['DRAFT', 'IN_REVIEW', 'REVIEWED', 'APPROVED', 'REJECTED'])
  @IsOptional()
  status?: string;

  @IsString()
  @IsOptional()
  language?: string;
}
