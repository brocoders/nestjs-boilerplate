import {
  // decorators here

  IsString,
  IsOptional,
  IsDate,
} from 'class-validator';

import {
  // decorators here
  ApiProperty,
} from '@nestjs/swagger';

import {
  // decorators here

  Transform,
} from 'class-transformer';

export class CreateMessageDto {
  @ApiProperty({
    required: false,
    type: () => String,
  })
  @IsOptional()
  @IsString()
  physicalDeviceId?: string | null;

  @ApiProperty({
    required: false,
    type: () => Date,
  })
  @IsOptional()
  @Transform(({ value }) => new Date(value))
  @IsDate()
  lastSeen?: Date | null;

  @ApiProperty({
    required: true,
    type: () => String,
  })
  @IsString()
  message: string;

  // Don't forget to use the class-validator decorators in the DTO properties.
}
