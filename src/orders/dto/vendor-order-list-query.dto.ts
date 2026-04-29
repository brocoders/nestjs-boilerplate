import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, Max, Min } from 'class-validator';
import { SubOrderFulfillmentStatus } from '../domain/order-enums';

export class VendorOrderListQueryDto {
  @ApiPropertyOptional({ enum: SubOrderFulfillmentStatus })
  @IsOptional()
  @IsEnum(SubOrderFulfillmentStatus)
  status?: SubOrderFulfillmentStatus;

  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number;

  @ApiPropertyOptional({ example: 20 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number;
}
