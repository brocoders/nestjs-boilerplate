// Don't forget to use the class-validator decorators in the DTO properties.
// import { Allow } from 'class-validator';

import { PartialType } from '@nestjs/swagger';
import { CreateSystemModuleDto } from './create-system-module.dto';

export class UpdateSystemModuleDto extends PartialType(CreateSystemModuleDto) {}
