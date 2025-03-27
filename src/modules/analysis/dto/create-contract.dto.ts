import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEnum, IsOptional, IsArray, ValidateNested, IsDate } from 'class-validator';
import { Type } from 'class-transformer';
import { ContractType } from '../entities/contract.entity';

export class PartyDto {
  @ApiProperty({ description: 'Name of the party' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'Role of the party in the contract' })
  @IsString()
  role: string;

  @ApiProperty({ description: 'Type of the party', enum: ['individual', 'organization'] })
  @IsString()
  type: 'individual' | 'organization';
}

export class CreateContractDto {
  @ApiProperty({ description: 'Title or filename of the contract' })
  @IsString()
  title: string;

  @ApiProperty({ description: 'Type of the contract', enum: ContractType })
  @IsEnum(ContractType)
  type: ContractType;

  @ApiProperty({ description: 'Original text content of the contract', required: false })
  @IsString()
  @IsOptional()
  originalText?: string;

  @ApiProperty({ description: 'Governing law of the contract', required: false })
  @IsString()
  @IsOptional()
  governingLaw?: string;

  @ApiProperty({ description: 'Parties involved in the contract', required: false })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PartyDto)
  @IsOptional()
  parties?: PartyDto[];

  @ApiProperty({ description: 'Date when the contract was uploaded', required: false })
  @IsDate()
  @IsOptional()
  uploadDate?: Date;

  @ApiProperty({ description: 'Language of the contract', required: false })
  @IsString()
  @IsOptional()
  language?: string;
} 