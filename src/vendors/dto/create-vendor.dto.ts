import { VendorBillDto } from '../../vendor-bills/dto/vendor-bill.dto';

import {
  // decorators here

  IsString,
  IsOptional,
  IsArray,
  ValidateNested,
} from 'class-validator';

import {
  // decorators here
  ApiProperty,
} from '@nestjs/swagger';

import {
  // decorators here
  Type,
} from 'class-transformer';

export class CreateVendorDto {
  @ApiProperty({
    required: false,
    type: () => [VendorBillDto],
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => VendorBillDto)
  @IsArray()
  bills?: VendorBillDto[] | null;

  @ApiProperty({
    required: false,
    type: () => String,
  })
  @IsOptional()
  @IsString()
  paymentTerms?: string | null;

  @ApiProperty({
    required: false,
    type: () => String,
  })
  @IsOptional()
  @IsString()
  contactEmail?: string | null;

  @ApiProperty({
    required: true,
    type: () => String,
  })
  @IsString()
  name: string;

  // Don't forget to use the class-validator decorators in the DTO properties.
}
