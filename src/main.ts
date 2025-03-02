import 'dotenv/config';
import {
  ClassSerializerInterceptor,
  Logger,
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
import { APIDocs } from './api-docs/api-docs.module';
import { RabbitMQClientOptions } from './communication/config/communication.option';
import { MicroserviceOptions } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  useContainer(app.select(AppModule), { fallbackOnErrors: true });
  const configService = app.get(ConfigService<AllConfigType>);

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

  const logger = new Logger('RabbitMQ');

  // Fetch RabbitMQ options
  const rabbitMQOptions = RabbitMQClientOptions(
    configService,
  ) as MicroserviceOptions;

  const rabbitmqQueues =
    configService.get<string[]>('communication.rabbitmqQueues', {
      infer: true,
    }) || [];
  for (const queueName of rabbitmqQueues) {
    const rabbitMQOptions = RabbitMQClientOptions(configService, {
      consumer: true,
      queueName,
    });
    app.connectMicroservice<MicroserviceOptions>(rabbitMQOptions);
  }

  await app.startAllMicroservices();
  logger.debug(
    'RabbitMQ Microservice started with options:',
    rabbitMQOptions.options,
  );

  await APIDocs.setup(app);
  await app.listen(configService.getOrThrow('app.port', { infer: true }));
  await APIDocs.info(app);
}
void bootstrap();
