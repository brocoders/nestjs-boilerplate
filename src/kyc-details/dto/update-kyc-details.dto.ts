// Don't forget to use the class-validator decorators in the DTO properties.
// import { Allow } from 'class-validator';

import { PartialType } from '@nestjs/swagger';
import { CreateKycDetailsDto } from './create-kyc-details.dto';

export class UpdateKycDetailsDto extends PartialType(CreateKycDetailsDto) {}
