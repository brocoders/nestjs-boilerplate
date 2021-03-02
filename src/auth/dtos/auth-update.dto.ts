import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, MinLength, Validate } from 'class-validator';
import { IsExist } from '../../utils/validators/is-exists.validator';
import { FileEntity } from '../../files/file.entity';

export class AuthUpdateDto {
  @Validate(IsExist, ['FileEntity', 'id'], {
    message: 'imageNotExists',
  })
  @ApiProperty({ type: () => FileEntity })
  photo?: FileEntity;

  @ApiProperty({ example: 'John' })
  @IsNotEmpty({ message: 'mustBeNotEmpty' })
  firstName?: string;

  @ApiProperty({ example: 'Doe' })
  @IsNotEmpty({ message: 'mustBeNotEmpty' })
  lastName?: string;

  @ApiProperty()
  @IsNotEmpty()
  @MinLength(6)
  password?: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'mustBeNotEmpty' })
  oldPassword: string;
}
