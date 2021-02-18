import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { FilesModule } from './files/files.module';
import { AuthModule } from './auth/auth.module';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import databaseConfig from './config/database.config';
import authConfig from './config/auth.config';
import appConfig from './config/app.config';
import mailConfig from './config/mail.config';
import fileConfig from './config/file.config';
import facebookConfig from './config/facebook.config';
import googleConfig from './config/google.config';
import twitterConfig from './config/twitter.config';
import appleConfig from './config/apple.config';
import * as path from 'path';
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConnectionOptions } from 'typeorm';
import { AppleModule } from './apple/apple.module';
import { FacebookModule } from './facebook/facebook.module';
import { GoogleModule } from './google/google.module';
import { TwitterModule } from './twitter/twitter.module';
import { I18nModule } from 'nestjs-i18n/dist/i18n.module';
import { I18nJsonParser } from 'nestjs-i18n/dist/parsers/i18n.json.parser';
import { HeaderResolver } from 'nestjs-i18n';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [
        databaseConfig,
        authConfig,
        appConfig,
        mailConfig,
        fileConfig,
        facebookConfig,
        googleConfig,
        twitterConfig,
        appleConfig,
      ],
      envFilePath: ['.env'],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) =>
        ({
          type: configService.get('database.type'),
          url: configService.get('database.url'),
          host: configService.get('database.host'),
          port: configService.get('database.port'),
          username: configService.get('database.username'),
          password: configService.get('database.password'),
          database: configService.get('database.name'),
          synchronize: configService.get('database.synchronize'),
          dropSchema: false,
          keepConnectionAlive: true,
          logging: configService.get('app.nodeEnv') !== 'production',
          entities: ['dist/**/*.entity{.ts,.js}'],
          cli: {
            entitiesDir: 'src',
            migrationsDir: 'migrations',
            subscribersDir: 'subscriber',
          },
          extra: {
            // based on https://node-postgres.com/api/pool
            // max connection pool size
            max: configService.get('database.maxConnections'),
          },
        } as ConnectionOptions),
    }),
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        transport: {
          host: configService.get('mail.host'),
          port: configService.get('mail.port'),
          ignoreTLS: configService.get('mail.ignoreTLS'),
          secure: configService.get('mail.secure'),
          requireTLS: configService.get('mail.requireTLS'),
          auth: {
            user: configService.get('mail.user'),
            pass: configService.get('mail.password'),
          },
        },
        defaults: {
          from: `"${configService.get(
            'mail.defaultName',
          )}" <${configService.get('mail.defaultEmail')}>`,
        },
        template: {
          dir: path.join(
            configService.get('app.workingDirectory'),
            'mail-templates',
          ),
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true,
          },
        },
      }),
    }),
    I18nModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        fallbackLanguage: configService.get('app.fallbackLanguage'),
        parserOptions: {
          path: path.join(configService.get('app.workingDirectory'), 'i18n'),
        },
      }),
      parser: I18nJsonParser,
      inject: [ConfigService],
      resolvers: [new HeaderResolver(['x-custom-lang'])],
    }),
    UsersModule,
    FilesModule,
    AuthModule,
    FacebookModule,
    GoogleModule,
    TwitterModule,
    AppleModule,
  ],
})
export class AppModule {}
