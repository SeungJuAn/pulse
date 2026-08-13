import { Module } from "@nestjs/common";
import { WatchService } from "./watch.service";
import { WatchController } from "./watch.controller";
import { MikroOrmModule } from "@mikro-orm/nestjs";
import { Watch } from "../database/database.entities";

@Module({
  imports: [MikroOrmModule.forFeature([Watch])],
  controllers: [WatchController],
  providers: [WatchService],
})
export class WatchModule {}
