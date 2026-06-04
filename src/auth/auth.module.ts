import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategies/jwt.strategy';
import { AnonymousStrategy } from './strategies/anonymous.strategy';
import { JwtRefreshStrategy } from './strategies/jwt-refresh.strategy';
import { MailModule } from '../mail/mail.module';
import { AuthEmailController } from './providers/email/auth-email.controller';
import { AuthEmailService } from './providers/email/auth-email.service';
import { AuthFacebookController } from './providers/facebook/auth-facebook.controller';
import { AuthFacebookService } from './providers/facebook/auth-facebook.service';
import { AuthGoogleController } from './providers/google/auth-google.controller';
import { AuthGoogleService } from './providers/google/auth-google.service';
import { PrismaSessionPersistenceModule } from './session/infrastructure/persistence/prisma/prisma-persistence.module';
import { SessionService } from './session/session.service';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    UsersModule,
    PrismaSessionPersistenceModule,
    PassportModule,
    MailModule,
    JwtModule.register({}),
  ],
  controllers: [
    AuthController,
    AuthEmailController,
    AuthFacebookController,
    AuthGoogleController,
  ],
  providers: [
    AuthService,
    AuthEmailService,
    AuthFacebookService,
    AuthGoogleService,
    SessionService,
    JwtStrategy,
    JwtRefreshStrategy,
    AnonymousStrategy,
  ],
  exports: [AuthService],
})
export class AuthModule {}
