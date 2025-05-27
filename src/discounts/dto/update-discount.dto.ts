// Don't forget to use the class-validator decorators in the DTO properties.
// import { Allow } from 'class-validator';

import { PartialType } from '@nestjs/swagger';
import { CreateDiscountDto } from './create-discount.dto';

export class UpdateDiscountDto extends PartialType(CreateDiscountDto) {}
