import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString } from "class-validator";

export class LoginDto {
  @ApiProperty({ example: "user@test.com", description: "로그인 할 메일" })
  @IsEmail()
  email: string;
  @ApiProperty({ example: "1234", description: "로그인 할 비밀번호" })
  @IsString()
  password: string;
}
