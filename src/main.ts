import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { useContainer } from 'class-validator';
import { ConfigService } from '@nestjs/config';
import { Logger } from 'nestjs-pino';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Logger
  app.useLogger(app.get(Logger));

  // Cors
  app.enableCors();

  // ConfigService
  const configService = app.get(ConfigService);
  const port = configService.get<number>('BACKEND_PORT', 3000);

  // ValidationPipe
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );

  // Swagger
  const configDocument = new DocumentBuilder()
    .setTitle('Talents Softwre')
    .setDescription('Talents Software API')
    .setVersion('0.1')
    .build();
  const document = SwaggerModule.createDocument(app, configDocument, {
    deepScanRoutes: true,
  });
  SwaggerModule.setup('doc', app, document);

  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  await app.listen(port);
}

bootstrap();
