import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString, MinLength } from "class-validator";

export class CreateUserDto {
  @ApiProperty({ example: "user@test.com", description: "로그인 이메일" })
  @IsEmail()
  email: string;

  @ApiProperty({ example: "12345678", description: "유저 비밀번호" })
  @IsString()
  @MinLength(8)
  password: string;
}
