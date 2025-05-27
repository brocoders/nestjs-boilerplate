// Don't forget to use the class-validator decorators in the DTO properties.
// import { Allow } from 'class-validator';

import { PartialType } from '@nestjs/swagger';
import { CreateExemptionDto } from './create-exemption.dto';

export class UpdateExemptionDto extends PartialType(CreateExemptionDto) {}
