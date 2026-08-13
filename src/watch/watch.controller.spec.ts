import { MikroORM } from "@mikro-orm/core";
import { INestApplication, ValidationPipe } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { AppModule } from "../app.module";
import { User, Watch } from "../database/database.entities";
import request from "supertest";
describe("Watch Api Test", () => {
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
    await orm.em.fork().nativeDelete(Watch, {});
    await orm.em.fork().nativeDelete(User, {});
  });

  const registerAndLogin = async (email: string) => {
    await request(app.getHttpServer())
      .post("/user")
      .send({ email, password: "12345678" });

    const res = await request(app.getHttpServer())
      .post("/auth/login")
      .send({ email, password: "12345678" });

    return res.body.accessToken;
  };

  const createWatch = async (token: string, symbol: string) => {
    return request(app.getHttpServer())
      .post("/watches")
      .set("Authorization", `Bearer ${token}`)
      .send({ symbol, source: "mock-a", operator: "<=", threshold: 140 });
  };

  it("잘못된 operator가 들어올시 400에러를 내보낸다  ", async () => {
    const token = await registerAndLogin("test@test.com");
    const res = await request(app.getHttpServer())
      .post("/watches")
      .set("Authorization", `Bearer ${token}`)
      .send({ symbol: "AAPL", source: "a", operator: "<", threshold: 140 });
    expect(res.status).toBe(400);
  });

  it("watch 조회 시 개인 데이터만 나오게 처리되어 내보낸다", async () => {
    const tokenA = await registerAndLogin("test1@test.com");
    const tokenB = await registerAndLogin("test2@test.com");

    await createWatch(tokenA, "AAPL");
    await createWatch(tokenA, "TSLA");
    await createWatch(tokenB, "NVDA");
    const res = await request(app.getHttpServer())
      .get("/watches")
      .set("Authorization", `Bearer ${tokenA}`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(2);
    const symbols = res.body.map((w: { symbol: string }) => w.symbol);
    expect(symbols).not.toContain("NVDA");
  });
});
