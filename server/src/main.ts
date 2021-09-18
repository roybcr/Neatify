import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

let corsOptions = {
  origin: 'http://localhost:3000',
  credentials: true,
};
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({ ...corsOptions });
  await app.listen(8000);
}
bootstrap();
