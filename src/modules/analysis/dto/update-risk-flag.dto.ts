import { PartialType } from '@nestjs/swagger';
import { CreateRiskFlagDto } from './create-risk-flag.dto';

export class UpdateRiskFlagDto extends PartialType(CreateRiskFlagDto) {} 