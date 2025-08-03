import 'dotenv/config';
import {
  ClassSerializerInterceptor,
  ValidationPipe,
  VersioningType,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory, Reflector } from '@nestjs/core';
import { useContainer } from 'class-validator';
import { AppModule } from './app.module';
import validationOptions from './utils/validation-options';
import { AllConfigType } from './config/config.type';
import { ResolvePromisesInterceptor } from './utils/serializer.interceptor';
import { APIDocs } from './common/api-docs/api-docs.module';
import { RabbitMQService } from './communication/rabbitMQ/rabbitmq.service';
import { DocumentBuilder } from '@nestjs/swagger';
import { LoggerService } from './common/logger/logger.service';
import { LoggerExceptionFilter } from './common/logger/logger-exception.filter';
import { SwaggerTagRegistry } from './common/api-docs/swagger-tag.registry';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: true,
    bufferLogs: true,
  });
  const logger = app.get(LoggerService);
  app.useLogger(logger);
  app.useGlobalFilters(new LoggerExceptionFilter(app.get(LoggerService)));

  useContainer(app.select(AppModule), { fallbackOnErrors: true });
  const configService = app.get(ConfigService<AllConfigType>);
  const rabbitMQService = app.get(RabbitMQService);

  app.enableShutdownHooks();
  app.setGlobalPrefix(
    configService.getOrThrow('app.apiPrefix', { infer: true }),
    {
      exclude: ['/'],
    },
  );
  app.enableVersioning({
    type: VersioningType.URI,
  });
  app.useGlobalPipes(new ValidationPipe(validationOptions));
  app.useGlobalInterceptors(
    new ResolvePromisesInterceptor(),
    new ClassSerializerInterceptor(app.get(Reflector)),
  );

  const builder = new DocumentBuilder()
    .setTitle('API')
    .setDescription(
      '![NestJS](https://img.shields.io/badge/nestjs-%23E0234E.svg?style=for-the-badge&logo=nestjs&logoColor=white) ![Swagger](https://img.shields.io/badge/-Swagger-%23Clojure?style=for-the-badge&logo=swagger&logoColor=white) ![ReadTheDocs](https://img.shields.io/badge/Readthedocs-%23000000.svg?style=for-the-badge&logo=readthedocs&logoColor=white)',
    )
    .setVersion('1.2.0')
    .addBearerAuth()
    .addGlobalParameters({
      in: 'header',
      required: false,
      name: configService.getOrThrow('app.headerLanguage', 'x-custom-lang', {
        infer: true,
      }),
      schema: {
        example: 'en',
      },
    });
  const options = SwaggerTagRegistry.getInstance()
    .registerToBuilder(builder)
    .build();
  await APIDocs.setup(app, options); // doesn't need use swagger SwaggerModule.setup
  await app.listen(configService.getOrThrow('app.port', { infer: true }));
  await APIDocs.info(app);

  rabbitMQService.initialize(app);
  await app.startAllMicroservices();
  app.enableCors(); // <- Allow all CORS requests (default)
}
void bootstrap();
