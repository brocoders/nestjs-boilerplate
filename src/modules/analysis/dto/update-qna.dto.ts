import { PartialType } from '@nestjs/swagger';
import { CreateQnADto } from './create-qna.dto';

export class UpdateQnADto extends PartialType(CreateQnADto) {} 