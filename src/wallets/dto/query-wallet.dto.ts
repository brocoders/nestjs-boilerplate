import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString } from 'class-validator';
import { Transform } from 'class-transformer';

export class FilterWalletsDto {
  @ApiPropertyOptional({
    description: 'Wallet provider name (e.g., Fireblocks, Coinbase)',
    example: 'Fireblocks',
  })
  @IsOptional()
  @IsString()
  provider?: string;

  @ApiPropertyOptional({
    description: 'Lockup ID associated with this wallet',
    example: 'lockup-1234',
  })
  @IsOptional()
  @IsString()
  lockupId?: string;

  @ApiPropertyOptional({
    description: 'Label associated with the wallet',
    example: 'Main wallet',
  })
  @IsOptional()
  @IsString()
  label?: string;

  @ApiPropertyOptional({
    description: 'Whether this wallet is active',
    example: true,
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true' || value === true)
  active?: boolean = false;
}
