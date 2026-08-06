import { EntityRepository } from "@mikro-orm/better-sqlite";
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { User } from "../database/database.entities";
import { InjectRepository } from "@mikro-orm/nestjs";
import * as bcrypt from "bcrypt";
import { LoginDto } from "./loginDto";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: EntityRepository<User>,
    private readonly token: JwtService,
  ) {}
  async login(login: LoginDto): Promise<{ accessToken: string }> {
    const userInfo = await this.userRepository.findOne(
      { email: login.email },
      { populate: ["password"] },
    );
    if (!userInfo) {
      throw new UnauthorizedException("해당 유저는 존재하지않습니다.");
    }
    const checkUser: boolean = await bcrypt.compare(
      login.password,
      userInfo.password,
    );
    if (!checkUser) {
      throw new UnauthorizedException("비밀번호가 틀렸습니다.");
    }

    const accessToken = this.token.sign({ sub: userInfo.id });
    return { accessToken };
  }
}
