import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import * as cookieParser from 'cookie-parser';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(cookieParser());

  const configService = app.get(ConfigService);
  const port = configService.get("PORT")

  // const dataSource = app.get(DataSource);
  // if (dataSource.isInitialized) {
  //   console.log('Database connection established successfully!');
  // } else {
  //   console.error('Failed to connect to database!');
  // }

  await app.listen(port);
}
bootstrap();
