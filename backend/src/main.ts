import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // CORS - CONFIGURAZIONE COMPLETA
  app.enableCors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],
    exposedHeaders: ['Set-Cookie'],
  });
  
  console.log('🔒 CORS abilitato per:', process.env.FRONTEND_URL || 'http://localhost:3000');

  // Cookie parser
  app.use(cookieParser());

  // Validation pipe globale
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    })
  );

  const port = process.env.PORT || 3001;
  await app.listen(port);

  console.log(`\n🚀 Backend avviato su http://localhost:${port}`);
  console.log(`📊 API disponibili su http://localhost:${port}/api`);
  console.log(`🌍 Ambiente: ${process.env.NODE_ENV || 'development'}\n`);
}

bootstrap();

