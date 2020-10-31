import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { JwtStrategy } from './jwt.strategy';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/user.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AnonymousStrategy } from './anonymous.strategy';
import { Forgot } from 'src/forgot/forgot.entity';
import { AppleModule } from 'src/apple/apple.module';
import { AppleService } from 'src/apple/apple.service';
import { FacebookModule } from 'src/facebook/facebook.module';
import { FacebookService } from 'src/facebook/facebook.service';
import { GoogleModule } from 'src/google/google.module';
import { GoogleService } from 'src/google/google.service';
import { TwitterModule } from 'src/twitter/twitter.module';
import { TwitterService } from 'src/twitter/twitter.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Forgot]),
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('auth.secret'),
        signOptions: {
          expiresIn: configService.get('auth.expires'),
        },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    UsersService,
    JwtStrategy,
    AnonymousStrategy,
    ConfigModule,
    ConfigService,
    FacebookModule,
    FacebookService,
    GoogleModule,
    GoogleService,
    TwitterModule,
    TwitterService,
    AppleModule,
    AppleService,
  ],
})
export class AuthModule {}
