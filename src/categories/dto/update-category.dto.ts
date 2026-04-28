import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsInt,
  IsObject,
  IsOptional,
  IsString,
  IsUUID,
  Length,
  Matches,
  Max,
  Min,
  Validate,
} from 'class-validator';
import { NameTranslationsHasEnOrArConstraint } from './create-category.dto';

export class UpdateCategoryDto {
  @ApiPropertyOptional({ example: 'apparel' })
  @IsOptional()
  @IsString()
  @Length(1, 64)
  @Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
    message: 'slug must be lowercase alphanumeric with single dashes',
  })
  slug?: string;

  @ApiPropertyOptional({ example: { en: 'Apparel', ar: 'ملابس' } })
  @IsOptional()
  @IsObject()
  @Validate(NameTranslationsHasEnOrArConstraint)
  nameTranslations?: Record<string, string>;

  @ApiPropertyOptional({ example: '0190a4d5-3d23-7c2a-bb50-9c0f3a59c1a0' })
  @IsOptional()
  @IsUUID()
  parentId?: string | null;

  @ApiPropertyOptional({ example: 'solar:t-shirt-bold-duotone' })
  @IsOptional()
  @IsString()
  @Length(1, 128)
  icon?: string | null;

  @ApiPropertyOptional({ example: 0 })
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(1000)
  position?: number;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
