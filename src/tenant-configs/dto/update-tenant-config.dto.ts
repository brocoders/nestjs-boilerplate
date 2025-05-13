// Don't forget to use the class-validator decorators in the DTO properties.
// import { Allow } from 'class-validator';

import { PartialType } from '@nestjs/swagger';
import { CreateTenantConfigDto } from './create-tenant-config.dto';

export class UpdateTenantConfigDto extends PartialType(CreateTenantConfigDto) {}
