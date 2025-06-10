import { ApiProperty } from '@nestjs/swagger';

export class AddressBookUserResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  label: string;

  @ApiProperty()
  address: string;

  @ApiProperty()
  blockchain: string;

  @ApiProperty()
  assetType: string;

  @ApiProperty({ required: false, nullable: true })
  isFavorite?: boolean;

  @ApiProperty({ required: false, nullable: true })
  notes?: string;

  @ApiProperty({ required: false, nullable: true })
  memo?: string;

  @ApiProperty({ required: false, nullable: true })
  tag?: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
