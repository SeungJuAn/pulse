import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { MikroOrmModule } from "@mikro-orm/nestjs";
import { User } from "../database/database.entities";
import { JwtModule } from "@nestjs/jwt";
@Module({
  controllers: [AuthController],
  imports: [
    MikroOrmModule.forFeature([User]),
    JwtModule.register({
      secret: "dev-secret-change-me",
      signOptions: { expiresIn: "1h" },
      global: true,
    }),
  ],
  providers: [AuthService],
})
export class AuthModule {}
