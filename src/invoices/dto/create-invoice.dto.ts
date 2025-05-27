import { UserDto } from '../../users/dto/user.dto';

import {
  // decorators here
  Type,
  Transform,
} from 'class-transformer';

import {
  // decorators here

  ValidateNested,
  IsNotEmptyObject,
  IsOptional,
  IsNumber,
  IsDate,
  IsString,
} from 'class-validator';

import {
  // decorators here
  ApiProperty,
} from '@nestjs/swagger';

export class CreateInvoiceDto {
  @ApiProperty({
    required: false,
    type: () => String,
  })
  @IsOptional()
  @IsString()
  breakdown?: string | null;

  @ApiProperty({
    required: true,
    type: () => String,
  })
  @IsString()
  status: string;

  @ApiProperty({
    required: false,
    type: () => Date,
  })
  @IsOptional()
  @Transform(({ value }) => new Date(value))
  @IsDate()
  dueDate?: Date | null;

  @ApiProperty({
    required: true,
    type: () => Number,
  })
  @IsNumber()
  amount: number;

  @ApiProperty({
    required: false,
    type: () => UserDto,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => UserDto)
  @IsNotEmptyObject()
  customer?: UserDto | null;

  // Don't forget to use the class-validator decorators in the DTO properties.
}
