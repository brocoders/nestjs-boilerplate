import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SecretConfigService } from './secret.service';
import { GLOBAL_SECRET_PATH } from './const.type';

@Global()
@Module({
  imports: [ConfigModule],
  providers: [
    SecretConfigService,
    {
      provide: 'GLOBAL_SECRET_PATH',
      useFactory: (configService: ConfigService) => {
        return (
          configService.get<string>('GLOBAL_SECRET_PATH', { infer: true }) ||
          GLOBAL_SECRET_PATH
        );
      },
      inject: [ConfigService],
    },
  ],
  exports: [SecretConfigService],
})
export class SecretManagerModule {}
