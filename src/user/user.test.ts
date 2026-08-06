import { MikroORM } from "@mikro-orm/core";
import { INestApplication, ValidationPipe } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { AppModule } from "../app.module";
import request from "supertest";
import { User } from "../database/database.entities";
describe("User API Test", () => {
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
  describe("User SignIn", () => {
    it("회원가입 성공 -> 201", async () => {
      const res = await request(app.getHttpServer())
        .post("/user")
        .send({ email: "test@test.com", password: "12345678" });
      expect(res.status).toBe(201);
    });
    it("중복 이메일 생성", async () => {
      const res1 = await request(app.getHttpServer())
        .post("/user")
        .send({ email: "test@test.com", password: "12345678" });

      const res2 = await request(app.getHttpServer())
        .post("/user")
        .send({ email: "test@test.com", password: "12345678" });

      expect(res1.status).toBe(201);
      expect(res2.status).toBe(409);
    });

    it("이메일 형식이 다르면 400에러를 내뱉는다", async () => {
      const res = await request(app.getHttpServer())
        .post("/user")
        .send({ email: "test", password: "11234" });
      expect(res.status).toBe(400);
    });
    it("비밀번호가 최소 8글자 이상이 아니면 400에러를 내뱉는다", async () => {
      const res = await request(app.getHttpServer())
        .post("/user")
        .send({ email: "test@test.com", password: "112" });
      expect(res.status).toBe(400);
    });
  });
});
