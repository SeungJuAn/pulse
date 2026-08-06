import { EntityRepository } from "@mikro-orm/better-sqlite";
import { UnauthorizedException } from "@nestjs/common";
import { User } from "../database/database.entities";
import { MockProxy, mock } from "jest-mock-extended";
import { AuthService } from "./auth.service";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";
jest.mock("bcrypt");
describe("Auth logic Test", () => {
  let userRepo: MockProxy<EntityRepository<User>>;
  let service: AuthService;
  let jwt: MockProxy<JwtService>;

  beforeEach(async () => {
    userRepo = mock<EntityRepository<User>>();
    jwt = mock<JwtService>();
    service = new AuthService(userRepo, jwt);
  });
  it("해당 이메일을 가진 유저가 존재하지않으면 -> 401", async () => {
    userRepo.findOne.mockResolvedValue(null);
    await expect(
      service.login({ email: "ttt@tttt.com", password: "12344565" }),
    ).rejects.toThrow(UnauthorizedException);
  });

  it("암호화된 비밀번호와 입력한 비밀번호가 다르면 Unauthorized", async () => {
    userRepo.findOne.mockResolvedValue({
      id: 1,
      email: "test@test.com",
      password: "123455",
    } as User);

    (bcrypt.compare as jest.Mock).mockResolvedValue(false);
    await expect(
      service.login({ email: "test@test2.com", password: "1234241" }),
    ).rejects.toThrow(UnauthorizedException);
  });

  it("정확한 로그인 시 jwt 승인 완료", async () => {
    userRepo.findOne.mockResolvedValue({
      id: 1,
      email: "test@test.com",
      password: "12341234",
    } as User);
    (bcrypt.compare as jest.Mock).mockResolvedValue(true);
    jwt.sign.mockReturnValue("tok");
    const res = await service.login({
      email: "test@test.com",
      password: "12341234",
    });

    expect(res).toEqual({ accessToken: "tok" });
    expect(jwt.sign).toHaveBeenCalledWith({ sub: 1 });
  });
});
