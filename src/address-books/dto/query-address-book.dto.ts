import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString } from 'class-validator';
import { Transform } from 'class-transformer';

export class FilterAddressBooksDto {
  @ApiPropertyOptional({ description: 'Blockchain name (e.g., Ethereum)' })
  @IsOptional()
  @IsString()
  blockchain?: string;

  @ApiPropertyOptional({ description: 'Asset type (e.g., token, NFT)' })
  @IsOptional()
  @IsString()
  assetType?: string;

  @ApiPropertyOptional({
    description: 'Whether the address is marked as favorite',
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true' || value === true)
  isFavorite?: boolean = false;
}
