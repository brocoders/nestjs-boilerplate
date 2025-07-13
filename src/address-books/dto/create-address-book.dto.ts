import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsBoolean,
  ValidateNested,
  IsNotEmptyObject,
  MaxLength,
} from 'class-validator';
import { Type } from 'class-transformer';
import { UserDto } from '../../users/dto/user.dto';

export class BaseCreateAddressBookDto {
  @ApiPropertyOptional({
    description: 'Mark as favorite (optional)',
    type: Boolean,
    example: false,
  })
  @IsOptional()
  @IsBoolean()
  isFavorite?: boolean;

  @ApiPropertyOptional({
    description: 'Optional notes for this address',
    type: String,
    example: 'For Binance withdrawals',
  })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  notes?: string;

  @ApiPropertyOptional({
    description: 'Optional memo for this address',
    type: String,
    example: 'memo123',
  })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  memo?: string;

  @ApiPropertyOptional({
    description: 'Optional tag/category for grouping',
    type: String,
    example: 'CeFi',
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  tag?: string;

  @ApiProperty({
    description: 'Type of asset (e.g., token, NFT)',
    type: String,
    example: 'token',
  })
  @IsString()
  @MaxLength(50)
  assetType: string;

  @ApiProperty({
    description: 'Blockchain name (e.g., Ethereum)',
    type: String,
    example: 'Ethereum',
  })
  @IsString()
  @MaxLength(50)
  blockchain: string;

  @ApiProperty({
    description: 'Blockchain address',
    type: String,
    example: '0x89Ab32156e46F46D02ade3FEcbe5Fc4243B9AAeD',
  })
  @IsString()
  @MaxLength(255)
  address: string;

  @ApiProperty({
    description: 'Human-readable label for this address',
    type: String,
    example: 'Main Wallet',
  })
  @IsString()
  @MaxLength(255)
  label: string;
}
export class CreateAddressBookUserDto extends BaseCreateAddressBookDto {}

export class CreateAddressBookDto extends BaseCreateAddressBookDto {
  @ApiProperty({
    description: 'User information for the address book entry',
    required: true,
    type: () => UserDto,
  })
  @ValidateNested()
  @Type(() => UserDto)
  @IsNotEmptyObject()
  user: UserDto;
}
