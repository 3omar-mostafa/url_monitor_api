import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { generateJwtKeys } from '../utils/generateJwtKeys';

async function bootstrap() {
  if (process.env.NODE_ENV != 'production') {
    generateJwtKeys();
  }

  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));
  await app.listen(process.env.PORT || 3000);
}

bootstrap();
