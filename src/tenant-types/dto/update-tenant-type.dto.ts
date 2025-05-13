// Don't forget to use the class-validator decorators in the DTO properties.
// import { Allow } from 'class-validator';

import { PartialType } from '@nestjs/swagger';
import { CreateTenantTypeDto } from './create-tenant-type.dto';

export class UpdateTenantTypeDto extends PartialType(CreateTenantTypeDto) {}
