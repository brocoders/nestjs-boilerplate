import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsObject,
  IsOptional,
  IsString,
  IsUUID,
  Length,
  Matches,
  Validate,
} from 'class-validator';
import { ProductNameTranslationsHasEnOrArConstraint } from './create-product.dto';

export class UpdateProductDto {
  @ApiPropertyOptional({ example: 'classic-tee' })
  @IsOptional()
  @IsString()
  @Length(1, 96)
  @Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
    message: 'slug must be lowercase alphanumeric with single dashes',
  })
  slug?: string;

  @ApiPropertyOptional({ example: { en: 'Classic Tee', ar: 'تيشيرت كلاسيك' } })
  @IsOptional()
  @IsObject()
  @Validate(ProductNameTranslationsHasEnOrArConstraint)
  nameTranslations?: Record<string, string>;

  @ApiPropertyOptional({ example: { en: 'Soft cotton.', ar: 'قطن ناعم.' } })
  @IsOptional()
  @IsObject()
  descriptionTranslations?: Record<string, string>;

  @ApiPropertyOptional({ example: '0190a4d5-3d23-7c2a-bb50-9c0f3a59c1a0' })
  @IsOptional()
  @IsUUID()
  categoryId?: string | null;

  @ApiPropertyOptional({ example: 'SAR' })
  @IsOptional()
  @IsString()
  @Length(3, 3)
  @Matches(/^[A-Z]{3}$/, {
    message: 'baseCurrency must be 3 uppercase letters (ISO 4217)',
  })
  baseCurrency?: string;

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @IsArray()
  @IsUUID('all', { each: true })
  supportedRegionIds?: string[];
}
