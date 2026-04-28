import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsInt,
  IsOptional,
  IsString,
  IsUUID,
  Matches,
  Min,
} from 'class-validator';

export class SetVariantPriceDto {
  @ApiProperty({ example: '0190a4d5-3d23-7c2a-bb50-9c0f3a59c1a0' })
  @IsUUID()
  regionId!: string;

  // Accept either a JSON number (small) or a numeric string (safe for big values).
  // We coerce to string in the service before persisting to bigint.
  @ApiProperty({ example: '9900' })
  @IsString()
  @Matches(/^\d+$/, {
    message: 'priceMinorUnits must be a non-negative integer (as a string)',
  })
  priceMinorUnits!: string;

  @ApiPropertyOptional({ example: '12900' })
  @IsOptional()
  @IsString()
  @Matches(/^\d+$/, {
    message:
      'compareAtPriceMinorUnits must be a non-negative integer (as a string)',
  })
  compareAtPriceMinorUnits?: string;

  // Reserved for future use, not persisted yet.
  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  @Min(0)
  taxBucket?: number;
}
