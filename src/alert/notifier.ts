import { Injectable } from "@nestjs/common";

export const NOTIFIERS = Symbol("NOTIFIERS");

type NotifyPayload = {
  to: string;
  message: string;
};

export abstract class Notifier {
  abstract readonly channel: string;
  abstract send(payload: NotifyPayload): Promise<void>;
}
@Injectable()
export class MockEmailNotifier extends Notifier {
  readonly channel: string = "email";
  async send(payload: NotifyPayload) {
    console.log(`[EMAIL] ${payload.to} - ${payload.message}`);
  }
}
@Injectable()
export class MockSmsNotifier extends Notifier {
  readonly channel: string = "sms";
  async send(payload: NotifyPayload) {
    console.log(`[SMS] ${payload.to} - ${payload.message}`);
  }
}
