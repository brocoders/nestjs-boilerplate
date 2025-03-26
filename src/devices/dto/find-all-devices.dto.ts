import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsPositive } from 'class-validator';
import { Transform, Type } from 'class-transformer';

export class FindAllDevicesDto {
  @ApiPropertyOptional()
  @Transform(({ value }) => (value ? Number(value) : 1))
  @IsNumber()
  @IsOptional()
  page?: number;

  @ApiPropertyOptional()
  @Transform(({ value }) => (value ? Number(value) : 10))
  @IsNumber()
  @IsOptional()
  limit?: number;
}

export class FindAllDevicesUserDto {
  @ApiProperty({
    description: 'Numeric ID of the user',
    example: 1,
    type: Number,
  })
  @Type(() => Number) // Automatically transform string to number
  @IsNumber({}, { message: 'userId must be a number' })
  @IsPositive({ message: 'userId must be a positive number' })
  userId: number;
}
