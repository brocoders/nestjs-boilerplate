import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsObject,
  IsOptional,
  IsString,
  IsUUID,
  Length,
  Matches,
  Validate,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'ProductNameTranslationsHasEnOrAr', async: false })
export class ProductNameTranslationsHasEnOrArConstraint implements ValidatorConstraintInterface {
  validate(value: unknown): boolean {
    if (!value || typeof value !== 'object') return false;
    const v = value as Record<string, unknown>;
    const en = typeof v.en === 'string' && v.en.trim().length > 0;
    const ar = typeof v.ar === 'string' && v.ar.trim().length > 0;
    return en || ar;
  }
  defaultMessage(): string {
    return 'nameTranslations must include at least one of {en, ar} as a non-empty string';
  }
}

export class CreateProductDto {
  @ApiProperty({ example: 'classic-tee' })
  @IsString()
  @Length(1, 96)
  @Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
    message: 'slug must be lowercase alphanumeric with single dashes',
  })
  slug!: string;

  @ApiProperty({ example: { en: 'Classic Tee', ar: 'تيشيرت كلاسيك' } })
  @IsObject()
  @Validate(ProductNameTranslationsHasEnOrArConstraint)
  nameTranslations!: Record<string, string>;

  @ApiPropertyOptional({ example: { en: 'Soft cotton.', ar: 'قطن ناعم.' } })
  @IsOptional()
  @IsObject()
  descriptionTranslations?: Record<string, string>;

  @ApiPropertyOptional({ example: '0190a4d5-3d23-7c2a-bb50-9c0f3a59c1a0' })
  @IsOptional()
  @IsUUID()
  categoryId?: string;

  @ApiProperty({ example: 'SAR' })
  @IsString()
  @Length(3, 3)
  @Matches(/^[A-Z]{3}$/, {
    message: 'baseCurrency must be 3 uppercase letters (ISO 4217)',
  })
  baseCurrency!: string;

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @IsArray()
  @IsUUID('all', { each: true })
  supportedRegionIds?: string[];
}
