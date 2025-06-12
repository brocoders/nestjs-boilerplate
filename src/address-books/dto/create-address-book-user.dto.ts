import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsBoolean, MaxLength } from 'class-validator';

export class CreateAddressBookUserDto {
  @ApiProperty({
    required: false,
    type: Boolean,
    description: 'Mark as favorite (optional)',
  })
  @IsOptional()
  @IsBoolean()
  isFavorite?: boolean;

  @ApiProperty({
    required: false,
    type: String,
    description: 'Optional notes for this address',
  })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  notes?: string;

  @ApiProperty({
    required: false,
    type: String,
    description: 'Optional memo for this address',
  })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  memo?: string;

  @ApiProperty({
    required: false,
    type: String,
    description: 'Optional tag/category for grouping',
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  tag?: string;

  @ApiProperty({
    required: true,
    type: String,
    description: 'Type of asset (e.g., token, NFT)',
  })
  @IsString()
  @MaxLength(50)
  assetType: string;

  @ApiProperty({
    required: true,
    type: String,
    description: 'Blockchain name (e.g., Ethereum)',
  })
  @IsString()
  @MaxLength(50)
  blockchain: string;

  @ApiProperty({
    required: true,
    type: String,
    description: 'Blockchain address',
  })
  @IsString()
  @MaxLength(255)
  address: string;

  @ApiProperty({
    required: true,
    type: String,
    description: 'Human-readable label for this address',
  })
  @IsString()
  @MaxLength(255)
  label: string;
}
