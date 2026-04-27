import { ApiProperty } from '@nestjs/swagger';

export enum VendorStatus {
  PENDING = 'PENDING',
  ACTIVE = 'ACTIVE',
  SUSPENDED = 'SUSPENDED',
}

export class Vendor {
  @ApiProperty({ example: '0190a4d5-3d23-7c2a-bb50-9c0f3a59c1a0' })
  id!: string;

  @ApiProperty({ example: 12 })
  userId!: number;

  @ApiProperty({ example: 'sample-shop' })
  slug!: string;

  @ApiProperty({ example: { en: 'Sample Shop', ar: 'متجر العينة' } })
  nameTranslations!: Record<string, string>;

  @ApiProperty({ example: { en: 'Curated goods.', ar: 'بضائع مختارة.' } })
  descriptionTranslations!: Record<string, string>;

  @ApiProperty({
    example: '0190a4d5-3d23-7c2a-bb50-9c0f3a59c1a0',
    nullable: true,
  })
  logoFileId!: string | null;

  @ApiProperty({
    example: '0190a4d5-3d23-7c2a-bb50-9c0f3a59c1a0',
    nullable: true,
  })
  bannerFileId!: string | null;

  @ApiProperty({ enum: VendorStatus, example: VendorStatus.PENDING })
  status!: VendorStatus;

  @ApiProperty({ example: '0190a4d5-3d23-7c2a-bb50-9c0f3a59c1a0' })
  defaultRegionId!: string;

  @ApiProperty({ example: ['0190a4d5-3d23-7c2a-bb50-9c0f3a59c1a0'] })
  supportedRegionIds!: string[];

  @ApiProperty({ example: 14 })
  returnWindowDays!: number;

  @ApiProperty({ example: 'SA', nullable: true })
  shipsFromCountry!: string | null;

  createdAt!: Date;
  updatedAt!: Date;
}
