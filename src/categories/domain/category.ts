import { ApiProperty } from '@nestjs/swagger';

export class Category {
  @ApiProperty({ example: '0190a4d5-3d23-7c2a-bb50-9c0f3a59c1a0' })
  id!: string;

  @ApiProperty({ example: null, nullable: true })
  parentId!: string | null;

  @ApiProperty({ example: 'apparel' })
  slug!: string;

  @ApiProperty({ example: { en: 'Apparel', ar: 'ملابس' } })
  nameTranslations!: Record<string, string>;

  @ApiProperty({ example: 'solar:t-shirt-bold-duotone', nullable: true })
  icon!: string | null;

  @ApiProperty({ example: 0 })
  position!: number;

  @ApiProperty({ example: true })
  isActive!: boolean;

  createdAt!: Date;
  updatedAt!: Date;
}
