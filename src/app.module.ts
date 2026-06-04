import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { FilesModule } from './files/files.module';
import { AuthModule } from './auth/auth.module';
import authConfig from './auth/config/auth.config';
import emailAuthConfig from './auth/providers/email/config/email-auth.config';
import appConfig from './common/config/app.config';
import mailConfig from './mail/config/mail.config';
import fileConfig from './files/config/file.config';
import facebookConfig from './auth/providers/facebook/config/facebook.config';
import googleConfig from './auth/providers/google/config/google.config';
import { ConfigModule } from '@nestjs/config';
import { MailModule } from './mail/mail.module';
import { PrismaModule } from './database/prisma.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [
        authConfig,
        emailAuthConfig,
        appConfig,
        mailConfig,
        fileConfig,
        facebookConfig,
        googleConfig,
      ],
      envFilePath: ['.env'],
    }),
    PrismaModule,
    UsersModule,
    FilesModule,
    AuthModule,
    MailModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
