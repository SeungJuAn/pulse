import * as bcrypt from "bcrypt";
import {
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { User } from "../database/database.entities";
import { EntityManager, EntityRepository } from "@mikro-orm/better-sqlite";
import { InjectRepository } from "@mikro-orm/nestjs";
import { CreateUserDto } from "./createUserDto";

@Injectable()
export class UserService {
  constructor(
    private readonly entityManager: EntityManager,
    @InjectRepository(User)
    private readonly userRepository: EntityRepository<User>,
  ) {}
  // 유저 조회(id)
  async getUserById(id: number): Promise<User> {
    const getUserInfo = await this.userRepository.findOne({ id });
    if (!getUserInfo) {
      throw new NotFoundException("해당 id를 가진 유저는 존재하지않습니다.");
    }
    return getUserInfo;
  }
  //유저 생성
  async create(createUserDto: CreateUserDto): Promise<number> {
    // 중복 제외 조건 걸기
    const exists = await this.entityManager.findOne(User, {
      email: createUserDto.email,
    });
    if (exists) throw new ConflictException("이미 가입된 이메일입니다.");
    const crptyo = await this.createHashPw(createUserDto.password);
    const result = this.userRepository.create({
      email: createUserDto.email,
      password: crptyo,
    });
    await this.entityManager.flush();
    return result.id;
  }
  private async createHashPw(pw: string): Promise<string> {
    return bcrypt.hash(pw, 10);
  }
}
