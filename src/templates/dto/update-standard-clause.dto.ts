import { PartialType } from '@nestjs/mapped-types';
import { CreateStandardClauseDto } from './create-standard-clause.dto';

export class UpdateStandardClauseDto extends PartialType(CreateStandardClauseDto) {} 