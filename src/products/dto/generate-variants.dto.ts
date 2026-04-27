import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsObject,
  IsOptional,
  IsString,
  Length,
  Matches,
  Validate,
  ValidateNested,
} from 'class-validator';
import { ProductNameTranslationsHasEnOrArConstraint } from './create-product.dto';

const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export class GenerateVariantOptionValueDto {
  @ApiProperty({ example: 'red' })
  @IsString()
  @Length(1, 48)
  @Matches(SLUG_RE, {
    message: 'option value slug must be lowercase alphanumeric with dashes',
  })
  slug!: string;

  @ApiProperty({ example: { en: 'Red', ar: 'أحمر' } })
  @IsObject()
  @Validate(ProductNameTranslationsHasEnOrArConstraint)
  valueTranslations!: Record<string, string>;

  @ApiPropertyOptional({ example: '#FF5A7A' })
  @IsOptional()
  @IsString()
  @Matches(/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/, {
    message: 'swatchColor must be a hex color like #RGB, #RRGGBB, or #RRGGBBAA',
  })
  swatchColor?: string;
}

export class GenerateVariantOptionTypeDto {
  @ApiProperty({ example: 'color' })
  @IsString()
  @Length(1, 48)
  @Matches(SLUG_RE, {
    message: 'option type slug must be lowercase alphanumeric with dashes',
  })
  slug!: string;

  @ApiProperty({ example: { en: 'Color', ar: 'اللون' } })
  @IsObject()
  @Validate(ProductNameTranslationsHasEnOrArConstraint)
  nameTranslations!: Record<string, string>;

  @ApiProperty({ type: [GenerateVariantOptionValueDto] })
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => GenerateVariantOptionValueDto)
  values!: GenerateVariantOptionValueDto[];
}

export class GenerateVariantsDto {
  @ApiProperty({ type: [GenerateVariantOptionTypeDto] })
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => GenerateVariantOptionTypeDto)
  optionTypes!: GenerateVariantOptionTypeDto[];
}
