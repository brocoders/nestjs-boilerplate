import { PartialType } from '@nestjs/swagger';
import { CreateStandardClauseDto } from './create-standard-clause.dto';

export class UpdateStandardClauseDto extends PartialType(CreateStandardClauseDto) {}
