import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class AddressSnapshot {
  @ApiProperty({ example: 'Layla Al-Mansour' })
  fullName!: string;

  @ApiProperty({ example: '+966555012345' })
  phone!: string;

  @ApiProperty({
    example: 'SA',
    description: 'ISO 3166-1 alpha-2 uppercase country code',
  })
  country!: string;

  @ApiPropertyOptional({ example: 'Riyadh', nullable: true })
  region!: string | null;

  @ApiProperty({ example: 'Riyadh' })
  city!: string;

  @ApiPropertyOptional({ example: '12343', nullable: true })
  postalCode!: string | null;

  @ApiProperty({ example: 'King Fahd Rd, Bldg 14, Apt 3' })
  street!: string;

  @ApiPropertyOptional({ example: 'Ring the upstairs bell.', nullable: true })
  notes!: string | null;
}
