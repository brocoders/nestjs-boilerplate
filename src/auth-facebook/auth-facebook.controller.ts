import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from 'src/auth/auth.service';
import { AuthFacebookService } from './auth-facebook.service';
import { AuthFacebookLoginDto } from './dtos/auth-facebook-login.dto';

@ApiTags('Auth')
@Controller('auth/facebook')
export class AuthFacebookController {
  constructor(
    public authService: AuthService,
    public authFacebookService: AuthFacebookService,
  ) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: AuthFacebookLoginDto) {
    const socialData = await this.authFacebookService.getProfileByToken(
      loginDto,
    );

    return this.authService.validateSocialLogin('facebook', socialData);
  }
}
