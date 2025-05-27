import {
  // decorators here

  IsNumber,
  IsDate,
  IsString,
} from 'class-validator';

import {
  // decorators here
  ApiProperty,
} from '@nestjs/swagger';

import {
  // decorators here

  Transform,
} from 'class-transformer';

export class CreatePaymentDto {
  @ApiProperty({
    required: true,
    type: () => String,
  })
  @IsString()
  status: string;

  @ApiProperty({
    required: true,
    type: () => String,
  })
  @IsString()
  method: string;

  @ApiProperty({
    required: true,
    type: () => Date,
  })
  @Transform(({ value }) => new Date(value))
  @IsDate()
  paymentDate: Date;

  @ApiProperty({
    required: true,
    type: () => Number,
  })
  @IsNumber()
  amount: number;

  // Don't forget to use the class-validator decorators in the DTO properties.
}
