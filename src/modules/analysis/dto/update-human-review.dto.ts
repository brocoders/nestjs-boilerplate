import { PartialType } from '@nestjs/swagger';
import { CreateHumanReviewDto } from './create-human-review.dto';

export class UpdateHumanReviewDto extends PartialType(CreateHumanReviewDto) {}
