import { PartialType } from '@nestjs/mapped-types';
import { CreatePricingDto } from './create-pricing.dto';

export class UpdatePricingDto extends PartialType(CreatePricingDto) {}
