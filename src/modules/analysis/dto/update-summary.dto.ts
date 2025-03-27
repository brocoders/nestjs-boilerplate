import { PartialType } from '@nestjs/swagger';
import { CreateSummaryDto } from './create-summary.dto';

export class UpdateSummaryDto extends PartialType(CreateSummaryDto) {} 