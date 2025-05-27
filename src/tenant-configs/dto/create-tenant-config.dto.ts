import {
  // decorators here

  IsString,
} from 'class-validator';

import {
  // decorators here
  ApiProperty,
} from '@nestjs/swagger';

export class CreateTenantConfigDto {
  @ApiProperty({
    required: true,
    type: () => String,
  })
  @IsString()
  value: string;

  @ApiProperty({
    required: true,
    type: () => String,
  })
  @IsString()
  key: string;

  @ApiProperty({
    required: true,
    type: () => String,
  })
  @IsString()
  tenantId: string;

  // Don't forget to use the class-validator decorators in the DTO properties.
}
