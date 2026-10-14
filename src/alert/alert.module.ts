import { Module } from "@nestjs/common";
import { AlertService } from "./alert.service";
import { AlertController } from "./alert.controller";
import {
  MockEmailNotifier,
  MockSmsNotifier,
  Notifier,
  NOTIFIERS,
} from "./notifier";

@Module({
  controllers: [AlertController],
  providers: [
    AlertService,
    MockEmailNotifier,
    MockSmsNotifier,
    {
      provide: NOTIFIERS,
      useFactory: (...notifiers: Notifier[]) => notifiers,
      inject: [MockEmailNotifier, MockSmsNotifier],
    },
  ],
})
export class AlertModule {}
