import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from "@nestjs/common";
import { WatchService } from "./watch.service";
import { CreateWatchDto } from "./dto/createWatchDto";
import { JwtGuard } from "../common/jwt/jwt-auth.guard";
import { CurrentUser } from "../common/decorator/user.decorator";
import { JwtPayload } from "../common/jwt/@types";
import { UpdateWatchDto } from "./dto/updateWatchDto";
import { Matchs } from "./@types/watch.type";

@UseGuards(JwtGuard)
@Controller("watches")
export class WatchController {
  constructor(private readonly watchService: WatchService) {}

  @Post("/")
  async create(
    @Body() createWatchDto: CreateWatchDto,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.watchService.create(createWatchDto, user.sub);
  }

  @Get()
  async getWatches(@CurrentUser() user: JwtPayload) {
    return this.watchService.getWatchesToUser(user.sub);
  }

  @Patch(":id")
  async updateWatchs(
    @Param("id", ParseIntPipe) id: number,
    @Body() updateWatch: UpdateWatchDto,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.watchService.updateWatch(id, updateWatch, user.sub);
  }

  @Delete(":id")
  async removeWatchs(
    @Param("id", ParseIntPipe) id: number,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.watchService.removeWatch(id, user.sub);
  }

  @Post("/match")
  async matchs(@Body() match: Matchs) {
    return this.watchService.matchs(match);
  }
}
