import { PartialType } from '@nestjs/swagger';
import { CreatePassphraseDto } from './create-passphrase.dto';

export class UpdatePassphraseDto extends PartialType(CreatePassphraseDto) {}
