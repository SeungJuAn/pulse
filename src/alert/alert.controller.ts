import { Controller, Get, UseGuards } from "@nestjs/common";
import { AlertService } from "./alert.service";
import { JwtGuard } from "../common/jwt/jwt-auth.guard";
import { CurrentUser } from "../common/decorator/user.decorator";
import { JwtPayload } from "../common/jwt/@types";

@Controller("alerts")
export class AlertController {
  constructor(private readonly alertService: AlertService) {}

  @UseGuards(JwtGuard)
  @Get("")
  async getMyAlert(@CurrentUser() user: JwtPayload) {
    return this.alertService.getMyAlarts(user.sub);
  }
}
