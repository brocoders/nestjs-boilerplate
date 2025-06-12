import { ApiProperty } from '@nestjs/swagger';

export class AddressBookUserResponseDto {
  @ApiProperty({ description: 'Unique ID of the address book entry' })
  id: string;

  @ApiProperty({ description: 'Label assigned to the address' })
  label: string;

  @ApiProperty({ description: 'Blockchain address' })
  address: string;

  @ApiProperty({ description: 'Blockchain network (e.g., Ethereum)' })
  blockchain: string;

  @ApiProperty({ description: 'Type of the asset (e.g., token, NFT)' })
  assetType: string;

  @ApiProperty({
    required: false,
    nullable: true,
    type: Boolean,
    description: 'Whether this address is marked as favorite',
  })
  isFavorite?: boolean;

  @ApiProperty({
    required: false,
    nullable: true,
    type: String,
    description: 'Optional user notes for this address',
  })
  notes?: string;

  @ApiProperty({
    required: false,
    nullable: true,
    type: String,
    description: 'Optional memo field',
  })
  memo?: string;

  @ApiProperty({
    required: false,
    nullable: true,
    type: String,
    description: 'Tag/category label for this entry',
  })
  tag?: string;

  @ApiProperty({
    description: 'Creation timestamp',
    type: String,
    format: 'date-time',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Last update timestamp',
    type: String,
    format: 'date-time',
  })
  updatedAt: Date;
}
