// Don't forget to use the class-validator decorators in the DTO properties.
// import { Allow } from 'class-validator';

import { PartialType } from '@nestjs/swagger';
import { CreateReminderDto } from './create-reminder.dto';

export class UpdateReminderDto extends PartialType(CreateReminderDto) {}
