import { ApiProperty } from '@nestjs/swagger';
import { IsInt, Min } from 'class-validator';

export class SetVariantStockDto {
  @ApiProperty({ example: 25 })
  @IsInt()
  @Min(0)
  quantity!: number;
}
