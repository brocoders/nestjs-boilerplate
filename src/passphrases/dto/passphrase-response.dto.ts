import { OmitType } from '@nestjs/swagger';
import { Passphrase } from '../domain/passphrase';

export class PassphraseUserResponseDto extends OmitType(Passphrase, [
  'user',
] as const) {}
