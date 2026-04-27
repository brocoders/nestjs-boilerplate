import { ApiProperty } from '@nestjs/swagger';

export class ProductOptionValue {
  @ApiProperty({ example: '0190a4d5-3d23-7c2a-bb50-9c0f3a59c1a0' })
  id!: string;

  @ApiProperty({ example: '0190a4d5-3d23-7c2a-bb50-9c0f3a59c1a0' })
  optionTypeId!: string;

  @ApiProperty({ example: 'red' })
  slug!: string;

  @ApiProperty({ example: { en: 'Red', ar: 'أحمر' } })
  valueTranslations!: Record<string, string>;

  @ApiProperty({ example: '#FF5A7A', nullable: true })
  swatchColor!: string | null;

  @ApiProperty({ example: 0 })
  position!: number;

  createdAt!: Date;
  updatedAt!: Date;
}
