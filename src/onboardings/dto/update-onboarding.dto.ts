// Don't forget to use the class-validator decorators in the DTO properties.
// import { Allow } from 'class-validator';

import { PartialType } from '@nestjs/swagger';
import { CreateOnboardingDto } from './create-onboarding.dto';

export class UpdateOnboardingDto extends PartialType(CreateOnboardingDto) {
  tenant: any;
  user: any;
}
