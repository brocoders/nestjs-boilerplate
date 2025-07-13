import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class FilterAddressBooksDto {
  @ApiPropertyOptional({ description: 'Blockchain name (e.g., Ethereum)' })
  @IsOptional()
  @IsString()
  blockchain?: string;

  @ApiPropertyOptional({ description: 'Asset type (e.g., token, NFT)' })
  @IsOptional()
  @IsString()
  assetType?: string;
}