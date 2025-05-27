// Don't forget to use the class-validator decorators in the DTO properties.
// import { Allow } from 'class-validator';

import { PartialType } from '@nestjs/swagger';
import { CreateVendorBillDto } from './create-vendor-bill.dto';

export class UpdateVendorBillDto extends PartialType(CreateVendorBillDto) {}
