import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { AppModule } from './app.module';
import * as config from 'config';

async function bootstrap() {
  const serverConfig = config.get('server');
  const logger = new Logger('bootstrap');

  const app = await NestFactory.create(AppModule);

  /* if (process.env.NODE_ENV === 'development') {
    app.enableCors();
  } */

  app.enableCors();

  const port = process.env.RDS_PORT || serverConfig.port;
  await app.listen(port, '0.0.0.0');
  logger.log(`Application listening on port ${port}`);
}
bootstrap();
