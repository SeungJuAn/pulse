import { MikroORM } from "@mikro-orm/core";
import { MikroOrmModule } from "@mikro-orm/nestjs";
import { Module, OnModuleInit } from "@nestjs/common";
import { APP_FILTER } from "@nestjs/core";
import { AppController } from "./app.controller";
import { AllExceptionFilter } from "./common/filters/all-exception.filter";
import config from "./database/database.config";
import { entities } from "./database/database.entities";
import { UserModule } from "./user/user.module";
import { AuthModule } from "./auth/auth.module";
import { QuoteModule } from "./quote/quote.module";
import { ScheduleModule } from "@nestjs/schedule";
import { WatchModule } from './watch/watch.module';

@Module({
  imports: [
    MikroOrmModule.forRoot(config),
    MikroOrmModule.forFeature(entities),
    UserModule,
    AuthModule,
    QuoteModule,
    ScheduleModule.forRoot(),
    WatchModule,
    // 👇 M1부터 여기에 모듈을 추가해 나간다: AuthModule, UserModule, ...
  ],
  controllers: [AppController],
  // APP_FILTER 토큰으로 전역 예외 필터 등록 (문자열 'APP_FILTER' 대신 심볼 import — 이게 관용적)
  providers: [{ provide: APP_FILTER, useClass: AllExceptionFilter }],
})
export class AppModule implements OnModuleInit {
  constructor(private readonly orm: MikroORM) {}

  async onModuleInit() {
    // 개발 편의: 엔티티 정의에 맞춰 테이블 자동 생성/갱신 (운영에선 마이그레이션 사용)
    await this.orm.getSchemaGenerator().updateSchema();
  }
}
