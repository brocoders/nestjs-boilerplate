import 'dotenv/config';
import {
  ClassSerializerInterceptor,
  ValidationPipe,
  VersioningType,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory, Reflector } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { useContainer } from 'class-validator';
import { AppModule } from './app.module';
import validationOptions from './utils/validation-options';
import { AllConfigType } from './config/config.type';
import { ResolvePromisesInterceptor } from './utils/serializer.interceptor';
import { RequestContextInterceptor } from './request-context/request-context.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  useContainer(app.select(AppModule), { fallbackOnErrors: true });
  const configService = app.get(ConfigService<AllConfigType>);

  const corsOrigins = (
    configService.get('app.frontendDomain', { infer: true }) ??
    'http://localhost:3001'
  )
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);

  app.enableCors({
    origin: corsOrigins,
    credentials: true,
    methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: [
      'Authorization',
      'Content-Type',
      'X-Region',
      'Accept-Language',
      'Idempotency-Key',
    ],
  });

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
    // ResolvePromisesInterceptor is used to resolve promises in responses because class-transformer can't do it
    // https://github.com/typestack/class-transformer/issues/549
    new ResolvePromisesInterceptor(),
    new ClassSerializerInterceptor(app.get(Reflector)),
    app.get(RequestContextInterceptor),
  );

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Ecommerce API')
    .setDescription(
      'Multi-vendor e-commerce platform API. ' +
        'All endpoints prefixed /api/v1. ' +
        'Pass Authorization: Bearer <jwt>, X-Region: <ISO country>, Accept-Language: <locale>.',
    )
    .setVersion('1.0')
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
      'jwt',
    )
    .addGlobalParameters(
      {
        name: 'X-Region',
        in: 'header',
        required: false,
        schema: { type: 'string', example: 'SA' },
        description:
          'ISO country code; ignored when multi_region_enabled=false (returns default region)',
      },
      {
        name: 'Accept-Language',
        in: 'header',
        required: false,
        schema: { type: 'string', example: 'en' },
        description: 'Preferred locale; one of: en, ar (default: ar)',
      },
    )
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('docs', app, document);

  await app.listen(configService.getOrThrow('app.port', { infer: true }));
}
void bootstrap();
