import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsInt,
  IsOptional,
  IsString,
  IsUUID,
  Length,
  Max,
  Min,
} from 'class-validator';

export class UpdateVendorDto {
  @ApiPropertyOptional({ example: { en: 'Sample Shop', ar: 'متجر العينة' } })
  @IsOptional()
  nameTranslations?: Record<string, string>;

  @ApiPropertyOptional({
    example: { en: 'Curated goods.', ar: 'بضائع مختارة.' },
  })
  @IsOptional()
  descriptionTranslations?: Record<string, string>;

  @ApiPropertyOptional({ example: '0190a4d5-3d23-7c2a-bb50-9c0f3a59c1a0' })
  @IsOptional()
  @IsUUID()
  logoFileId?: string;

  @ApiPropertyOptional({ example: '0190a4d5-3d23-7c2a-bb50-9c0f3a59c1a0' })
  @IsOptional()
  @IsUUID()
  bannerFileId?: string;

  @ApiPropertyOptional({ example: 14 })
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(90)
  returnWindowDays?: number;

  @ApiPropertyOptional({ example: 'SA' })
  @IsOptional()
  @IsString()
  @Length(2, 2)
  shipsFromCountry?: string;

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @IsArray()
  @IsUUID('all', { each: true })
  supportedRegionIds?: string[];
}
