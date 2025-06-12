import { UserDto } from '../../users/dto/user.dto';
import { Type } from 'class-transformer';

import {
  ValidateNested,
  IsNotEmptyObject,
  IsEnum,
  IsNotEmpty,
} from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';
import { PassphraseLocation } from '../types/passphrases.enum';
import { getEnumErrorMessage } from '../../utils/helpers/enum.helper';

export class BaseCreatePassphraseDto {
  @ApiProperty({
    type: String,
    required: true,
    enum: PassphraseLocation,
    description: 'The location where the passphrase is stored.',
  })
  @IsEnum(PassphraseLocation, {
    message: getEnumErrorMessage(PassphraseLocation, 'Location'),
  })
  @IsNotEmpty()
  location: PassphraseLocation;
}

export class CreatePassphraseDto extends BaseCreatePassphraseDto {
  @ApiProperty({
    required: true,
    type: () => UserDto,
  })
  @ValidateNested()
  @Type(() => UserDto)
  @IsNotEmptyObject()
  user: UserDto;
}

export class CreatePassphraseUserDto extends BaseCreatePassphraseDto {}
