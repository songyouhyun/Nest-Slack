import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

declare const module: any;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
  .setTitle('Slack API')
  .setDescription('Slack 클론 코딩 개발을 위한 API 문서입니다.')
  .setVersion('1.0')
  .addCookieAuth('connect.sid')
  .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(3000);

  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(()=> app.close());
  }
}
bootstrap();