import { bootstrapOpenTelemetry } from './shared/tracing/otel-loader';
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
import { APIDocs } from './api-docs/api-docs.module';
import { RabbitMQService } from './communication/rabbitMQ/rabbitmq.service';
import { KafkaService } from './communication/kafka/kafak.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  useContainer(app.select(AppModule), { fallbackOnErrors: true });
  const configService = app.get(ConfigService<AllConfigType>);
  const rabbitMQService = app.get(RabbitMQService);
  const kafkaService = app.get(KafkaService);


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
  await bootstrapOpenTelemetry();
  await APIDocs.setup(app);
  await app.listen(configService.getOrThrow('app.port', { infer: true }));
  await APIDocs.info(app);
  // Initialize and start RabbitMQ consumers
  rabbitMQService.initialize(app);
  kafkaService.initialize(app);
  await app.startAllMicroservices();
}
void bootstrap();
