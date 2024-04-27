import { ApiResponseProperty } from '@nestjs/swagger';
import { User } from '../../users/domain/user';

export class LoginResponseDto {
  @ApiResponseProperty()
  token: string;

  @ApiResponseProperty()
  refreshToken: string;

  @ApiResponseProperty()
  tokenExpires: number;

  @ApiResponseProperty({
    type: () => User,
  })
  user: User;
}
