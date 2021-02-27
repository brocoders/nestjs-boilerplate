import { ApiProperty } from '@nestjs/swagger';
import { Allow, Validate } from 'class-validator';
import { IsExist } from 'src/utils/validators/is-exists.validator';
import { Transform } from 'class-transformer';

export class AuthEmailLoginDto {
  @ApiProperty({ example: 'test1@example.com' })
  @Transform((value: string) => value.toLowerCase())
  @Validate(IsExist, ['User'], {
    message: 'emailNotExists',
  })
  email: string;

  @Allow()
  @ApiProperty()
  password: string;
}
