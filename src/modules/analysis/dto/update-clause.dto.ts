import { PartialType } from '@nestjs/swagger';
import { CreateClauseDto } from './create-clause.dto';

export class UpdateClauseDto extends PartialType(CreateClauseDto) {}
