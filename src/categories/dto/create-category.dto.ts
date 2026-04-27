import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
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
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'NameTranslationsHasEnOrAr', async: false })
export class NameTranslationsHasEnOrArConstraint implements ValidatorConstraintInterface {
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

export class CreateCategoryDto {
  @ApiProperty({ example: 'apparel' })
  @IsString()
  @Length(1, 64)
  @Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
    message: 'slug must be lowercase alphanumeric with single dashes',
  })
  slug!: string;

  @ApiProperty({ example: { en: 'Apparel', ar: 'ملابس' } })
  @IsObject()
  @Validate(NameTranslationsHasEnOrArConstraint)
  nameTranslations!: Record<string, string>;

  @ApiPropertyOptional({ example: '0190a4d5-3d23-7c2a-bb50-9c0f3a59c1a0' })
  @IsOptional()
  @IsUUID()
  parentId?: string;

  @ApiPropertyOptional({ example: 'solar:t-shirt-bold-duotone' })
  @IsOptional()
  @IsString()
  @Length(1, 128)
  icon?: string;

  @ApiPropertyOptional({ example: 0 })
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(1000)
  position?: number;
}
