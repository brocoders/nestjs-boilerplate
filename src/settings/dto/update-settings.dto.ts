// Don't forget to use the class-validator decorators in the DTO properties.
// import { Allow } from 'class-validator';

import { PartialType } from '@nestjs/swagger';
import { CreateSettingsDto } from './create-settings.dto';

export class UpdateSettingsDto extends PartialType(CreateSettingsDto) {}
