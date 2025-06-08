// Don't forget to use the class-validator decorators in the DTO properties.
// import { Allow } from 'class-validator';

import { PartialType } from '@nestjs/swagger';
import { CreateAddressBookDto } from './create-address-book.dto';

export class UpdateAddressBookDto extends PartialType(CreateAddressBookDto) {}
