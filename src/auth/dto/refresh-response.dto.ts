import { ApiResponseProperty } from '@nestjs/swagger';

export class RefreshResponseDto {
  @ApiResponseProperty()
  token: string;

  @ApiResponseProperty()
  refreshToken: string;

  @ApiResponseProperty()
  tokenExpires: number;
}
