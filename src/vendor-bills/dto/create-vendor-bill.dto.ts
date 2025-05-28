import { AccountsPayableDto } from '../../accounts-payables/dto/accounts-payable.dto';

import { VendorDto } from '../../vendors/dto/vendor.dto';

import {
  // decorators here
  Type,
} from 'class-transformer';

import {
  // decorators here

  ValidateNested,
  IsNotEmptyObject,
  IsOptional,
} from 'class-validator';

import {
  // decorators here
  ApiProperty,
} from '@nestjs/swagger';

export class CreateVendorBillDto {
  @ApiProperty({
    required: false,
    type: () => AccountsPayableDto,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => AccountsPayableDto)
  @IsNotEmptyObject()
  accountsPayable?: AccountsPayableDto | null;

  @ApiProperty({
    required: true,
    type: () => VendorDto,
  })
  @ValidateNested()
  @Type(() => VendorDto)
  @IsNotEmptyObject()
  vendor: VendorDto;

  // Don't forget to use the class-validator decorators in the DTO properties.
}
