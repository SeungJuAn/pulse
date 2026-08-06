import { MikroORM } from "@mikro-orm/core";
import { INestApplication, ValidationPipe } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { AppModule } from "../app.module";
import { User } from "../database/database.entities";
import request from "supertest";
describe("Auth API Test", () => {
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
    await orm.em.fork().nativeDelete(User, {}); // 매 테스트 전 User 비우기
  });
  describe("Auth test", () => {
    it("로그인 성공 -> 200", async () => {
      await request(app.getHttpServer())
        .post("/user")
        .send({ email: "test@test.com", password: "12345678" });

      const res = await request(app.getHttpServer())
        .post("/auth/login")
        .send({ email: "test@test.com", password: "12345678" });
      expect(res.status).toBe(201);
    });
  });
  it("비밀번호가 다를시 -> 401", async () => {
    await request(app.getHttpServer())
      .post("/user")
      .send({ email: "test@test.com", password: "12345678" });

    const res = await request(app.getHttpServer())
      .post("/auth/login")
      .send({ email: "test@test.com", password: "1234" });
    expect(res.status).toBe(401);
  });
  it("회원가입 -> 로그인 -> 토큰 확인 -> 200", async () => {
    const user = { email: "test@test.com", password: "12345678" };
    await request(app.getHttpServer()).post("/user").send(user);
    const login = await request(app.getHttpServer())
      .post("/auth/login")
      .send(user);
    const token = login.body.accessToken;
    const res = await request(app.getHttpServer())
      .get("/auth/me")
      .set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.sub).toBeDefined();
  });
  it("토큰 없을시 -> 401", async () => {
    const user = { email: "test@test.com", password: "12345678" };
    await request(app.getHttpServer()).post("/user").send(user);
    const res = await request(app.getHttpServer()).get("/auth/me");
    expect(res.status).toBe(401);
  });
  it("가짜 토큰이면 → 401", async () => {
    const res = await request(app.getHttpServer())
      .get("/auth/me")
      .set("Authorization", "Bearer abc");
    expect(res.status).toBe(401);
  });
});
