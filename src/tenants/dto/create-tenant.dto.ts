import {
  // decorators here
  IsBoolean,
  IsOptional,
} from 'class-validator';

import {
  // decorators here
  ApiProperty,
} from '@nestjs/swagger';

export class CreateTenantDto {
  @ApiProperty({
    required: false,
    type: () => Boolean,
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  // Don't forget to use the class-validator decorators in the DTO properties.
}
