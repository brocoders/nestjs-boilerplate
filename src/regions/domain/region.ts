import { ApiProperty } from '@nestjs/swagger';

export class Region {
  @ApiProperty({ example: '0190a4d5-3d23-7c2a-bb50-9c0f3a59c1a0' })
  id!: string;

  @ApiProperty({ example: 'SA' })
  code!: string;

  @ApiProperty({
    example: { en: 'Saudi Arabia', ar: 'المملكة العربية السعودية' },
  })
  nameTranslations!: Record<string, string>;

  @ApiProperty({ example: 'SAR' })
  currencyCode!: string;

  @ApiProperty({ example: 'ar' })
  defaultLocale!: string;

  @ApiProperty({ example: true })
  isEnabled!: boolean;

  @ApiProperty({ example: true })
  isDefault!: boolean;

  createdAt!: Date;
  updatedAt!: Date;
}
