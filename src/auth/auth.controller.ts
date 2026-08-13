import { Body, Controller, Get, Post, Req, UseGuards } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { LoginDto } from "./loginDto";
import { JwtGuard } from "../common/jwt/jwt-auth.guard";
import { ApiBearerAuth } from "@nestjs/swagger";
type JwtPayload = { sub: number; iat: number; exp: number };
@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post("/login")
  async login(@Body() login: LoginDto): Promise<{ accessToken: string }> {
    return this.authService.login(login);
  }

  @Get("/me")
  @UseGuards(JwtGuard)
  @ApiBearerAuth()
  async getMe(@Req() req: Request) {
    return (req as Request & { user: JwtPayload }).user;
  }
}
