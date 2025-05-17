import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';

export class UpdateRiskFlagDto {
  @ApiProperty({ enum: ['open', 'resolved', 'ignored'] })
  @IsEnum(['open', 'resolved', 'ignored'])
  status: 'open' | 'resolved' | 'ignored';

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  notes?: string;
}
