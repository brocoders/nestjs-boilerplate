import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from 'src/auth/auth.service';
import { AuthTwitterService } from './auth-twitter.service';
import { AuthTwitterLoginDto } from './dto/auth-twitter-login.dto';

@ApiTags('Auth')
@Controller({
  path: 'auth/twitter',
  version: '1',
})
export class AuthTwitterController {
  constructor(
    public authService: AuthService,
    public authTwitterService: AuthTwitterService,
  ) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: AuthTwitterLoginDto) {
    const socialData = await this.authTwitterService.getProfileByToken(
      loginDto,
    );

    return this.authService.validateSocialLogin('twitter', socialData);
  }
}
