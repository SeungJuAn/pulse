import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import cookieParser from "cookie-parser";
import { AppModule } from "./app.module";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

const PORT = 3000;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());

  // 🔑 전역 검증 파이프 — 모든 요청 body를 DTO 규칙대로 자동 검증.
  //    이게 calendar 과제엔 없던 것. "문 앞에서 검문"의 핵심.
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // DTO에 선언 안 된 필드는 조용히 제거
      forbidNonWhitelisted: true, // DTO에 없는 필드가 오면 400으로 거부
      transform: true, // 들어온 JSON을 DTO 클래스 인스턴스로 변환
    }),
  );
  const config = new DocumentBuilder()
    .setTitle("Pulse API")
    .setDescription("주식 시세 알람 서비스 API")
    .setVersion("1.0")
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("docs", app, document);
  await app.listen(PORT);
}

bootstrap().then(() => {
  console.log(`Pulse server on http://localhost:${PORT}`);
});
