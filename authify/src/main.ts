import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import 'reflect-metadata';
import cookieSession from 'cookie-session';
import { ValidationPipe } from '@nestjs/common';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  app.use(
    cookieSession({
      keys: ['mysecretkey'],
    }),
  );
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
