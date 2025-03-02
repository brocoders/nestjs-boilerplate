import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  SerializeOptions,
} from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from '../auth/auth.service';
import { AuthVeroService } from './auth-vero.service';
import { AuthVeroLoginDto } from './dto/auth-vero-login.dto';
import { LoginResponseDto } from '../auth/dto/login-response.dto';

@ApiTags('Auth')
@Controller({
  path: 'auth/vero',
  version: '1',
})
export class AuthVeroController {
  constructor(
    private readonly authService: AuthService,
    private readonly authVeroService: AuthVeroService,
  ) {}

  @ApiOkResponse({
    type: LoginResponseDto,
  })
  @SerializeOptions({
    groups: ['me'],
  })
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: AuthVeroLoginDto): Promise<LoginResponseDto> {
    const socialData = await this.authVeroService.getProfileByToken(loginDto);
    return this.authService.validateSocialLogin('vero', socialData);
  }
}
