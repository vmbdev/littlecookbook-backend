import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { HttpAdapterHost, NestFactory, Reflector } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import * as session from 'express-session';
import * as passport from 'passport';
import { createClient } from 'redis';
import RedisStore from 'connect-redis';
import { AppModule } from './app.module';
import { PrismaClientExceptionFilter } from './prisma/prisma-client-exception/prisma-client-exception.filter';

async function createRedisStore(url: string): Promise<RedisStore> {
  const redisClient = createClient({ url });
  await redisClient.connect();
  const redisStore = new RedisStore({
    client: redisClient,
  });

  return redisStore;
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const { httpAdapter } = app.get(HttpAdapterHost);
  const configService = app.get<ConfigService>(ConfigService);

  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
  app.useGlobalFilters(new PrismaClientExceptionFilter(httpAdapter));
  app.use(
    session({
      store: await createRedisStore(configService.get<string>('redisUrl')),
      // proxy: isProduction,
      secret: configService.get<string>('session.secret'),
      resave: false,
      saveUninitialized: false,
      cookie: {
        // secure: isProduction,
        // httpOnly: isProduction,
        maxAge: 30 * 24 * 60 * 60 * 1000,
        // sameSite: isProduction ? 'none' : undefined
      },
    }),
  );
  app.use(passport.initialize());
  app.use(passport.session());

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Little Cookbook')
    .setDescription('Little Cookbook API')
    .setVersion('0.1')
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api', app, document);

  await app.listen(3000);
}

bootstrap();
