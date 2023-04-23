import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from 'src/auth/auth.service';
import { AuthFacebookService } from './auth-facebook.service';
import { AuthFacebookLoginDto } from './dto/auth-facebook-login.dto';
import { LoginResponseType } from '../utils/types/auth/login-response.type';

@ApiTags('Auth')
@Controller({
  path: 'auth/facebook',
  version: '1',
})
export class AuthFacebookController {
  constructor(
    private readonly authService: AuthService,
    private readonly authFacebookService: AuthFacebookService,
  ) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() loginDto: AuthFacebookLoginDto,
  ): Promise<LoginResponseType> {
    const socialData = await this.authFacebookService.getProfileByToken(
      loginDto,
    );

    return this.authService.validateSocialLogin('facebook', socialData);
  }
}
