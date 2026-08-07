import { MikroORM } from "@mikro-orm/core";
import { INestApplication, ValidationPipe } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { AppModule } from "../app.module";
import { Quote } from "../database/database.entities";
import request from "supertest";
describe("QuoteApi Test", () => {
  let app: INestApplication;
  let orm: MikroORM;
  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = moduleRef.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );
    orm = moduleRef.get(MikroORM);

    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });
  beforeEach(async () => {
    await orm.em.fork().nativeDelete(Quote, {});
  });

  it("/symbol 조회시 해당 symbol에 가장 최근 object를 전달한다 ", async () => {
    const em = orm.em.fork();
    em.create(Quote, { symbol: "AAPL", source: "mockDataA", price: 123.45 });
    await em.flush();
    const res = await request(app.getHttpServer()).get(`/quotes/AAPL`);
    expect(res.status).toBe(200);
    expect(res.body.price).toBe(123.45);
  });

  it("/symbol 조회시 해당 symbol이 존재하지않으면 404를 내보낸다 ", async () => {
    const em = orm.em.fork();
    em.create(Quote, { symbol: "AAPL", source: "mockDataA", price: 123.45 });
    await em.flush();
    const res = await request(app.getHttpServer()).get(`/quotes/AAP`);
    expect(res.status).toBe(404);
  });
});
