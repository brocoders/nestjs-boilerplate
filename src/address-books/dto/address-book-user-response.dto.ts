import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsOptional,
  IsString,
  IsUUID,
  IsDateString,
} from 'class-validator';

export class AddressBookUserResponseDto {
  @ApiProperty({
    description: 'Unique ID of the address book entry',
    example: 'de5b8c12-3f97-4a13-b0dc-fd713f9f26e7',
  })
  @IsUUID()
  id: string;

  @ApiProperty({
    description: 'Label assigned to the address',
    example: 'My Binance Wallet',
  })
  @IsString()
  label: string;

  @ApiProperty({
    description: 'Blockchain address',
    example: '0x89Ab32156e46F46D02ade3FEcbe5Fc4243B9AAeD',
  })
  @IsString()
  address: string;

  @ApiProperty({
    description: 'Blockchain network (e.g., Ethereum)',
    example: 'Ethereum',
  })
  @IsString()
  blockchain: string;

  @ApiProperty({
    description: 'Type of the asset (e.g., token, NFT)',
    example: 'token',
  })
  @IsString()
  assetType: string;

  @ApiProperty({
    required: false,
    nullable: true,
    description: 'Whether this address is marked as favorite',
    example: false,
  })
  @IsOptional()
  @IsBoolean()
  isFavorite?: boolean;

  @ApiProperty({
    required: false,
    nullable: true,
    description: 'Optional user notes for this address',
    example: 'Personal savings wallet',
  })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiProperty({
    required: false,
    nullable: true,
    description: 'Optional memo field',
    example: '123456',
  })
  @IsOptional()
  @IsString()
  memo?: string;

  @ApiProperty({
    required: false,
    nullable: true,
    description: 'Tag/category label for this entry',
    example: 'CeFi',
  })
  @IsOptional()
  @IsString()
  tag?: string;

  @ApiProperty({
    description: 'Creation timestamp',
    format: 'date-time',
    example: '2024-07-13T12:34:56.789Z',
  })
  @IsDateString()
  createdAt: Date;

  @ApiProperty({
    description: 'Last update timestamp',
    format: 'date-time',
    example: '2024-07-14T09:21:45.123Z',
  })
  @IsDateString()
  updatedAt: Date;
}
