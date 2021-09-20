import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { CORS_ORIGIN } from './constants';

let corsOptions = {
  origin: CORS_ORIGIN,
  credentials: true,
};
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({ ...corsOptions });
  await app.listen(8000);
}
bootstrap();
